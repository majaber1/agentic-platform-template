const layers = [
  { name: "Own UI", role: "Product experience", tech: "Next.js + React", license: "MIT", status: "Active" },
  { name: "LangGraph", role: "Agent orchestration", tech: "Stateful routing", license: "MIT", status: "Active" },
  { name: "Tool Registry", role: "Controlled execution", tech: "Read/write metadata", license: "Template", status: "Active" },
  { name: "Action Policy", role: "Human-in-the-loop guard", tech: "Fail-closed bounded approvals", license: "Template", status: "Active" },
  { name: "MCP v2 Core", role: "Standard tool protocol", tech: "Client + server", license: "MIT", status: "Active" },
  { name: "Remote MCP", role: "Approved connectors", tech: "Registry + HTTP probe", license: "Per connector", status: "Configurable" },
  { name: "Model Gateway", role: "Routing & policy", tech: "OpenAI-compatible / vLLM", license: "Adapter MIT", status: "Configurable" },
  { name: "Persistent Memory", role: "Durable context", tech: "Provider selected per project", license: "Provider-specific", status: "Planned" },
  { name: "Observability", role: "Traces & metrics", tech: "Collector selected per project", license: "Provider-specific", status: "Planned" },
  { name: "Promptfoo", role: "Evaluation", tech: "HTTP eval config", license: "MIT", status: "Scaffolded" },
  { name: "Browser Use", role: "Last-mile automation", tech: "Optional", license: "MIT", status: "Optional" },
];

const gates = ["Architecture compliance","Real backend behavior","Persistent state when required","Real integration","Authorization + approval","Failure-path handling","Browser/API E2E","Observability + evaluation"];

export default function Home() {
  return (
    <main>
      <section className="hero shell">
        <div className="eyebrow">OPEN-SOURCE · GOVERNED · PRODUCTION-TESTED CORE</div>
        <h1>Agentic Platform Template</h1>
        <p className="lead">A reusable foundation for AI-native products with real LangGraph orchestration, MCP, governed actions, and truthful runtime status — without pretending unconfigured models or connectors are active.</p>
        <div className="actions">
          <a className="button primary" href="/runtime">Open Runtime Console</a>
          <a className="button" href="/api/runtime/selftest">Run Self-Test</a>
          <a className="button" href="https://github.com/majaber1/agentic-platform-template">View GitHub</a>
        </div>
        <div className="meta"><span>Baseline: v0.4</span><span>Runtime: Phase 3</span><span>Template license: MIT</span></div>
      </section>

      <section className="shell section">
        <div className="sectionHeading"><div><div className="eyebrow">REFERENCE ARCHITECTURE</div><h2>One controlled path from intent to execution.</h2></div><p>Agents route through explicit tools and MCP boundaries. Write actions are governed. Missing infrastructure fails visibly instead of falling back to fake success.</p></div>
        <div className="flow"><div className="flowNode strong">Our Own UI</div><div className="arrow">↓</div><div className="flowNode">LangGraph · Active</div><div className="arrow">↓</div><div className="flowSplit"><span>Local Tools · Active</span><span>MCP v2 · Active</span><span>Browser · Optional</span></div><div className="arrow">↓</div><div className="flowNode">Action Policy · Read / Write / Approval</div><div className="arrow">↓</div><div className="flowNode">Model Gateway · Configure real endpoint</div><div className="arrow">↓</div><div className="flowSplit"><span>Qwen</span><span>DeepSeek</span><span>Mistral</span></div><div className="arrow">↓</div><div className="flowSplit"><span>Observability · Next</span><span>Promptfoo · Scaffolded</span></div></div>
      </section>

      <section className="shell section"><div className="eyebrow">STACK INVENTORY</div><h2>Status is explicit: Active is not the same as Planned.</h2><div className="grid">{layers.map((layer) => <article className="card" key={layer.name}><div className="cardTop"><h3>{layer.name}</h3><span className={`pill ${layer.status.toLowerCase().replace(" ", "-")}`}>{layer.status}</span></div><p>{layer.role}</p><dl><div><dt>Implementation</dt><dd>{layer.tech}</dd></div><div><dt>License</dt><dd>{layer.license}</dd></div></dl></article>)}</div></section>

      <section className="shell section twoCol"><div><div className="eyebrow">DEFINITION OF DONE</div><h2>No mock-only completion.</h2><p className="muted">A consuming product completes its domain features only after the applicable real business journey works and persists.</p></div><div className="checklist">{gates.map((gate,index)=><div className="check" key={gate}><span>{String(index+1).padStart(2,"0")}</span>{gate}</div>)}</div></section>

      <section className="shell section callout"><div><div className="eyebrow">READY TO FORK</div><h2>Use the same governed core for Scrap AI, enterprise assistants, or a new SaaS.</h2></div><p>The core runtime is reusable. Business schemas, persistence, authenticated approvals, connectors and model endpoints belong to each consuming product.</p></section>
      <footer className="shell footer">Agentic Platform Template · governed open-source AI foundation · v0.4</footer>
    </main>
  );
}
