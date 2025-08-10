// Single Session API
import { NextResponse } from "next/server"
import { loadChat } from "@/lib/chat-storage"

export const dynamic = 'force-dynamic'; // Prevent caching

// Load specific session
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await loadChat(params.id)

    if (!session) {
      return NextResponse.json({ error: "Chat nicht gefunden" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Fehler beim Laden der Session:", error)
    return NextResponse.json({ error: "Chat kann nicht geladen werden" }, { status: 500 })
  }
}