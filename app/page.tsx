const layers = [
  { name: "Own UI", role: "Product experience", tech: "Next.js + React", license: "MIT", status: "Active" },
  { name: "LangGraph", role: "Agent orchestration", tech: "Stateful workflows", license: "MIT", status: "Planned" },
  { name: "MCP", role: "Tool boundary", tech: "Scoped connectors", license: "Per connector", status: "Planned" },
  { name: "Browser Use", role: "Browser automation", tech: "Last-mile actions", license: "MIT", status: "Optional" },
  { name: "Mem0", role: "Agent memory", tech: "Durable context", license: "Apache-2.0", status: "Planned" },
  { name: "Model Gateway", role: "Routing & policy", tech: "Open-source gateway", license: "Approved OSS", status: "Planned" },
  { name: "Qwen / DeepSeek / Mistral", role: "Inference", tech: "vLLM", license: "Model-specific OSS", status: "Planned" },
  { name: "OpenLIT", role: "Observability", tech: "Traces & metrics", license: "Apache-2.0", status: "Planned" },
  { name: "Promptfoo", role: "Evaluation", tech: "Evals + red team", license: "MIT", status: "Planned" },
];

const gates = [
  "Architecture compliance",
  "Real backend behavior",
  "Persistent state",
  "Real integration",
  "Failure-path handling",
  "Browser/API E2E",
  "Observability trace",
  "Evaluation pass",
];

export default function Home() {
  return (
    <main>
      <section className="hero shell">
        <div className="eyebrow">OPEN-SOURCE · GOVERNED · REUSABLE</div>
        <h1>Agentic Platform Template</h1>
        <p className="lead">
          A reusable architecture baseline for AI-native products — designed to prevent mock-only success,
          uncontrolled agents, hidden model paths, and architecture drift.
        </p>
        <div className="actions">
          <a className="button primary" href="https://github.com/majaber1/agentic-platform-template">View GitHub</a>
          <a className="button" href="/api/health">Health API</a>
        </div>
        <div className="meta">
          <span>Architecture baseline: v1</span>
          <span>Template license: MIT</span>
          <span>Deployment: Vercel-ready</span>
        </div>
      </section>

      <section className="shell section">
        <div className="sectionHeading">
          <div>
            <div className="eyebrow">REFERENCE ARCHITECTURE</div>
            <h2>One controlled path from user intent to verified execution.</h2>
          </div>
          <p>Every layer has one job. Tools are scoped, models are routed centrally, and every material AI flow is observable and evaluable.</p>
        </div>
        <div className="flow">
          <div className="flowNode strong">Our Own UI</div><div className="arrow">↓</div>
          <div className="flowNode">LangGraph · Orchestration</div><div className="arrow">↓</div>
          <div className="flowSplit"><span>MCP</span><span>Browser Use</span><span>Approved Tools</span></div><div className="arrow">↓</div>
          <div className="flowNode">Mem0 · Memory</div><div className="arrow">↓</div>
          <div className="flowNode">Open-source Model Gateway</div><div className="arrow">↓</div>
          <div className="flowSplit"><span>Qwen</span><span>DeepSeek</span><span>Mistral</span></div><div className="arrow">↓</div>
          <div className="flowSplit"><span>OpenLIT · Observe</span><span>Promptfoo · Evaluate</span></div>
        </div>
      </section>

      <section className="shell section">
        <div className="eyebrow">STACK INVENTORY</div>
        <h2>Open-source first, with explicit boundaries.</h2>
        <div className="grid">
          {layers.map((layer) => (
            <article className="card" key={layer.name}>
              <div className="cardTop"><h3>{layer.name}</h3><span className={`pill ${layer.status.toLowerCase()}`}>{layer.status}</span></div>
              <p>{layer.role}</p>
              <dl><div><dt>Implementation</dt><dd>{layer.tech}</dd></div><div><dt>License</dt><dd>{layer.license}</dd></div></dl>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section twoCol">
        <div>
          <div className="eyebrow">DEFINITION OF DONE</div>
          <h2>No mock-only completion.</h2>
          <p className="muted">A feature is complete only after the real business journey works and persists.</p>
        </div>
        <div className="checklist">
          {gates.map((gate, index) => <div className="check" key={gate}><span>{String(index + 1).padStart(2, "0")}</span>{gate}</div>)}
        </div>
      </section>

      <section className="shell section callout">
        <div><div className="eyebrow">STARTING POINT</div><h2>Fork once. Govern every AI project the same way.</h2></div>
        <p>Read ARCHITECTURE_BASELINE.md, GOVERNANCE.md, AGENTS.md and PROJECT_START_PROMPT.md before implementation.</p>
      </section>

      <footer className="shell footer">Agentic Platform Template · Open-source architecture scaffold · 2026</footer>
    </main>
  );
}
