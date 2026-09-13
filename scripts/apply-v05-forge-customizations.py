#!/usr/bin/env python3
"""Apply governed v0.5 customizations to the pinned Forge checkout.

Strict by design: only the exact accepted upstream playground.tsx blob may be
modified. If upstream changes, fail instead of guessing how to patch it.
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

    helpers = '''  const abortRef = useRef<AbortController | null>(null);

  // Persist only opaque run handles. Interrupt prompts/tool args stay server-authoritative
  // and are recovered by replaying the run SSE after a browser refresh.
  const pendingRunKey = project?.id ? `forge:playground:pending-run:${project.id}` : "";

  function readPersistedRun(): PersistedRunRef | null {
    if (!pendingRunKey || typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(pendingRunKey);
      if (!raw) return null;
      const value = JSON.parse(raw);
      if (!value?.workflowId || !value?.runId) return null;
      return { workflowId: String(value.workflowId), runId: String(value.runId), threadId: value.threadId ? String(value.threadId) : null };
    } catch {
      window.localStorage.removeItem(pendingRunKey);
      return null;
    }
  }

  function persistRun(ref: PersistedRunRef) {
    if (!pendingRunKey || typeof window === "undefined") return;
    window.localStorage.setItem(pendingRunKey, JSON.stringify(ref));
  }

  function clearPersistedRun() {
    if (!pendingRunKey || typeof window === "undefined") return;
    window.localStorage.removeItem(pendingRunKey);
  }

  async function reattachPersistedRun(targetWf: Workflow, ref: PersistedRunRef) {
    setRunning(true);
    const controller = new AbortController();
    abortRef.current = controller;
    let interrupted = false;
    try {
      await openSSE(api.runStreamUrl(project.id, targetWf.id, ref.runId), (f) => {
        if (f.event === "interrupt") {
          interrupted = true;
          setPendingInterrupt({ runId: ref.runId, payload: f.data });
        } else if (f.event === "done" || f.event === "error") {
          clearPersistedRun();
        }
      }, { signal: controller.signal });
      if (!interrupted) clearPersistedRun();
    } catch (e: any) {
      if (e?.name !== "AbortError") clearPersistedRun();
    } finally {
      abortRef.current = null;
      setRunning(false);
    }
  }

  useEffect(() => {
'''
    text = replace_once(
        text,
        '  const abortRef = useRef<AbortController | null>(null);\n\n  useEffect(() => {\n',
        helpers,
        "run reattach helpers",
    )

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
        "clear failed or aborted run",
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
