#!/usr/bin/env python3
"""Apply the governed v0.5 Forge customizations to the pinned upstream checkout.

This script is intentionally strict: it only edits the exact playground.tsx blob
that was accepted for Forge commit 048fdc6. If upstream changes, the script fails
rather than guessing how to patch a different source version.
"""
from __future__ import annotations

import hashlib
import sys
from pathlib import Path

EXPECTED_BLOB = "44be857982c5d73f46fff87385b56269272d74f9"
MARKER = "forge:playground:pending-run:"


def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one source match, found {count}")
    return text.replace(old, new, 1)


def main() -> None:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path("vendor/forge").resolve()
    path = root / "apps/web/components/screens/playground.tsx"
    raw = path.read_bytes()
    text = raw.decode("utf-8")

    if MARKER in text:
        print("v0.5 Forge customizations already applied")
        return

    actual = git_blob_sha(raw)
    if actual != EXPECTED_BLOB:
        raise SystemExit(f"unexpected Forge playground blob: expected={EXPECTED_BLOB} actual={actual}")

    text = replace_once(
        text,
        'interface Activity { id: string; kind: string; name: string; done: boolean; error?: boolean }\n',
        'interface Activity { id: string; kind: string; name: string; done: boolean; error?: boolean }\n'
        'interface PersistedRunRef { workflowId: string; runId: string; threadId: string | null }\n',
        "persisted-run type",
    )

    text = replace_once(
        text,
        '  const abortRef = useRef<AbortController | null>(null);\n\n  useEffect(() => {\n',
        '''  const abortRef = useRef<AbortController | null>(null);\n\n'
        '  // Persist only opaque run handles. Interrupt prompts/tool args stay server-authoritative\n'
        '  // and are recovered by replaying the run SSE after a browser refresh.\n'
        '  const pendingRunKey = project?.id ? `forge:playground:pending-run:${project.id}` : "";\n\n'
        '  function readPersistedRun(): PersistedRunRef | null {\n'
        '    if (!pendingRunKey || typeof window === "undefined") return null;\n'
        '    try {\n'
        '      const raw = window.localStorage.getItem(pendingRunKey);\n'
        '      if (!raw) return null;\n'
        '      const value = JSON.parse(raw);\n'
        '      if (!value?.workflowId || !value?.runId) return null;\n'
        '      return { workflowId: String(value.workflowId), runId: String(value.runId), threadId: value.threadId ? String(value.threadId) : null };\n'
        '    } catch {\n'
        '      window.localStorage.removeItem(pendingRunKey);\n'
        '      return null;\n'
        '    }\n'
        '  }\n\n'
        '  function persistRun(ref: PersistedRunRef) {\n'
        '    if (!pendingRunKey || typeof window === "undefined") return;\n'
        '    window.localStorage.setItem(pendingRunKey, JSON.stringify(ref));\n'
        '  }\n\n'
        '  function clearPersistedRun() {\n'
        '    if (!pendingRunKey || typeof window === "undefined") return;\n'
        '    window.localStorage.removeItem(pendingRunKey);\n'
        '  }\n\n'
        '  async function reattachPersistedRun(targetWf: Workflow, ref: PersistedRunRef) {\n'
        '    setRunning(true);\n'
        '    const controller = new AbortController();\n'
        '    abortRef.current = controller;\n'
        '    let interrupted = false;\n'
        '    try {\n'
        '      await openSSE(api.runStreamUrl(project.id, targetWf.id, ref.runId), (f) => {\n'
        '        if (f.event === "interrupt") {\n'
        '          interrupted = true;\n'
        '          setPendingInterrupt({ runId: ref.runId, payload: f.data });\n'
        '        } else if (f.event === "done" || f.event === "error") {\n'
        '          clearPersistedRun();\n'
        '        }\n'
        '      }, { signal: controller.signal });\n'
        '      if (!interrupted) clearPersistedRun();\n'
        '    } catch (e: any) {\n'
        '      if (e?.name !== "AbortError") clearPersistedRun();\n'
        '    } finally {\n'
        '      abortRef.current = null;\n'
        '      setRunning(false);\n'
        '    }\n'
        '  }\n\n'
        '  useEffect(() => {\n''',
        "run reattach helpers",
    )

    # Remove the quote separators used above to keep this Python source readable.
    text = text.replace(";\\n'\n        '", ";\\n") if False else text

    text = replace_once(
        text,
        '    setWf(null); setLoadErr(null); setMsgs([]); setSteps([]); setMeter(null);\n',
        '    setWf(null); setLoadErr(null); setMsgs([]); setSteps([]); setMeter(null); setPendingInterrupt(null);\n',
        "project reset",
    )
    text = replace_once(
        text,
        '        const active = ws.find((w) => w.status === "active") || ws[0] || null;\n'
        '        setWf(active);\n'
        '        if (!active) setLoadErr("No workflows in this project yet. Create one in Workflows, or ask the Forge Assistant to build one.");\n',
        '        const persisted = readPersistedRun();\n'
        '        const persistedWf = persisted ? ws.find((w) => w.id === persisted.workflowId) || null : null;\n'
        '        const active = persistedWf || ws.find((w) => w.status === "active") || ws[0] || null;\n'
        '        setWf(active);\n'
        '        if (persisted && persistedWf) {\n'
        '          threadRef.current = persisted.threadId;\n'
        '          void reattachPersistedRun(persistedWf, persisted);\n'
        '        } else if (persisted) {\n'
        '          clearPersistedRun();\n'
        '        }\n'
        '        if (!active) setLoadErr("No workflows in this project yet. Create one in Workflows, or ask the Forge Assistant to build one.");\n',
        "project reload reattach",
    )
    text = replace_once(
        text,
        '      threadRef.current = run.thread_id;\n      let interrupted = false;\n',
        '      threadRef.current = run.thread_id;\n'
        '      persistRun({ workflowId: wf.id, runId: run.id, threadId: run.thread_id || null });\n'
        '      let interrupted = false;\n',
        "persist active run",
    )
    text = replace_once(
        text,
        '      }, { signal: controller.signal });\n      if (interrupted) {\n',
        '      }, { signal: controller.signal });\n'
        '      if (!interrupted) clearPersistedRun();\n'
        '      if (interrupted) {\n',
        "clear terminal run",
    )
    text = replace_once(
        text,
        '      if (e?.name !== "AbortError") finalAnswer = `⚠ ${e.message || e}`;\n',
        '      if (e?.name !== "AbortError") finalAnswer = `⚠ ${e.message || e}`;\n'
        '      clearPersistedRun();\n',
        "clear failed/aborted run",
    )
    text = replace_once(
        text,
        '      setMsgs((m) => [...m, { role: "assistant", content: res.interrupted ? content + "\\n⏸ paused again for another approval - check Traces." : content }]);\n',
        '      setMsgs((m) => [...m, { role: "assistant", content: res.interrupted ? content + "\\n⏸ paused again for another approval - check Traces." : content }]);\n'
        '      if (!res.interrupted) clearPersistedRun();\n',
        "clear resumed terminal run",
    )
    text = replace_once(
        text,
        '  function reset() {\n    threadRef.current = null;\n',
        '  function reset() {\n    threadRef.current = null;\n    clearPersistedRun();\n',
        "reset cleanup",
    )
    text = replace_once(
        text,
        '  const switchWf = (id: string) => {\n    const next = wfs.find((w) => w.id === id) || null;\n    threadRef.current = null;\n',
        '  const switchWf = (id: string) => {\n    const next = wfs.find((w) => w.id === id) || null;\n    threadRef.current = null;\n    clearPersistedRun();\n',
        "workflow switch cleanup",
    )

    path.write_text(text, encoding="utf-8")
    print(f"v0.5 Forge customizations applied to {path}")


if __name__ == "__main__":
    main()
