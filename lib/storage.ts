import fs from "fs/promises"
import path from "path"
import { loadConfig } from "./config"

// Types for our messages
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  created_at: number
  updated_at: number
  provider: string
  model: string
}

// Path to the history directory
const HISTORY_DIR = path.join(process.cwd(), "chat_history")

// Ensuring the existence of the directory
async function ensureHistoryDir() {
  try {
    await fs.access(HISTORY_DIR)
  } catch {
    // If the directory does not exist we create one
    await fs.mkdir(HISTORY_DIR, { recursive: true })
  }
}

// Saving a session
export async function saveSession(session: ChatSession): Promise<void> {
  await ensureHistoryDir()
  const filePath = path.join(HISTORY_DIR, `${session.id}.json`)

  try {
    await fs.writeFile(filePath, JSON.stringify(session, null, 2), "utf8")
  } catch (error) {
    console.error("Chyba při ukládání session:", error)
    throw new Error("Nepodařilo se uložit konverzaci - možná je disk plný jako hospoda v pátek")
  }
}

// Loading session
export async function loadSession(sessionId: string): Promise<ChatSession | null> {
  await ensureHistoryDir()
  const filePath = path.join(HISTORY_DIR, `${sessionId}.json`)

  try {
    const content = await fs.readFile(filePath, "utf8")
    return JSON.parse(content) as ChatSession
  } catch (error) {
    // Session does not exist or is corrupted
    return null
  }
}

// Retrieving all sessions
export async function getAllSessions(): Promise<ChatSession[]> {
  await ensureHistoryDir()

  try {
    const files = await fs.readdir(HISTORY_DIR)
    const jsonFiles = files.filter((file) => file.endsWith(".json"))

    const sessions: ChatSession[] = []

    for (const file of jsonFiles) {
      try {
        const content = await fs.readFile(path.join(HISTORY_DIR, file), "utf8")
        const session = JSON.parse(content) as ChatSession
        sessions.push(session)
      } catch (error) {
        // Damaged file
        console.warn(`Poškozený soubor session: ${file}`)
      }
    }

    // Sort by update date
    return sessions.sort((a, b) => b.updated_at - a.updated_at)
  } catch (error) {
    console.error("Chyba při načítání sessions:", error)
    return []
  }
}

// Deleting a session
export async function deleteSession(sessionId: string): Promise<void> {
  await ensureHistoryDir()
  const filePath = path.join(HISTORY_DIR, `${sessionId}.json`)

  try {
    await fs.unlink(filePath)
  } catch (error) {
    // File may not exist
    console.warn(`Session ${sessionId} neexistuje nebo už byla smazána`)
  }
}

// Cleaning up old sessions
export async function cleanupOldSessions(): Promise<void> {
  const config = loadConfig()
  const sessions = await getAllSessions()

  if (sessions.length > config.app.max_history_files) {
    // Sort by date and delete the oldest ones
    const sessionsToDelete = sessions
      .sort((a, b) => a.updated_at - b.updated_at)
      .slice(0, sessions.length - config.app.max_history_files)

    for (const session of sessionsToDelete) {
      await deleteSession(session.id)
    }
  }
}

// Generating an ID for a session
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Export session to text
export function exportSessionToText(session: ChatSession): string {
  let content = `# ${session.title}\n\n`
  content += `**Vytvořeno:** ${new Date(session.created_at).toLocaleString("cs-CZ")}\n`
  content += `**Provider:** ${session.provider}\n`
  content += `**Model:** ${session.model}\n\n`
  content += "---\n\n"

  for (const message of session.messages) {
    const timestamp = new Date(message.timestamp).toLocaleString("cs-CZ")
    const role = message.role === "user" ? "👤 Uživatel" : "🤖 AI"
    content += `## ${role} (${timestamp})\n\n${message.content}\n\n`
  }

  return content
}
