@echo off
setlocal enabledelayedexpansion
cls

echo.
echo ================================================
echo    ANIMA CHAT - Installation Script
echo ================================================
echo.
echo This script will:
echo - Install project dependencies
echo - Configure API keys
echo - Build the application
echo - Create startup script
echo - Launch the application
echo.
pause



:: Install dependencies
echo [1/5] Installing project dependencies...
echo This may take a few minutes...
call npm install
echo Dependencies installed successfully!
echo.

:: Configure API keys
echo [2/5] Configuring API keys...
echo.
echo Please provide API keys for the LLM providers you want to use:
echo (You can skip any provider by pressing Enter)
echo.

:: Initialize variables
set "OPENAI_KEY="
set "OPENROUTER_KEY="
set "ACTIVE_PROVIDER="

:: Ask for OpenAI API key
set /p OPENAI_KEY="Enter your OpenAI API key (or press Enter to skip): "
if not "!OPENAI_KEY!"=="" (
    echo OpenAI API key configured
    if "!ACTIVE_PROVIDER!"=="" set "ACTIVE_PROVIDER=openai"
)

:: Ask for OpenRouter API key
set /p OPENROUTER_KEY="Enter your OpenRouter API key (or press Enter to skip): "
if not "!OPENROUTER_KEY!"=="" (
    echo OpenRouter API key configured
    if "!ACTIVE_PROVIDER!"=="" set "ACTIVE_PROVIDER=openrouter"
)

:: Check if at least one API key was provided
if "!OPENAI_KEY!"=="" if "!OPENROUTER_KEY!"=="" (
    echo.
    echo WARNING: No API keys provided!
    echo You can either:
    echo 1. Install Ollama locally and use local models
    echo 2. Edit config.yaml manually later to add API keys
    echo.
    set /p CONTINUE="Continue without API keys? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        echo Installation cancelled.
        pause
        exit /b 1
    )
    set "ACTIVE_PROVIDER=ollama"
)

:: Create config.yaml file
echo [3/5] Creating configuration file...

(
echo llm:
echo   active_provider: !ACTIVE_PROVIDER! # LLM Provider that is currently used
echo   api_keys:
if not "!OPENAI_KEY!"=="" (
echo     openai: !OPENAI_KEY! # Your OpenAI API key
) else (
echo     openai: YOUR_REAL_OPENAI_API_KEY # Insert your OpenAI API key here
)
if not "!OPENROUTER_KEY!"=="" (
echo     openrouter: !OPENROUTER_KEY! # Your OpenRouter API key
) else (
echo     openrouter: YOUR_REAL_OPENROUTER_API_KEY # Insert your Openrouter API key here
)
echo   models:
echo     openai: # OpenAI models you want to use
echo       - gpt-4o-mini
echo       - gpt-4
echo     openrouter: # OpenRouter models you want to use
echo       - deepseek/deepseek-r1-0528:free
echo       - qwen/qwen3-coder:free
echo     ollama: # Installed Ollama models
echo       - qwen3-coder
echo       - deepseek-r1
echo   default_model: deepseek/deepseek-r1-0528:free # Default LLM Model
echo   system_prompt: You are a helpful assistant. Be precise and helpful. You will be used on the OpenSource WebEngine Anima.
echo   temperature: 0.7
echo   max_tokens: 2048
echo   top_p: 1
echo.
echo app:
echo   theme: dark # Select your preferred Theme for the Chat ^(Light/Dark^)
echo   auto_save: true # Autosave chats
echo   max_history_files: 1000 # Max chats that will be saved
echo.
echo ui:
echo   sidebar_width: 260
echo   show_timestamps: true # Show timestamps in Messages
echo   show_word_count: false # Show Word count in Messages
echo   enable_sound: true # Play Sound when AI finished a Message
echo   compact_mode: true
) > config.yaml

echo Configuration file created: config.yaml
echo.

:: Build the application
echo [4/5] Building the application...
call npm run build
echo Application built successfully!
echo.

:: Create start.bat script
echo [5/5] Creating startup script...
(
echo @echo off
echo cls
echo echo.
echo echo ================================================
echo echo    ANIMA CHAT - Starting Application
echo echo ================================================
echo echo.
echo echo Starting the chat application...
echo echo Once started, open your browser and go to:
echo echo http://localhost:3000
echo echo.
echo echo Press Ctrl+C to stop the application
echo echo.
echo npm start
) > start.bat

echo Startup script created: start.bat
echo.

:: Create chats directory if it doesn't exist
if not exist "chats" (
    mkdir chats
    echo Created chats directory
)

:: Installation complete
echo ================================================
echo    INSTALLATION COMPLETED SUCCESSFULLY!
echo ================================================
echo.
echo Setup Summary:
echo - Dependencies: Installed
echo - Configuration: Created (config.yaml)
echo - Build: Completed
echo - Startup Script: Created (start.bat)
echo.

if "!ACTIVE_PROVIDER!"=="ollama" (
    echo NOTE: You're using Ollama as the active provider.
    echo Make sure Ollama is installed and running on localhost:11434
    echo Install models with: ollama pull deepseek-r1
    echo.
)

echo The application will now start automatically in a new window.
echo You can also run it later using: start.bat
echo.
echo Press any key to launch the application...
pause >nul

:: Start the application in a new window
echo Launching Anima Chat...
start start.bat