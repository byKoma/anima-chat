#!/bin/bash

clear

echo ""
echo "================================================"
echo "   ANIMA CHAT - Installation Script"
echo "================================================"
echo ""
echo "This script will:"
echo "- Install project dependencies"
echo "- Configure API keys"
echo "- Build the application"
echo "- Create startup script"
echo "- Launch the application"
echo ""
read -p "Press Enter to continue..."

# Install dependencies
echo "[1/5] Installing project dependencies..."
echo "This may take a few minutes..."
npm install || { echo "npm install failed, aborting."; exit 1; }
echo "Dependencies installed successfully!"
echo ""

# Configure API keys
echo "[2/5] Configuring API keys..."
echo ""
echo "Please provide API keys for the LLM providers you want to use:"
echo "(You can skip any provider by pressing Enter)"
echo ""

# Initialize variables
OPENAI_KEY=""
OPENROUTER_KEY=""
ACTIVE_PROVIDER=""

# Ask for OpenAI API key
read -p "Enter your OpenAI API key (or press Enter to skip): " OPENAI_KEY
if [[ -n "$OPENAI_KEY" ]]; then
    echo "OpenAI API key configured"
    if [ -z "$ACTIVE_PROVIDER" ]; then
        ACTIVE_PROVIDER="openai"
    fi
fi

# Ask for OpenRouter API key
read -p "Enter your OpenRouter API key (or press Enter to skip): " OPENROUTER_KEY
if [ ! -z "$OPENROUTER_KEY" ]; then
    echo "OpenRouter API key configured"
    if [ -z "$ACTIVE_PROVIDER" ]; then
        ACTIVE_PROVIDER="openrouter"
    fi
fi

# Check if at least one API key was provided
if [ -z "$OPENAI_KEY" ] && [ -z "$OPENROUTER_KEY" ]; then
    echo ""
    echo "WARNING: No API keys provided!"
    echo "You can either:"
    echo "1. Install Ollama locally and use local models"
    echo "2. Edit config.yaml manually later to add API keys"
    echo ""
    read -p "Continue without API keys? (y/n): " CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 1
    fi
    ACTIVE_PROVIDER="ollama"
fi

# Create config.yaml file
echo "[3/5] Creating configuration file..."

cat > config.yaml << EOF
llm:
  active_provider: $ACTIVE_PROVIDER # LLM Provider that is currently used
  api_keys:
EOF

if [ ! -z "$OPENAI_KEY" ]; then
    echo "    openai: $OPENAI_KEY # Your OpenAI API key" >> config.yaml
else
    echo "    openai: YOUR_REAL_OPENAI_API_KEY # Insert your OpenAI API key here" >> config.yaml
fi

if [ ! -z "$OPENROUTER_KEY" ]; then
    echo "    openrouter: $OPENROUTER_KEY # Your OpenRouter API key" >> config.yaml
else
    echo "    openrouter: YOUR_REAL_OPENROUTER_API_KEY # Insert your Openrouter API key here" >> config.yaml
fi

cat >> config.yaml << EOF
  models:
    openai: # OpenAI models you want to use
      - gpt-4o-mini
      - gpt-4
    openrouter: # OpenRouter models you want to use
      - deepseek/deepseek-r1-0528:free
      - qwen/qwen3-coder:free
    ollama: # Installed Ollama models
      - qwen3-coder
      - deepseek-r1
  default_model: deepseek/deepseek-r1-0528:free # Default LLM Model
  system_prompt: You are a helpful assistant. Be precise and helpful. You will be used on the OpenSource WebEngine Anima.
  temperature: 0.7
  max_tokens: 2048
  top_p: 1

app:
  theme: dark # Select your preferred Theme for the Chat (Light/Dark)
  auto_save: true # Autosave chats
  max_history_files: 1000 # Max chats that will be saved

ui:
  sidebar_width: 260
  show_timestamps: true # Show timestamps in Messages
  show_word_count: false # Show Word count in Messages
  enable_sound: true # Play Sound when AI finished a Message
  compact_mode: true
EOF

echo "Configuration file created: config.yaml"
echo ""

# Build the application
echo "[4/5] Building the application..."
npm run build || { echo "Build failed, aborting."; exit 1; }
echo "Application built successfully!"
echo ""

# Create start.sh script
echo "[5/5] Creating startup script..."
cat > start.sh << 'EOF'
#!/bin/bash
clear
echo ""
echo "================================================"
echo "   ANIMA CHAT - Starting Application"
echo "================================================"
echo ""
echo "Starting the chat application..."
echo "Once started, open your browser and go to:"
echo "http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""
npm start
EOF

# Make start.sh executable
chmod +x start.sh
echo "Startup script created: start.sh (executable permissions set)"
echo ""

# Create chats directory if it doesn't exist
if [ ! -d "chats" ]; then
    mkdir -p chats
    echo "Created chats directory"
fi

# Installation complete
echo "================================================"
echo "   INSTALLATION COMPLETED SUCCESSFULLY!"
echo "================================================"
echo ""
echo "Setup Summary:"
echo "- Dependencies: Installed"
echo "- Configuration: Created (config.yaml)"
echo "- Build: Completed"
echo "- Startup Script: Created (start.sh)"
echo ""

if [ "$ACTIVE_PROVIDER" = "ollama" ]; then
    echo "NOTE: You're using Ollama as the active provider."
    echo "Make sure Ollama is installed and running on localhost:11434"
    echo "Install models with: ollama pull deepseek-r1"
    echo ""
fi

echo "The application will now start automatically in a new terminal."
echo "You can also run it later using: ./start.sh"
echo ""
read -p "Press Enter to launch the application..."

# Start the application in a new terminal
echo "Launching Anima Chat..."
if command -v gnome-terminal > /dev/null; then
    gnome-terminal -- ./start.sh
elif command -v konsole > /dev/null; then
    konsole -e ./start.sh
elif command -v xterm > /dev/null; then
    xterm -e ./start.sh
elif command -v x-terminal-emulator > /dev/null; then
    x-terminal-emulator -e ./start.sh
else
    echo "No suitable terminal emulator found."
    echo "Please run './start.sh' manually to start the application."
fi