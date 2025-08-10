// Simple Markdown renderer
"use client"

import type React from "react"

interface MarkdownRendererProps {
  content: string
  theme?: "dark" | "light"
}

// Basic Markdown parser and renderer
export function MarkdownRenderer({ content, theme = "dark" }: MarkdownRendererProps) {
  const isDark = theme === "dark"

  const renderContent = (text: string) => {
    // Split text into code blocks and normal text
    const parts = text.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Code-Block Rendering
        const code = part.slice(3, -3)
        const lines = code.split("\n")
        const language = lines[0].trim()
        const codeContent = lines.slice(1).join("\n")

        return (
          <div key={index} className="my-4">
            <div
              className={`px-4 py-2 text-sm font-mono rounded-t-lg ${
                isDark ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
              }`}
            >
              {language || "code"}
            </div>
            <pre
              className={`p-4 overflow-x-auto rounded-b-lg ${
                isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
              }`}
            >
              <code className="font-mono text-sm whitespace-pre">{codeContent}</code>
            </pre>
          </div>
        )
      } else {
        // Normal text with simple markdown
        return (
          <div key={index} className="prose prose-invert max-w-none">
            {renderSimpleMarkdown(part)}
          </div>
        )
      }
    })
  }

  // Process simple Markdown elements
  const renderSimpleMarkdown = (text: string) => {
    return text.split("\n").map((line, lineIndex) => {
      if (line.trim() === "") {
        return <br key={lineIndex} />
      }

      // Headings
      if (line.startsWith("# ")) {
        return (
          <h1 key={lineIndex} className={`text-2xl font-bold mt-4 mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {line.slice(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={lineIndex} className={`text-xl font-bold mt-3 mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {line.slice(3)}
          </h2>
        )
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={lineIndex} className={`text-lg font-bold mt-2 mb-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {line.slice(4)}
          </h3>
        )
      }

      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={lineIndex} className="ml-4">
            {processInlineMarkdown(line.slice(2))}
          </li>
        )
      }

      // Normal sales
      return (
        <p key={lineIndex} className="mb-2">
          {processInlineMarkdown(line)}
        </p>
      )
    })
  }

  // Process inline Markdown elements
  const processInlineMarkdown = (text: string) => {
    const parts = []
    let currentText = text
    let key = 0

    // Bold **text**
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${key}__`
      parts.push({ type: "bold", content, placeholder })
      key++
      return placeholder
    })

    // Italic *text*
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${key}__`
      parts.push({ type: "italic", content, placeholder })
      key++
      return placeholder
    })

    // Links [text](url)
    currentText = currentText.replace(/\[([^\]]+)\]$$([^)]+)$$/g, (match, text, url) => {
      const placeholder = `__LINK_${key}__`
      parts.push({ type: "link", content: text, url, placeholder })
      key++
      return placeholder
    })

    // Inline Code `code`
    currentText = currentText.replace(/`([^`]+)`/g, (match, content) => {
      const placeholder = `__CODE_${key}__`
      parts.push({ type: "code", content, placeholder })
      key++
      return placeholder
    })

    // Replace placeholders with React elements
    let result: React.ReactNode[] = [currentText]

    parts.forEach((part) => {
      result = result.flatMap((item) => {
        if (typeof item === "string" && item.includes(part.placeholder)) {
          const splitText = item.split(part.placeholder)
          const elements: React.ReactNode[] = []

          splitText.forEach((textPart, index) => {
            if (textPart) elements.push(textPart)
            if (index < splitText.length - 1) {
              switch (part.type) {
                case "bold":
                  elements.push(<strong key={`${part.placeholder}-${index}`}>{part.content}</strong>)
                  break
                case "italic":
                  elements.push(<em key={`${part.placeholder}-${index}`}>{part.content}</em>)
                  break
                case "link":
                  elements.push(
                    <a
                      key={`${part.placeholder}-${index}`}
                      href={part.url}
                      className={`underline ${
                        isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {part.content}
                    </a>,
                  )
                  break
                case "code":
                  elements.push(
                    <code
                      key={`${part.placeholder}-${index}`}
                      className={`px-1 py-0.5 rounded text-sm font-mono ${
                        isDark ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {part.content}
                    </code>,
                  )
                  break
              }
            }
          })

          return elements
        }
        return item
      })
    })

    return result
  }

  return <div className="markdown-content">{renderContent(content)}</div>
}
