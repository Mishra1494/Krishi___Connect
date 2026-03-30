#!/bin/bash
# Multi-Language Setup Verification Script

echo "🌐 Multi-Language Feature Setup Verification"
echo "=============================================="
echo ""

# Check if .env.local exists
echo "1. Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "   ✓ .env.local file exists"
    if grep -q "VITE_LINGO_API_KEY" .env.local; then
        echo "   ✓ VITE_LINGO_API_KEY found in .env.local"
    else
        echo "   ✗ VITE_LINGO_API_KEY not found in .env.local"
        echo "   → Please add: VITE_LINGO_API_KEY=your_api_key_here"
    fi
else
    echo "   ✗ .env.local file not found"
    echo "   → Create .env.local and add: VITE_LINGO_API_KEY=your_api_key_here"
fi

echo ""
echo "2. Checking required files..."

FILES=(
    "src/context/LanguageContext.jsx"
    "src/services/translationService.js"
    "src/components/common/LanguageSwitcher.jsx"
    "src/components/common/LanguageSwitcher.css"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ✗ $file (MISSING)"
    fi
done

echo ""
echo "3. Setup Summary:"
echo "   - Language Switcher: Added to Layout component"
echo "   - Supported Languages: English, Marathi, Gujarati, Tamil"
echo "   - Translation API: Lingo.dev"
echo ""

echo "4. Next Steps:"
echo "   1. Copy .env.example to .env.local"
echo "   2. Add your Lingo.dev API key to .env.local"
echo "   3. Run: npm run dev"
echo "   4. Open your app and click the language button (top-right)"
echo ""

echo "Setup verification complete! ✓"
