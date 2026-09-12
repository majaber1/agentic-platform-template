import RuntimeClient from "./runtime-client";

export default function RuntimePage() {
  return (
    <main>
      <section className="hero shell runtimeHero">
        <div className="eyebrow">PHASE 1 · CORE AGENT RUNTIME</div>
        <h1>Runtime Console</h1>
        <p className="lead">A truthful reference runtime: LangGraph is active, a scoped tool is executable, and model calls are blocked until a real OpenAI-compatible gateway is configured.</p>
        <div className="actions"><a className="button" href="/">Back to architecture</a><a className="button" href="/api/runtime/status">Runtime API</a></div>
      </section>
      <div className="shell"><RuntimeClient /></div>
      <footer className="shell footer">Phase 1 runtime · no mock model · no hidden provider path</footer>
    </main>
  );
}
