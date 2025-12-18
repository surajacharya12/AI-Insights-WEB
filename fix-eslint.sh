#!/bin/bash

# This script adds eslint-disable comments to suppress non-critical linting errors
# that are blocking the Vercel build

echo "Fixing ESLint errors..."

# Fix unescaped entities in signup page
sed -i '' "s/Don't/Don\&apos;t/g" "app/(auth)/signup/page.tsx"

# Fix unescaped entities in quiz page
sed -i '' 's/Enter "Quiz Title"/Enter \&quot;Quiz Title\&quot;/g' "app/(authenticated)/quiz/page.tsx"

# Fix unescaped entities in grammar tool
sed -i '' 's/"Paste"/"Paste"/g' "app/(authenticated)/ai-tools/components/GrammarTool.tsx"
sed -i '' 's/"Check Grammar"/"Check Grammar"/g' "app/(authenticated)/ai-tools/components/GrammarTool.tsx"

# Fix unescaped entities in terms page
sed -i '' 's/"AI Insights"/"AI Insights"/g' "app/terms/page.tsx"

echo "ESLint fixes applied!"
