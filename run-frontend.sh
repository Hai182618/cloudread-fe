#!/bin/bash
# Start Frontend Server on Linux/Mac
# Usage: ./run-frontend.sh [port]

PORT=${1:-3000}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to FE directory
cd "$SCRIPT_DIR"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed"
    echo ""
    echo "On macOS: brew install python3"
    echo "On Ubuntu/Debian: sudo apt-get install python3"
    exit 1
fi

echo ""
echo "🚀 Starting Frontend Server on port $PORT..."
echo ""

python3 server.py --host 0.0.0.0 --port $PORT
