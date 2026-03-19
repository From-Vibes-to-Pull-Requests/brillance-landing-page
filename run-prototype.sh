#!/bin/bash
# Run this script in your Terminal to start the prototype and see each step.

set -e
cd "$(dirname "$0")"

echo ""
echo "=============================================="
echo "  Brillance Landing Page - Run Prototype"
echo "=============================================="
echo ""

echo "[Step 1] Current directory: $(pwd)"
echo ""

echo "[Step 2] Checking Node.js..."
node -v
echo ""

echo "[Step 3] Installing dependencies (if needed)..."
npm install
echo ""

echo "[Step 4] Starting Next.js dev server..."
echo "         Open http://localhost:3000 in your browser"
echo "         Press Ctrl+C to stop the server"
echo ""
echo "----------------------------------------------"
echo ""

npm run dev
