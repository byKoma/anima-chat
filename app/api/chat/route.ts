// API endpoint for chat
import { type NextRequest, NextResponse } from "next/server"
import { loadConfig } from "@/lib/config"
import { callOpenAI, callOpenRouter, callOllama, type ChatMessage } from "@/lib/llm-providers"

export async function POST(request: NextRequest) {
  try {
    const { messages, provider, model } = await request.json()

    // Load configuration
    const config = loadConfig()

    // Validation
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 })
    }

    const activeProvider = provider || config.llm.active_provider
    const activeModel = model || config.llm.default_model

    // Add system prompt
    const systemMessage: ChatMessage = {
      role: "system",
      content: config.llm.system_prompt,
      timestamp: Date.now(),
    }

    const allMessages = [systemMessage, ...messages]

    // Create stream response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const onStream = (chunk: string) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
        }

        const callProvider = async () => {
          try {
            switch (activeProvider) {
              case "openai":
                await callOpenAI(allMessages, activeModel, config.llm.api_keys.openai, onStream)
                break
              case "openrouter":
                await callOpenRouter(allMessages, activeModel, config.llm.api_keys.openrouter, onStream)
                break
              case "ollama":
                await callOllama(allMessages, activeModel, onStream)
                break
              default:
                throw new Error(`Unsupported provider: ${activeProvider}`)
            }

            // End stream
            controller.enqueue(encoder.encode("data: [DONE]\n\n"))
            controller.close()
          } catch (error) {
            console.error("Error calling LLM:", error)
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  error: error instanceof Error ? error.message : "Unknown error",
                })}\n\n`,
              ),
            )
            controller.close()
          }
        }

        callProvider()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
