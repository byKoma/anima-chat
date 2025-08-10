// Configuration API endpoint
import { type NextRequest, NextResponse } from "next/server"
import { loadConfig, saveConfig } from "@/lib/config"

// Retrieve configuration
export async function GET() {
  try {
    const config = loadConfig()

    // Frontend-sichere Konfiguration zurückgeben
    return NextResponse.json(config)
  } catch (error) {
    console.error("Fehler beim Laden der Konfiguration:", error)
    return NextResponse.json({ error: "Konfiguration kann nicht geladen werden" }, { status: 500 })
  }
}

// Save configuration
export async function POST(request: NextRequest) {
  try {
    const newConfig = await request.json()

    // Validate and save configuration
    saveConfig(newConfig)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Speichern der Konfiguration:", error)
    return NextResponse.json({ error: "Konfiguration kann nicht gespeichert werden" }, { status: 500 })
  }
}
