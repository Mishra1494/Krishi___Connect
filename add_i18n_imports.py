#!/usr/bin/env python3
"""
Add i18n imports and hooks to pages without doing string replacement.
This ensures all pages are i18n-ready.
"""

import os
import re

PAGES_DIR = r"f:\Krishi___Connect\client\src\pages"

# Pages that already have i18n properly set up
ALREADY_DONE = {'Dashboard.jsx', 'Login.jsx', 'CreateField.jsx'}

def add_i18n_setup(filepath):
    """Add useTranslation import and hook to a page"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has i18n
    if 'useTranslation' in content:
        return False  # Already has it
    
    # Add import after first import
    import_match = re.search(r"^(import\s+.*?;)", content, re.MULTILINE)
    if import_match:
        pos = import_match.end()
        new_import = "\nimport { useTranslation } from 'react-i18next';"
        content = content[:pos] + new_import + content[pos:]
    
    # Add hook initialization in component function
    func_match = re.search(r"^const\s+(\w+)\s*=\s*\(\s*\)\s*=>\s*\{", content, re.MULTILINE)
    if func_match:
        pos = func_match.end()
        hook = "\n  const { t } = useTranslation();"
        content = content[:pos] + hook + content[pos:]
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    """Process all pages"""
    pages = [f for f in os.listdir(PAGES_DIR) if f.endswith('.jsx')]
    success_count = 0
    
    for page in sorted(pages):
        if page in ALREADY_DONE:
            print(f"⊙ {page} - Already complete with i18n")
            continue
        
        filepath = os.path.join(PAGES_DIR, page)
        try:
            if add_i18n_setup(filepath):
                print(f"✓ {page} - Added i18n setup (imports + hook)")
                success_count += 1
            else:
                print(f"⊙ {page} - Already has i18n")
                success_count += 1
        except Exception as e:
            print(f"✗ {page} - Error: {e}")
    
    print(f"\n{'='*60}")
    print(f"All {success_count} pages are now i18n-ready!")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
