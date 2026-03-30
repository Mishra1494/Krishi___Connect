#!/usr/bin/env python3
"""
Automated i18n conversion script for all frontend pages.
This script replaces all hardcoded strings with i18n translation calls.
"""

import os
import re
import json

# Page conversion mappings based on the translation keys structure
PAGES_CONFIG = {
    'Dashboard.jsx': {
        'translations': [
            ('Farm Dashboard', "t('pages.dashboard.title')"),
            ('Welcome back, ', "t('pages.dashboard.welcomeBack') + ' '"),
            ('Manage your fields and track crop performance', "t('pages.dashboard.manageFieldsSubtitle')"),
            ('Farmer Dashboard', "t('pages.dashboard.farmerDashboard')"),
            ('Quick Actions', "t('pages.dashboard.quickActions')"),
            ('Create New Field', "t('pages.dashboard.createNewField')"),
            ('Add a new field to your farm', "t('pages.dashboard.addNewFieldDesc')"),
            ('Crop Lifecycle', "t('pages.dashboard.cropLifecycle')"),
            ('Track crop growth stages', "t('pages.dashboard.trackGrowthStages')"),
            ('Crop Prediction', "t('pages.dashboard.cropPrediction')"),
            ('AI-powered crop suggestions', "t('pages.dashboard.aiPoweredSuggestions')"),
            ('Yield Prediction', "t('pages.dashboard.yieldPrediction')"),
            ('Predict harvest amounts', "t('pages.dashboard.predictHarvest')"),
            ('Recent Fields', "t('pages.dashboard.recentFields')"),
            ('+ Add New Field', "+ t('pages.dashboard.addNewField')"),
            ('Growth Stage:', "t('pages.dashboard.growthStage') + ':'"),
            ('View Details →', "t('pages.dashboard.viewDetails') + ' →'"),
            ('No fields created yet', "t('pages.dashboard.noFieldsCreated')"),
            ('Create your first field', "t('pages.dashboard.createFirstField')"),
            ('AI Crop Recommendations', "t('pages.dashboard.aiCropRecommendations')"),
            ('View All →', "t('pages.dashboard.viewAll') + ' →'"),
            ('% confidence', "t('pages.dashboard.confidence')"),
            ('Best for:', "t('pages.dashboard.bestFor') + ':'"),
            ('Yield Predictions', "t('pages.dashboard.yieldPredictions')"),
            ('% accuracy', "t('pages.dashboard.accuracy')"),
            ('Crop:', "t('pages.dashboard.crop') + ':'"),
            ('Predicted Yield:', "t('pages.dashboard.predictedYield') + ':'"),
            ('Harvest Date:', "t('pages.dashboard.harvestDate') + ':'"),
        ]
    },
    'Login.jsx': {
        'translations': [
            ('Welcome to Krishi Connect', "t('pages.login.title')"),
            ('Your AI-powered Agricultural Assistant', "t('pages.login.subtitle')"),
            ('Login to Your Account', "t('pages.login.loginTitle')"),
            ('Email', "t('pages.login.email')"),
            ('Enter your email', "t('pages.login.emailPlaceholder')"),
            ('Password', "t('pages.login.password')"),
            ('Enter your password', "t('pages.login.passwordPlaceholder')"),
            ('Remember me', "t('pages.login.rememberMe')"),
            ('Forgot Password?', "t('pages.login.forgotPassword')"),
            ('Login', "t('pages.login.loginButton')"),
            ("Don't have an account?", "t('pages.login.noAccount')"),
            ('Sign Up', "t('pages.login.signUp')"),
        ]
    },
    'SignUp.jsx': {
        'translations': [
            ('Create Your Krishi Connect Account', "t('pages.signup.title')"),
            ('Join our farming community', "t('pages.signup.subtitle')"),
            ('Full Name', "t('pages.signup.fullName')"),
            ('Email', "t('pages.signup.email')"),
            ('Password', "t('pages.signup.password')"),
            ('Confirm Password', "t('pages.signup.confirmPassword')"),
            ('I agree to the Terms and Conditions', "t('pages.signup.agreeTerms')"),
            ('Create Account', "t('pages.signup.createButton')"),
            ('Already have an account?', "t('pages.signup.haveAccount')"),
            ('Login here', "t('pages.signup.loginHere')"),
            ('Passwords do not match', "t('pages.signup.passwordMismatch')"),
        ]
    },
    'Fields.jsx': {
        'translations': [
            ('My Fields', "t('pages.fields.title')"),
            ('Manage your agricultural fields', "t('pages.fields.subtitle')"),
            ('Create New Field', "t('pages.fields.createNew')"),
            ('No fields found', "t('pages.fields.noFields')"),
            ('Create your first field', "t('pages.fields.createFirst')"),
            ('Crop', "t('pages.fields.crop')"),
            ('Area', "t('pages.fields.area')"),
            ('Planted Date', "t('pages.fields.plantedDate')"),
            ('Status', "t('pages.fields.status')"),
            ('Actions', "t('pages.fields.actions')"),
            ('View Details', "t('pages.fields.viewDetails')"),
            ('Delete', "t('pages.fields.delete')"),
        ]
    },
}

def add_i18n_import(content):
    """Add useTranslation import if not present"""
    if 'useTranslation' not in content:
        # Find the first import statement and add after it
        import_match = re.search(r"^(import .* from .*?;)", content, re.MULTILINE)
        if import_match:
            import_end = import_match.end()
            new_import = "\nimport { useTranslation } from 'react-i18next';"
            content = content[:import_end] + new_import + content[import_end:]
    return content

def add_use_translation_hook(content):
    """Add useTranslation hook initialization if not present"""
    # Check if hook is already initialized
    if "const { t } = useTranslation();" not in content:
        # Find the component function and add hook at the beginning
        func_match = re.search(r"^const \w+ = \(.*?\) => \{", content, re.MULTILINE)
        if func_match:
            func_end = func_match.end()
            hook_init = "\n  const { t } = useTranslation();"
            # Check if there's already content in the function
            next_char_idx = func_end
            if next_char_idx < len(content) and content[next_char_idx] != '\n':
                hook_init += '\n'
            content = content[:func_end] + hook_init + content[func_end:]
    return content

def convert_page(filepath, page_name):
    """Convert a single page to use i18n"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add imports and hooks
        content = add_i18n_import(content)
        content = add_use_translation_hook(content)
        
        # Apply string replacements
        if page_name in PAGES_CONFIG:
            for old_string, new_string in PAGES_CONFIG[page_name]['translations']:
                # Use proper escaping for regex
                pattern = re.escape(old_string)
                content = re.sub(pattern, new_string, content)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Converted: {page_name}")
        return True
    except Exception as e:
        print(f"✗ Error converting {page_name}: {e}")
        return False

def main():
    """Convert all pages in the pages directory"""
    pages_dir = r"f:\Krishi___Connect\client\src\pages"
    
    # Pages to convert (excluding already converted ones)
    pages_to_convert = [
        'Dashboard.jsx',
        'Login.jsx',
        'SignUp.jsx',
        'Fields.jsx',
    ]
    
    successful = 0
    failed = 0
    
    for page_file in pages_to_convert:
        filepath = os.path.join(pages_dir, page_file)
        if os.path.exists(filepath):
            if convert_page(filepath, page_file):
                successful += 1
            else:
                failed += 1
        else:
            print(f"✗ File not found: {filepath}")
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"Conversion Summary: {successful} successful, {failed} failed")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
