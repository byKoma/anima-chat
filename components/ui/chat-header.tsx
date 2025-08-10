"use client"

import { useState } from "react"
import { MessageSquare, Download, Trash2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProviderSelector } from "./provider-selector"

interface ChatHeaderProps {
  sessionId: string | null
  selectedModel: string
  onModelChange: (model: string) => void
  onClearChat: () => void
  onNewChat: () => void
}

// Chat header 
export function ChatHeader({ sessionId, selectedModel, onModelChange, onClearChat, onNewChat }: ChatHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Export conversation
  const handleExport = async (format: "txt" | "md") => {
    if (!sessionId) return

    setIsExporting(true)
    try {
      const response = await fetch(`/api/export?id=${sessionId}&format=${format}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `chat_${sessionId}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Chyba při exportu:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold text-white">Czech LLM Chat</h1>
            </div>
            <div className="hidden md:block text-sm text-gray-400">
              Open-source chat s AI - lepší než hovory s tchyní
            </div>
          </div>

          {/* Right side - controls */}
          <div className="flex items-center gap-3">
            {/* Provider selector */}
            <div className="hidden lg:block">
              <ProviderSelector selectedModel={selectedModel} onModelChange={onModelChange} />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* New chat */}
              <Button
                onClick={onNewChat}
                variant="outline"
                size="sm"
                className="
                  bg-white/10 border-white/20 text-white hover:bg-white/15
                  backdrop-blur-sm transition-all duration-200
                "
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nový chat</span>
              </Button>

              {/* Export menu - only if we have a session */}
              {sessionId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isExporting}
                      className="
                        bg-white/10 border-white/20 text-white hover:bg-white/15
                        backdrop-blur-sm transition-all duration-200
                      "
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Export</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="bg-gray-900/95 border-white/20 backdrop-blur-md text-white"
                    align="end"
                  >
                    <DropdownMenuItem
                      onClick={() => handleExport("txt")}
                      className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                    >
                      Export jako TXT
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport("md")}
                      className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                    >
                      Export jako Markdown
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Deleting a chat with confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="
                      bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20
                      backdrop-blur-sm transition-all duration-200
                    "
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Smazat</span>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-gray-900/95 border-white/20 backdrop-blur-md text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Opravdu smazat chat?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      Tato akce je nevratná. Všechny zprávy v tomto chatu budou trvale smazány. Je to jako když spálíš
                      dopisy od ex - už se nevrátí.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                      Zrušit
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onClearChat}
                      className="bg-red-500/20 border-red-400/30 text-red-400 hover:bg-red-500/30"
                    >
                      Ano, smazat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Mobile menu for provider selector */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="
                      bg-white/10 border-white/20 text-white hover:bg-white/15
                      backdrop-blur-sm transition-all duration-200
                    "
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="bg-gray-900/95 border-white/20 backdrop-blur-md text-white w-64"
                  align="end"
                >
                  <div className="p-3">
                    <ProviderSelector selectedModel={selectedModel} onModelChange={onModelChange} />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
