// Chat session management API
import { type NextRequest, NextResponse } from "next/server"
import { saveChat, loadAllChats, deleteChat, type ChatSession } from "@/lib/chat-storage"
import { v4 as uuidv4 } from "uuid"

// Get all sessions
export async function GET() {
  try {
    const sessions = loadAllChats()
    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error loading sessions:", error)
    return NextResponse.json({ error: "Cannot load sessions" }, { status: 500 })
  }
}

// Create or update session
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (data.action === "create") {
      // Create new session
      const newSession: ChatSession = {
        id: uuidv4(),
        title: data.title || "New chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      saveChat(newSession)
      return NextResponse.json(newSession)
    }

    if (data.action === "update") {
      // Update existing session
      const session: ChatSession = {
        ...data.session,
        updatedAt: Date.now(),
      }

      saveChat(session)
      return NextResponse.json(session)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error saving session:", error)
    return NextResponse.json({ error: "Cannot save session" }, { status: 500 })
  }
}

// Delete session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("id")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    const success = deleteChat(sessionId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "Cannot delete session" }, { status: 500 })
  }
}
