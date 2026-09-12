const layers = [
  { name: "Own UI", role: "Product experience", tech: "Next.js + React", license: "MIT", status: "Active" },
  { name: "LangGraph", role: "Agent orchestration", tech: "Stateful routing", license: "MIT", status: "Active" },
  { name: "Tool Registry", role: "Controlled execution", tech: "Scoped read/write tools", license: "Template", status: "Active" },
  { name: "MCP", role: "Remote tool boundary", tech: "Scoped connectors", license: "Per connector", status: "Planned" },
  { name: "Browser Use", role: "Browser automation", tech: "Last-mile actions", license: "MIT", status: "Optional" },
  { name: "Mem0", role: "Agent memory", tech: "Durable context", license: "Apache-2.0", status: "Planned" },
  { name: "Model Gateway", role: "Routing & policy", tech: "OpenAI-compatible / vLLM", license: "Adapter MIT", status: "Configurable" },
  { name: "Qwen / DeepSeek / Mistral", role: "Inference", tech: "vLLM", license: "Model-specific OSS", status: "Planned" },
  { name: "OpenLIT", role: "Observability", tech: "Traces & metrics", license: "OSS", status: "Scaffolded" },
  { name: "Promptfoo", role: "Evaluation", tech: "HTTP eval config", license: "MIT", status: "Scaffolded" },
];

const gates = ["Architecture compliance","Real backend behavior","Persistent state","Real integration","Failure-path handling","Browser/API E2E","Observability trace","Evaluation pass"];

export default function Home() {
  return (
    <main>
      <section className="hero shell">
        <div className="eyebrow">OPEN-SOURCE · GOVERNED · REUSABLE</div>
        <h1>Agentic Platform Template</h1>
        <p className="lead">A reusable architecture and working core runtime for AI-native products — designed to prevent mock-only success, uncontrolled agents, hidden model paths, and architecture drift.</p>
        <div className="actions">
          <a className="button primary" href="/runtime">Open Runtime Console</a>
          <a className="button" href="https://github.com/majaber1/agentic-platform-template">View GitHub</a>
          <a className="button" href="/api/health">Health API</a>
        </div>
        <div className="meta"><span>Architecture baseline: v1</span><span>Runtime: Phase 1</span><span>Template license: MIT</span></div>
      </section>

      <section className="shell section">
        <div className="sectionHeading"><div><div className="eyebrow">REFERENCE ARCHITECTURE</div><h2>One controlled path from user intent to verified execution.</h2></div><p>Phase 1 activates LangGraph and a scoped tool registry. Model requests use exactly one gateway path and fail visibly when no real model is configured.</p></div>
        <div className="flow"><div className="flowNode strong">Our Own UI</div><div className="arrow">↓</div><div className="flowNode">LangGraph · Active</div><div className="arrow">↓</div><div className="flowSplit"><span>Tool Registry · Active</span><span>MCP · Next</span><span>Browser Use · Optional</span></div><div className="arrow">↓</div><div className="flowNode">Model Gateway · Configurable</div><div className="arrow">↓</div><div className="flowSplit"><span>Qwen</span><span>DeepSeek</span><span>Mistral</span></div><div className="arrow">↓</div><div className="flowSplit"><span>OpenLIT · Next</span><span>Promptfoo · Scaffolded</span></div></div>
      </section>

      <section className="shell section"><div className="eyebrow">STACK INVENTORY</div><h2>Implemented state is visible, not assumed.</h2><div className="grid">{layers.map((layer) => <article className="card" key={layer.name}><div className="cardTop"><h3>{layer.name}</h3><span className={`pill ${layer.status.toLowerCase()}`}>{layer.status}</span></div><p>{layer.role}</p><dl><div><dt>Implementation</dt><dd>{layer.tech}</dd></div><div><dt>License</dt><dd>{layer.license}</dd></div></dl></article>)}</div></section>

      <section className="shell section twoCol"><div><div className="eyebrow">DEFINITION OF DONE</div><h2>No mock-only completion.</h2><p className="muted">A feature is complete only after the real business journey works and persists.</p></div><div className="checklist">{gates.map((gate,index)=><div className="check" key={gate}><span>{String(index+1).padStart(2,"0")}</span>{gate}</div>)}</div></section>

      <section className="shell section callout"><div><div className="eyebrow">PHASE 1 ACTIVE</div><h2>Run the workflow before adding connectors.</h2></div><p>The runtime console proves UI → API → LangGraph → scoped tool execution. Next phases add MCP transport, persistence/memory, and observability without changing the architecture baseline.</p></section>
      <footer className="shell footer">Agentic Platform Template · governed open-source AI foundation · 2026</footer>
    </main>
  );
}
