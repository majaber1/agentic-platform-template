export type GatewayResult = {
  status: "OK" | "NOT_CONFIGURED" | "ERROR";
  output: string;
  model?: string;
  latencyMs?: number;
};

function completionEndpoint(baseUrl: string) {
  const clean = baseUrl.replace(/\/$/, "");
  return clean.endsWith("/v1") ? `${clean}/chat/completions` : `${clean}/v1/chat/completions`;
}

export async function callModel(message: string): Promise<GatewayResult> {
  const baseUrl = process.env.MODEL_GATEWAY_BASE_URL;
  const model = process.env.DEFAULT_MODEL;
  const apiKey = process.env.MODEL_GATEWAY_API_KEY;

  if (!baseUrl || !model) {
    return {
      status: "NOT_CONFIGURED",
      output: "Model runtime is not configured. Set MODEL_GATEWAY_BASE_URL and DEFAULT_MODEL to an OpenAI-compatible gateway such as vLLM."
    };
  }

  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(completionEndpoint(baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: "You are an enterprise AI runtime. Be concise, factual, and never pretend a tool or source was used when it was not." },
          { role: "user", content: message }
        ]
      }),
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      return { status: "ERROR", model, latencyMs: Date.now() - started, output: `Gateway returned HTTP ${response.status}.` };
    }

    const json = await response.json();
    const output = json?.choices?.[0]?.message?.content;
    if (typeof output !== "string" || !output.trim()) {
      return { status: "ERROR", model, latencyMs: Date.now() - started, output: "Gateway response did not contain choices[0].message.content." };
    }

    return { status: "OK", model, latencyMs: Date.now() - started, output };
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Unknown gateway error";
    return { status: "ERROR", model, latencyMs: Date.now() - started, output: messageText };
  } finally {
    clearTimeout(timeout);
  }
}
