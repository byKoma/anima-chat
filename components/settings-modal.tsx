// Settings Modal Component
"use client"

import { useState, useEffect } from "react"
import { Settings, X, Save, RotateCcw, Eye, EyeOff, Palette, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { LLMConfig } from "@/lib/config"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  config: LLMConfig
  onSave: (config: LLMConfig) => void
}

export function SettingsModal({ isOpen, onClose, config, onSave }: SettingsModalProps) {
  const [localConfig, setLocalConfig] = useState<LLMConfig>(config)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalConfig(config)
    setHasChanges(false)
  }, [config, isOpen])

  // Follow Changes
  const updateConfig = (updates: Partial<LLMConfig>) => {
    setLocalConfig((prev) => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const updateLLMConfig = (updates: Partial<LLMConfig["llm"]>) => {
    updateConfig({ llm: { ...localConfig.llm, ...updates } })
  }

  const updateAppConfig = (updates: Partial<LLMConfig["app"]>) => {
    updateConfig({ app: { ...localConfig.app, ...updates } })
  }

  const updateUIConfig = (updates: Partial<LLMConfig["ui"]>) => {
    updateConfig({ ui: { ...localConfig.ui, ...updates } })
  }

  // Refresh API Key
  const updateApiKey = (provider: string, key: string) => {
    updateLLMConfig({
      api_keys: { ...localConfig.llm.api_keys, [provider]: key },
    })
  }

  // Safe
  const handleSave = () => {
    onSave(localConfig)
    setHasChanges(false)
  }

  // Reset
  const handleReset = () => {
    setLocalConfig(config)
    setHasChanges(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            {hasChanges && (
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
                Unsaved changes
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white bg-transparent"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>

                <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}

            <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="llm" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="llm" className="data-[state=active]:bg-blue-600">
                <Zap className="h-4 w-4 mr-2" />
                AI Models
              </TabsTrigger>
              <TabsTrigger value="app" className="data-[state=active]:bg-blue-600">
                <Globe className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="ui" className="data-[state=active]:bg-blue-600">
                <Palette className="h-4 w-4 mr-2" />
                User Interface
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-blue-600">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </TabsTrigger>
            </TabsList>

            {/* AI Models Tab */}
            <TabsContent value="llm" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Provider & Models</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your AI providers and available models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Active Provider */}
                  <div className="space-y-2">
                    <Label className="text-white">Active Provider</Label>
                    <Select
                      value={localConfig.llm.active_provider}
                      onValueChange={(value) => updateLLMConfig({ active_provider: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {Object.keys(localConfig.llm.models).map((provider) => (
                          <SelectItem key={provider} value={provider} className="text-white">
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Standard Modell */}
                  <div className="space-y-2">
                    <Label className="text-white">Standard model</Label>
                    <Select
                      value={localConfig.llm.default_model}
                      onValueChange={(value) => updateLLMConfig({ default_model: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {localConfig.llm.models[localConfig.llm.active_provider]?.map((model) => (
                          <SelectItem key={model} value={model} className="text-white">
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-gray-600" />

                  {/* API Key */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">API Key</Label>
                      <Button
                        onClick={() => setShowApiKeys(!showApiKeys)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>

                    {Object.entries(localConfig.llm.api_keys).map(([provider, key]) => (
                      <div key={provider} className="space-y-2">
                        <Label className="text-gray-300 capitalize">{provider}</Label>
                        <Input
                          type={showApiKeys ? "text" : "password"}
                          value={key}
                          onChange={(e) => updateApiKey(provider, e.target.value)}
                          placeholder={`${provider} API Key`}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Modell Parameter</CardTitle>
                  <CardDescription className="text-gray-400">Feinabstimmung der KI-Antworten</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Temperature */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Temperature</Label>
                      <span className="text-sm text-gray-400">{localConfig.llm.temperature}</span>
                    </div>
                    <Slider
                      value={[localConfig.llm.temperature]}
                      onValueChange={([value]) => updateLLMConfig({ temperature: value })}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">Lower values = more consistent, higher values = more creative</p>
                  </div>

                  {/* Max Tokens */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Max Tokens</Label>
                      <span className="text-sm text-gray-400">{localConfig.llm.max_tokens}</span>
                    </div>
                    <Slider
                      value={[localConfig.llm.max_tokens]}
                      onValueChange={([value]) => updateLLMConfig({ max_tokens: value })}
                      max={4096}
                      min={256}
                      step={256}
                      className="w-full"
                    />
                  </div>

                  {/* Top P */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Top P</Label>
                      <span className="text-sm text-gray-400">{localConfig.llm.top_p}</span>
                    </div>
                    <Slider
                      value={[localConfig.llm.top_p]}
                      onValueChange={([value]) => updateLLMConfig({ top_p: value })}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">System Prompt</CardTitle>
                  <CardDescription className="text-gray-400">Define the behavior of the AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={localConfig.llm.system_prompt}
                    onChange={(e) => updateLLMConfig({ system_prompt: e.target.value })}
                    placeholder="Du bist ein hilfreicher Assistent..."
                    className="min-h-[100px] bg-gray-700 border-gray-600 text-white"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="app" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">General settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Design</Label>
                    <Select
                      value={localConfig.app.theme}
                      onValueChange={(value: "dark" | "light") => updateAppConfig({ theme: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="dark" className="text-white">
                          Dark
                        </SelectItem>
                        <SelectItem value="light" className="text-white">
                          Light
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Auto Save</Label>
                      <p className="text-sm text-gray-400">Automatically save chats</p>
                    </div>
                    <Switch
                      checked={localConfig.app.auto_save}
                      onCheckedChange={(checked) => updateAppConfig({ auto_save: checked })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Max. chat history</Label>
                      <span className="text-sm text-gray-400">{localConfig.app.max_history_files}</span>
                    </div>
                    <Slider
                      value={[localConfig.app.max_history_files]}
                      onValueChange={([value]) => updateAppConfig({ max_history_files: value })}
                      max={500}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* UI Tab */}
            <TabsContent value="ui" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Interface</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Sidebar width</Label>
                      <span className="text-sm text-gray-400">{localConfig.ui.sidebar_width}px</span>
                    </div>
                    <Slider
                      value={[localConfig.ui.sidebar_width]}
                      onValueChange={([value]) => updateUIConfig({ sidebar_width: value })}
                      max={400}
                      min={200}
                      step={20}
                      className="w-full"
                    />
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Show timestamp</Label>
                      <p className="text-sm text-gray-400">Show timestamps for messages</p>
                    </div>
                    <Switch
                      checked={localConfig.ui.show_timestamps}
                      onCheckedChange={(checked) => updateUIConfig({ show_timestamps: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Show word count</Label>
                      <p className="text-sm text-gray-400">Show word count in messages</p>
                    </div>
                    <Switch
                      checked={localConfig.ui.show_word_count}
                      onCheckedChange={(checked) => updateUIConfig({ show_word_count: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Compact mode</Label>
                      <p className="text-sm text-gray-400">Reduced spacing and smaller elements</p>
                    </div>
                    <Switch
                      checked={localConfig.ui.compact_mode}
                      onCheckedChange={(checked) => updateUIConfig({ compact_mode: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced  Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Advanced settings</CardTitle>
                  <CardDescription className="text-gray-400">For experienced users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Configuration (YAML)</Label>
                    <Textarea
                      value={JSON.stringify(localConfig, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value)
                          setLocalConfig(parsed)
                          setHasChanges(true)
                        } catch (error) {
                          // Ignore invalid JSON
                        }
                      }}
                      className="min-h-[300px] bg-gray-700 border-gray-600 text-white font-mono text-sm"
                      placeholder="Configuration as JSON..."
                    />
                    <p className="text-xs text-gray-500">
                      Caution: Invalid configuration may damage the application.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
