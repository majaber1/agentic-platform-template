"use client";

import { useEffect, useState } from "react";

type RuntimeComponent = { name: string; state: string; detail: string };
type RuntimeStatus = { runtime: string; components: RuntimeComponent[]; tools: { name: string; description: string; mode: string }[] };

export default function RuntimeClient() {
  const [runtime, setRuntime] = useState<RuntimeStatus | null>(null);
  const [message, setMessage] = useState("mcp status");
  const [result, setResult] = useState("Run the workflow to see the real trace.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/runtime/status", { cache: "no-store" }).then((r) => r.json()).then(setRuntime).catch(() => setRuntime(null));
  }, []);

  async function run() {
    setBusy(true);
    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const json = await response.json();
      setResult(JSON.stringify({ httpStatus: response.status, ...json }, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="runtimeGrid">
        {(runtime?.components ?? []).map((component) => (
          <article className="runtimeCard" key={component.name}>
            <div className="cardTop"><h3>{component.name}</h3><span className={`runtimeState state-${component.state.toLowerCase()}`}>{component.state}</span></div>
            <p>{component.detail}</p>
          </article>
        ))}
      </section>

      <section className="runtimeConsole">
        <div>
          <div className="eyebrow">REAL LANGGRAPH + MCP E2E</div>
          <h2>Run the core runtime</h2>
          <p className="muted">Try <code>mcp status</code> for LangGraph → official MCP client/server → registered tool, or <code>platform status</code> for the local scoped tool. Normal AI questions require a real configured model gateway.</p>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
          <button className="button primary runtimeButton" onClick={run} disabled={busy}>{busy ? "Running…" : "Run workflow"}</button>
        </div>
        <pre>{result}</pre>
      </section>

      <section className="section runtimeTools">
        <div className="eyebrow">LOCAL TOOL REGISTRY</div>
        <h2>Only explicitly registered tools are exposed.</h2>
        {(runtime?.tools ?? []).map((tool) => <div className="toolRow" key={tool.name}><code>{tool.name}</code><span>{tool.mode}</span><p>{tool.description}</p></div>)}
      </section>
    </>
  );
}
