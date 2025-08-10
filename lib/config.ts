// Configuration management and types
import yaml from "js-yaml"
import fs from "fs"
import path from "path"

export interface LLMConfig {
  llm: {
    active_provider: string
    api_keys: Record<string, string>
    models: Record<string, string[]>
    default_model: string
    system_prompt: string
    temperature: number
    max_tokens: number
    top_p: number
  }
  app: {
    name: string
    logo: string
    theme: "dark" | "light"
    language: string
    auto_save: boolean
    max_history_files: number
  }
  ui: {
    sidebar_width: number
    show_timestamps: boolean
    show_word_count: boolean
    enable_sound: boolean
    compact_mode: boolean
  }
}

// Load configuration from YAML
export function loadConfig(): LLMConfig {
  try {
    const configPath = path.join(process.cwd(), "config.yaml")
    const fileContents = fs.readFileSync(configPath, "utf8")
    const config = yaml.load(fileContents) as LLMConfig

    if (!config.llm || !config.app) {
      throw new Error("Ungültige Konfiguration - prüfe deine config.yaml")
    }

    return config
  } catch (error) {
    console.error("Fehler beim Laden der Konfiguration:", error)
    // Fallback configuration
    return {
      llm: {
        active_provider: "openai",
        api_keys: { openai: "" },
        models: { openai: ["gpt-3.5-turbo"] },
        default_model: "gpt-3.5-turbo",
        system_prompt: "Du bist ein hilfreicher Assistent.",
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1.0,
      },
      app: {
        name: "Anima",
        logo: "/logo.svg",
        theme: "dark",
        language: "de",
        auto_save: true,
        max_history_files: 100,
      },
      ui: {
        sidebar_width: 260,
        show_timestamps: true,
        show_word_count: true,
        enable_sound: false,
        compact_mode: false,
      },
    }
  }
}

// Save configuration
export function saveConfig(config: LLMConfig): void {
  try {
    const configPath = path.join(process.cwd(), "config.yaml")
    const yamlString = yaml.dump(config, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
    })
    fs.writeFileSync(configPath, yamlString, "utf8")
  } catch (error) {
    console.error("Fehler beim Speichern der Konfiguration:", error)
    throw new Error("Konfiguration konnte nicht gespeichert werden")
  }
}
