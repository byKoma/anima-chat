// Chat memory management
import fs from "fs"
import path from "path"
import type { ChatMessage } from "./llm-providers"

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
  model: string
  provider: string
  settings: {
    temperature: number
    max_tokens: number
    system_prompt: string
  }
}

const CHATS_DIR = path.join(process.cwd(), "chats")

// Secure chat directory
export function ensureChatsDir(): void {
  if (!fs.existsSync(CHATS_DIR)) {
    fs.mkdirSync(CHATS_DIR, { recursive: true })
  }
}

// Generate chat file name
function getChatFileName(chatId: string): string {
  return `${chatId}.json`
}

// Save chat
export function saveChat(session: ChatSession): void {
  ensureChatsDir()
  const fileName = getChatFileName(session.id)
  const filePath = path.join(CHATS_DIR, fileName)

  try {
    fs.writeFileSync(filePath, JSON.stringify(session, null, 2), "utf8")
  } catch (error) {
    console.error("Fehler beim Speichern des Chats:", error)
    throw new Error("Chat konnte nicht gespeichert werden")
  }
}

// Load chat
export function loadChat(chatId: string): ChatSession | null {
  try {
    const fileName = getChatFileName(chatId)
    const filePath = path.join(CHATS_DIR, fileName)

    if (!fs.existsSync(filePath)) return null

    const data = fs.readFileSync(filePath, "utf8")
    const chat = JSON.parse(data) as ChatSession

    // Make sure that the message array is always present
    if (chat && !Array.isArray(chat.messages)) {
      chat.messages = []
    }

    return chat
  } catch (error) {
    console.error("Fehler beim Laden des Chats:", error)
    return null
  }
}

// Load all chats
export function loadAllChats(): ChatSession[] {
  try {
    ensureChatsDir()
    const files = fs.readdirSync(CHATS_DIR)
    const chats: ChatSession[] = []

    for (const file of files) {
      if (file.endsWith(".json")) {
        const chatId = file.replace(".json", "")
        const chat = loadChat(chatId)
        if (chat) chats.push(chat)
      }
    }

    // Sort by update date, newest first
    return chats.sort((a, b) => b.updatedAt - a.updatedAt)
  } catch (error) {
    console.error("Fehler beim Laden der Chats:", error)
    return []
  }
}

// Chat löschen
export function deleteChat(chatId: string): boolean {
  try {
    const fileName = getChatFileName(chatId)
    const filePath = path.join(CHATS_DIR, fileName)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error("Fehler beim Löschen des Chats:", error)
    return false
  }
}

// Rename chat
export function renameChat(chatId: string, newTitle: string): boolean {
  try {
    const chat = loadChat(chatId)
    if (!chat) return false

    chat.title = newTitle
    chat.updatedAt = Date.now()
    saveChat(chat)
    return true
  } catch (error) {
    console.error("Fehler beim Umbenennen des Chats:", error)
    return false
  }
}

// Export chat
export function exportChat(chatId: string, format: "txt" | "md" | "json"): string | null {
  try {
    const chat = loadChat(chatId)
    if (!chat) return null

    switch (format) {
      case "json":
        return JSON.stringify(chat, null, 2)

      case "md":
        let mdContent = `# ${chat.title}\n\n`
        mdContent += `**Erstellt:** ${new Date(chat.createdAt).toLocaleString("de-DE")}\n`
        mdContent += `**Modell:** ${chat.model}\n`
        mdContent += `**Provider:** ${chat.provider}\n\n`
        mdContent += "---\n\n"

        for (const message of chat.messages) {
          const timestamp = new Date(message.timestamp).toLocaleString("de-DE")
          const role = message.role === "user" ? "👤 Benutzer" : "🤖 KI"
          mdContent += `## ${role} (${timestamp})\n\n${message.content}\n\n`
        }
        return mdContent

      case "txt":
      default:
        let txtContent = `${chat.title}\n`
        txtContent += `Erstellt: ${new Date(chat.createdAt).toLocaleString("de-DE")}\n`
        txtContent += `Modell: ${chat.model}\n`
        txtContent += `Provider: ${chat.provider}\n\n`
        txtContent += "=".repeat(50) + "\n\n"

        for (const message of chat.messages) {
          const timestamp = new Date(message.timestamp).toLocaleString("de-DE")
          const role = message.role === "user" ? "Benutzer" : "KI"
          txtContent += `${role} (${timestamp}):\n${message.content}\n\n`
        }
        return txtContent
    }
  } catch (error) {
    console.error("Fehler beim Exportieren des Chats:", error)
    return null
  }
}

// Chat statistics
export function getChatStats(chatId: string): {
  messageCount: number
  wordCount: number
  characterCount: number
  duration: number
} | null {
  try {
    const chat = loadChat(chatId)
    if (!chat) return null

    const messageCount = chat.messages.length
    const wordCount = chat.messages.reduce((count, msg) => count + msg.content.split(/\s+/).length, 0)
    const characterCount = chat.messages.reduce((count, msg) => count + msg.content.length, 0)
    const duration = chat.updatedAt - chat.createdAt

    return { messageCount, wordCount, characterCount, duration }
  } catch (error) {
    console.error("Fehler beim Berechnen der Chat-Statistiken:", error)
    return null
  }
}