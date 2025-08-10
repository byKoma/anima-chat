"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  isStreaming?: boolean
  onStopStreaming?: () => void
}

// Input for chat
export function ChatInput({ onSendMessage, disabled, isStreaming, onStopStreaming }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  // Sending a message
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  // Keyboard shortcut processing
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Shift+Enter = new line
  }

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-gray-900/95 to-transparent backdrop-blur-md border-t border-white/10 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          {/* Textarea for message */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napiš svou zprávu... (Enter = odeslat, Shift+Enter = nový řádek)"
              disabled={disabled}
              className="
                min-h-[50px] max-h-[200px] resize-none
                bg-white/10 border-white/20 text-white placeholder:text-gray-400
                focus:bg-white/15 focus:border-blue-400/50
                backdrop-blur-sm rounded-xl
                transition-all duration-200
              "
              rows={1}
            />

            {/* Character counter */}
            {message.length > 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">{message.length}</div>
            )}
          </div>

          {/* Send/stop button */}
          {isStreaming ? (
            <Button
              onClick={onStopStreaming}
              variant="destructive"
              size="icon"
              className="h-12 w-12 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30"
            >
              <Square className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              size="icon"
              className="
                h-12 w-12 rounded-xl
                bg-blue-500/20 hover:bg-blue-500/30 
                border border-blue-400/30
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Help for keyboard shortcuts */}
        <div className="text-xs text-gray-500 mt-2 text-center">
          <kbd className="px-1 py-0.5 bg-gray-800/50 rounded text-xs">Enter</kbd> odeslat •
          <kbd className="px-1 py-0.5 bg-gray-800/50 rounded text-xs ml-1">Shift+Enter</kbd> nový řádek
        </div>
      </div>
    </div>
  )
}
