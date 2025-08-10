// Message input component with auto-resize
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Square } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  theme?: "dark" | "light"
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  theme = "dark",
  placeholder = "Schreibe eine Nachricht...",
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isDark = theme === "dark"

  // Auto-resize the text area based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={`border-t p-4 ${
        isDark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white/50"
      } backdrop-blur-sm`}
    >
      <div className="flex gap-2 items-end max-w-4xl mx-auto">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`min-h-[44px] max-h-[200px] resize-none ${
              isDark
                ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-gray-100/50 border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            rows={1}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className={`${
            disabled || !message.trim()
              ? isDark
                ? "bg-gray-700 text-gray-500"
                : "bg-gray-300 text-gray-400"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } transition-colors duration-200`}
        >
          {disabled ? <Square size={16} /> : <Send size={16} />}
        </Button>
      </div>

      {/* Keyboard shortcuts help */}
      <div className={`text-xs mt-2 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        <kbd className={`px-1 py-0.5 rounded text-xs ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>Enter</kbd> to send
        •<kbd className={`px-1 py-0.5 rounded text-xs ml-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>Shift</kbd> +
        <kbd className={`px-1 py-0.5 rounded text-xs ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>Enter</kbd> for new Line
      </div>
    </div>
  )
}
