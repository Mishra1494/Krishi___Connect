import re
import json
import os
import time
import urllib.request
from deep_translator import GoogleTranslator

JSX_FILE = r"f:/Krishi___Connect/client/src/pages/CropInsuranceSuggestions.jsx"
LOCALES_DIR = r"f:/Krishi___Connect/client/src/i18n/locales"

def process():
    print("Reading JSX file...")
    with open(JSX_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find t('pages.insurance.XXX', 'Fallback text')
    # Matches t('pages.insurance.key', 'Value') or t("pages.insurance.key", "Value")
    pattern = r"t\(\s*['\"]pages\.insurance\.([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)"
    matches = re.findall(pattern, content)
    
    en_dict = {}
    
    # We will build a nested dictionary based on dot notation inside the key
    def set_nested_value(d, key_path, value):
        keys = key_path.split('.')
        current = d
        for k in keys[:-1]:
            if k not in current:
                current[k] = {}
            current = current[k]
        current[keys[-1]] = value

    print(f"Found {len(matches)} translation keys.")
    for key, val in set(matches):  # use set to deduplicate
        set_nested_value(en_dict, key, val)
        
    print("Building translations...")
    
    # Function to translate a dict recursively
    def translate_dict(d, lang):
        translator = GoogleTranslator(source='en', target=lang)
        result = {}
        for k, v in d.items():
            if isinstance(v, dict):
                result[k] = translate_dict(v, lang)
            else:
                try:
                    result[k] = translator.translate(v)
                    time.sleep(0.1) # Be nice to Google's API
                except Exception as e:
                    print(f"Error translating {v} to {lang}: {e}")
                    result[k] = v # fallback to english
        return result

    print("Translating to Hindi (hi)...")
    hi_dict = translate_dict(en_dict, 'hi')
    
    print("Translating to Marathi (mr)...")
    mr_dict = translate_dict(en_dict, 'mr')
    
    dictionaries = {
        'en': en_dict,
        'hi': hi_dict,
        'mr': mr_dict
    }
    
    for lang in ['en', 'hi', 'mr']:
        json_path = os.path.join(LOCALES_DIR, lang, "common.json")
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            if "pages" not in data:
                data["pages"] = {}
            
            data["pages"]["insurance"] = dictionaries[lang]
            
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print(f"Successfully updated {json_path}")
        except Exception as e:
            print(f"Failed to process {lang}: {e}")

if __name__ == "__main__":
    process()
