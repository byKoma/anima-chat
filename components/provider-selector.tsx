// LLM provider and model selection component
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ProviderSelectorProps {
  providers: string[]
  models: Record<string, string[]>
  activeProvider: string
  activeModel: string
  onProviderChange: (provider: string) => void
  onModelChange: (model: string) => void
}

export function ProviderSelector({
  providers,
  models,
  activeProvider,
  activeModel,
  onProviderChange,
  onModelChange,
}: ProviderSelectorProps) {
  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider)
    // Auto-select first model from new provider
    const firstModel = models[newProvider]?.[0]
    if (firstModel) {
      onModelChange(firstModel)
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900/30 backdrop-blur-sm border-b border-gray-700">
      {/* Current selection status */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-300">Active:</span>
        <Badge variant="secondary" className="bg-gray-700 text-gray-200">
          {activeProvider} / {activeModel}
        </Badge>
      </div>

      {/* Provider selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Provider:</span>
        <Select value={activeProvider} onValueChange={handleProviderChange}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {providers.map((provider) => (
              <SelectItem key={provider} value={provider} className="text-gray-200">
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Model:</span>
        <Select value={activeModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {models[activeProvider]?.map((model) => (
              <SelectItem key={model} value={model} className="text-gray-200">
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
