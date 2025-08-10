// LLM provider interfaces and implementations
export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

export interface StreamResponse {
  content: string
  done: boolean
}

// OpenAI API implementation
export async function callOpenAI(
  messages: ChatMessage[],
  model: string,
  apiKey: string,
  onStream: (chunk: string) => void,
): Promise<void> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error("Cannot read stream")

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.trim())

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") return

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              onStream(content)
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// OpenRouter API implementation
export async function callOpenRouter(
  messages: ChatMessage[],
  model: string,
  apiKey: string,
  onStream: (chunk: string) => void,
): Promise<void> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Anima",
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  // Same streaming logic as OpenAI
  const reader = response.body?.getReader()
  if (!reader) throw new Error("Cannot read stream")

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.trim())

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") return

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              onStream(content)
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// Ollama local API implementation
export async function callOllama(
  messages: ChatMessage[],
  model: string,
  onStream: (chunk: string) => void,
): Promise<void> {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error("Cannot read stream")

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.trim())

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line)
          if (parsed.message?.content) {
            onStream(parsed.message.content)
          }
          if (parsed.done) return
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
