#!/bin/bash
# Deactivate virtual environment for Linux/Mac

if [ -n "$VIRTUAL_ENV" ]; then
    deactivate
    echo "✅ Virtual environment deactivated"
else
    echo "ℹ️  No virtual environment is currently active"
fi

