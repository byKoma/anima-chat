"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProviderSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

interface ConfigData {
  activeProvider: string
  defaultModel: string
  availableModels: string[]
  appConfig: {
    name: string
    description: string
  }
}

// Selektor providera a modelu - jako když si vybíráš pivo v hospodě
export function ProviderSelector({ selectedModel, onModelChange }: ProviderSelectorProps) {
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [loading, setLoading] = useState(true)

  // Načtení konfigurace při mountu - jako když si čteš jídelní lístek
  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/chat")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Chyba při načítání konfigurace:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !config) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg animate-pulse">
        <div className="w-4 h-4 bg-white/20 rounded"></div>
        <div className="w-24 h-4 bg-white/20 rounded"></div>
      </div>
    )
  }

  // Získání názvu modelu bez prefixu providera - jako když si zkracuješ jméno
  const getModelDisplayName = (model: string) => {
    return model.split("/").pop() || model
  }

  // Ikona podle providera - protože každý provider má svůj styl
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "openrouter":
        return "🌐"
      case "openai":
        return "🤖"
      case "ollama":
        return "🦙"
      default:
        return "⚡"
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Informace o aktivním provideru - jako jmenovka */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
        <span className="text-lg">{getProviderIcon(config.activeProvider)}</span>
        <div className="text-sm">
          <div className="font-medium text-white">{config.activeProvider}</div>
          <div className="text-xs text-gray-400">Provider</div>
        </div>
      </div>

      {/* Dropdown pro výběr modelu - jako když si vybíráš z menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="
              bg-white/10 border-white/20 text-white hover:bg-white/15
              backdrop-blur-sm transition-all duration-200
            "
          >
            <Zap className="h-4 w-4 mr-2" />
            {getModelDisplayName(selectedModel)}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="
            bg-gray-900/95 border-white/20 backdrop-blur-md
            text-white min-w-[200px]
          "
          align="end"
        >
          <DropdownMenuLabel className="text-gray-300">Dostupné modely</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/20" />

          {config.availableModels.map((model) => (
            <DropdownMenuItem
              key={model}
              onClick={() => onModelChange(model)}
              className="
                hover:bg-white/10 focus:bg-white/10 cursor-pointer
                transition-colors duration-150
              "
            >
              <div className="flex items-center justify-between w-full">
                <span>{getModelDisplayName(model)}</span>
                {model === selectedModel && <span className="text-blue-400">✓</span>}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
