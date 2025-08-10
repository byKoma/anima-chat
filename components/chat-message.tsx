// Single chat message component
"use client"

import type { ChatMessage as ChatMessageType } from "@/lib/llm-providers"
import { MarkdownRenderer } from "./markdown-renderer"
import { Button } from "@/components/ui/button"
import { Copy, User, Bot, Check } from "lucide-react"
import { useState } from "react"

interface ChatMessageProps {
  message: ChatMessageType
  showTimestamp?: boolean
  showWordCount?: boolean
  compactMode?: boolean
  theme?: "dark" | "light"
}

export function ChatMessage({
  message,
  showTimestamp = true,
  showWordCount = false,
  compactMode = false,
  theme = "dark",
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  // Copy message content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Fehler beim Kopieren:", error)
    }
  }

  // Calculate word count
  const wordCount = message.content.split(/\s+/).filter((word) => word.length > 0).length

  const isUser = message.role === "user"
  const isDark = theme === "dark"

  return (
    <div
      className={`flex gap-4 ${compactMode ? "p-2" : "p-4"} ${
        isUser ? (isDark ? "bg-blue-50/10" : "bg-blue-50") : isDark ? "bg-gray-50/5" : "bg-gray-50"
      } rounded-lg backdrop-blur-sm`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 ${compactMode ? "w-6 h-6" : "w-8 h-8"} rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : isDark ? "bg-gray-600" : "bg-gray-400"
        }`}
      >
        {isUser ? (
          <User size={compactMode ? 12 : 16} className="text-white" />
        ) : (
          <Bot size={compactMode ? 12 : 16} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className={`flex items-center gap-2 ${compactMode ? "mb-1" : "mb-2"}`}>
          <span
            className={`${compactMode ? "text-xs" : "text-sm"} font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {isUser ? "Du" : "KI"}
          </span>

          {showTimestamp && (
            <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {new Date(message.timestamp).toLocaleTimeString("de-DE")}
            </span>
          )}

          {showWordCount && (
            <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{wordCount} Words</span>
          )}
        </div>

        {/* Message content */}
        <div className={isDark ? "text-gray-100" : "text-gray-900"}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} theme={theme} />
          )}
        </div>

        {/* Actions */}
        {!isUser && (
          <div className={compactMode ? "mt-1" : "mt-2"}>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className={`${compactMode ? "h-6 text-xs" : "h-8"} ${
                isDark
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              {copied ? (
                <Check size={compactMode ? 12 : 14} className="mr-1 text-green-500" />
              ) : (
                <Copy size={compactMode ? 12 : 14} className="mr-1" />
              )}
              {copied ? "Kopiert!" : "Kopieren"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
