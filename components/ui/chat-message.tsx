"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { ChatMessage } from "@/lib/storage"

interface ChatMessageProps {
  message: ChatMessage
}

// Komponenta pro zobrazení jedné zprávy - jako bublina v komiksu, ale chytřejší
export function ChatMessageComponent({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  // Kopírování do schránky - protože někdy chceš citovat AI jako Shakespeara
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset po 2 sekundách - jako když zapomeneš vtip
    } catch (error) {
      console.error("Nepodařilo se zkopírovat text:", error)
    }
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
        max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-md border
        ${isUser ? "bg-blue-500/20 border-blue-300/30 text-blue-50" : "bg-white/10 border-white/20 text-gray-100"}
        shadow-lg transition-all duration-300 hover:shadow-xl
      `}
      >
        {/* Hlavička zprávy - jako jmenovka na párty */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs opacity-70 font-medium">{isUser ? "👤 Ty" : "🤖 AI"}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-50">{new Date(message.timestamp).toLocaleTimeString("cs-CZ")}</span>
            {!isUser && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 w-6 p-0 hover:bg-white/10">
                {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
              </Button>
            )}
          </div>
        </div>

        {/* Obsah zprávy - tady je to maso */}
        <div className="prose prose-invert prose-sm max-w-none">
          {isUser ? (
            // Uživatelské zprávy zobrazíme jednoduše - jako když mluvíš normálně
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            // AI zprávy s Markdown - protože AI umí formátovat jako profík
            <ReactMarkdown
              components={{
                // Vlastní komponenta pro kód - s syntax highlightingem jako v IDE
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg !bg-gray-900/50 !mt-2 !mb-2"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-800/50 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
                // Vlastní styly pro různé elementy - jako když si upravuješ byt
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-400/50 pl-4 italic opacity-80 mb-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}
