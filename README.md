# Anima - Open Source LLM Chat Platform

Just an Open-Source LLM Chat platform supporting OpenAI, OpenRouter and Ollama.

---

## Features

- **Multiple LLM Providers**: OpenAI, OpenRouter, Ollama
- **Streaming Responses**: Real-time AI Response Streaming
- **Markdown Support**: Syntax highlighting for code blocks
- **Local storage**: Chat history in JSON files
- **Modern UI**: ChatGPT-like interface
- **Responsive design**: Works on mobile and desktop
- **Chat export**: Export conversations as TXT, MD, or JSON
- **Keyboard shortcuts**: Enter to send, Shift+Enter for a new line
- **Copy**: One Click copy of the chat response
- **YAML configuration**: Easy setup and customization
- **Dark/Light Mode**: Customizable Design
- **Advanced settings**: Temperature, Max Tokens, System Prompts
- **Chat statistics**: Word count, message count
- **Chat search**: Search through all your conversations

---

### Requirements

- Node.js 18+
- npm
- API key for at leas one Provider (OpenAI, OpenRouter or at least one local Ollama Model)

---

### Automated Installation

#### Winows

1. **Clone the Repository**

   ```bash
    git clone https://github.com/bykoma/anima-chat.git
    cd anima-chat
    ```

2. **Run Installation Script**

   ```bash
    install.bat
   ```

#### Linux

1. **Clone the Repository**

   ```bash
    git clone https://github.com/bykoma/anima-chat.git
    cd anima-chat
   ```

2. **Run Installation Script**

   ```bash
    chmod +x install.sh
    install.sh
   ```

---

### Manual Installation

1. **Clone Repository**

   ```bash
    git clone https://github.com/bykoma/anima-chat.git
    cd anima-chat
   ```

2. **Abhängigkeiten installieren**

   ```bash
    npm install
   ```

3. **Build website**

   ```bash
    npm run build
   ```

4. **Configure the application**

   Edit the `config.yaml` file:

   ```yaml
    llm:
      active_provider: openrouter # LLM Provider that is currently used
      api_keys:
        openai: YOUR_REAL_OPENAI_API_KEY  # Insert your OpenAI API key here
        openrouter: YOUR_REAL_OPENROUTER_API_KEY # Insert your Openrouter API key here
   ```

5. **Start the application**

   ```bash
    npm run start
   ```

6. **Open browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

All configuration is managed via the `config.yaml` file:

### LLM Provider

```yaml
  llm:
    active_provider: openrouter # LLM Provider that is Currently used
    api_keys:
      openai: YOUR_REAL_OPENAI_API_KEY  # Insert your OpenAI API key here
      openrouter: YOUR_REAL_OPENROUTER_API_KEY # Insert your Openrouter API key here
    models:
      openai: # Insert your OpenAI models you want to use
        - gpt-4o-mini
        - gpt-4
      openrouter: # Insert your Openrouter models you want to use (https://openrouter.ai/models)
        - deepseek/deepseek-r1-0528:free
        - qwen/qwen3-coder:free
      ollama: # Insert your installed Ollama models (https://ollama.com/search)
        - qwen3-coder
        - deepseek-r1
    default_model: deepseek/deepseek-r1-0528:free # Default used LLM Model
    system_prompt: You are a helpful assistant. Be precise and helpful. You will be used on the OpenSource WebEngine Anima. # System prompt to tell the AI how to act
    temperature: 0.7
    max_tokens: 2048
    top_p: 1
```

### App settings

```yaml
  app:
    theme: dark # Select your preferred Theme for the Chat (Light/Dark)
    auto_save: true # Autosave chats
    max_history_files: 1000 # Max chats that will be saved
```

### UI settings

```yaml
  ui:
    sidebar_width: 260
    show_timestamps: true # Show timestamps in Messages
    show_word_count: false # Show Word count in Messages
    enable_sound: true # Play Sound when AI finished a Message
    compact_mode: true
```

---

## 🎨 Customization

### Colors and theme

Edit CSS-Variables in `app/globals.css`:

```css
  :root {
    --primary-color: #3b82f6;
    --secondary-color: #6b7280;
    --accent-color: #10b981;
    --background-color: #f9fafb;
  }
```

### Glassmorphism Effects

```css
  .glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
```

---

## 🛠️ Development

## 📁 Project structure

```bash
  anima-chat/
  ├── app/                    # Next.js App Router
  │   ├── api/               # API routes
  │   ├── globals.css        # Global styles
  │   ├── layout.tsx         # Root layout
  │   └── page.tsx          # Main page
  ├── components/            # React Komponenten
  │   ├── chat-sidebar.tsx   # Chat sidebar
  │   ├── chat-message.tsx   # Message display
  │   ├── chat-input.tsx     # Message input
  │   ├── settings-modal.tsx # Settings modal
  │   └── markdown-renderer.tsx # Markdown Parser
  ├── lib/                   # Utility functions
  │   ├── chat-storage.ts    # Chat storage
  │   ├── config.ts          # Configuration management
  │   └── llm-providers.ts   # LLM API calls
  ├── chats/                 # Lokale Chat-Dateien
  ├── config.yaml           # Main configuration
  └── README.md             # This file
```

## 🔧 API endpoints

### POST /api/chat

Sends Message to LLM and gives back Streaming-Answer.

### GET/POST /api/config

Call and save configuration.

### GET/POST/DELETE /api/sessions

Chat session management.

### GET /api/export

Chat export in different formats.

### Add a new LLM provider

1. Expand `lib/llm-providers.ts`
2. Add Provider to `config.yaml`
3. Update API-Endpoint `app/api/chat/route.ts`

### Add new features

1. Add components to `components/`
2. Add API-Endpoints if needed
3. Update Main page `app/page.tsx`

---

## 🐛 Troubleshooting

### API key issues

- Check `config.yaml` for correct API keys
- Check provider-specific key format

### Ollama connection

- Make sure Ollama runs on `localhost:11434`
- Make sure u downloaded the Model u want to use: `ollama pull deepseek-r1`

### Storage issues

- Check `chats/` folder permissions
- Application creates directories automatically

---

## 📝 License

MIT License - Free to use with attribution.

---

## 🤝 Contributing

1. Fork Repository
2. Create Feature Branch
3. Commit Changes
4. Push Branch
5. Open Pull Request

## 📞 Support

For problems and questions, please open a GitHub issue.

---

**Built with Next.js, TypeScript und Tailwind CSS**