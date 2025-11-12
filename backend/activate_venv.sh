#!/bin/bash
# Activate virtual environment for Linux/Mac
# Usage: source activate_venv.sh

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "❌ Virtual environment not found. Run setup_linux.sh or setup_macos.sh first."
    return 1 2>/dev/null || exit 1
fi

