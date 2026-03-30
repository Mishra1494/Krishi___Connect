#!/usr/bin/env python3
"""
Comprehensive i18n conversion for ALL remaining frontend pages.
Converts hardcoded English strings to i18n translation calls for:
- English (en)
- Marathi (mr)
- Gujarati (gu)
- Tamil (ta)
"""

import os
import re
from pathlib import Path

# Define conversion mappings for each page
PAGE_CONVERSIONS = {
    'SignUp.jsx': [
        ('Create Your Krishi Connect Account', "t('pages.signup.title')"),
        ('Join our farming community', "t('pages.signup.subtitle')"),
        ('Full Name', "t('pages.signup.fullName')"),
        ('Email Address', "t('pages.signup.emailLabel')"),
        ('Enter your full name', "t('pages.signup.namePlaceholder')"),
        ('Enter your email', "t('pages.signup.emailPlaceholder')"),
        ('Password', "t('pages.signup.password')"),
        ('Enter your password', "t('pages.signup.passwordPlaceholder')"),
        ('Confirm Password', "t('pages.signup.confirmPassword')"),
        ('Confirm your password', "t('pages.signup.confirmPlaceholder')"),
        ('I agree to the Terms and Conditions', "t('pages.signup.agreeTerms')"),
        ('Create Account', "t('pages.signup.createButton')"),
        ('Signing up...', "t('pages.signup.signingUp')"),
        ('Already have an account?', "t('pages.signup.haveAccount')"),
        ('Sign in here', "t('pages.signup.signInHere')"),
    ],
    'Fields.jsx': [
        ('My Fields', "t('pages.fields.title')"),
        ('Manage your agricultural fields', "t('pages.fields.subtitle')"),
        ('Create New Field', "t('pages.fields.createNew')"),
        ('No fields found', "t('pages.fields.noFields')"),
        ('Create your first field', "t('pages.fields.createFirst')"),
        ('Field Name', "t('pages.fields.fieldName')"),
        ('Crop Type', "t('pages.fields.cropType')"),
        ('Area (acres)', "t('pages.fields.area')"),
        ('Planted Date', "t('pages.fields.plantedDate')"),
        ('Status', "t('pages.fields.status')"),
        ('Actions', "t('pages.fields.actions')"),
        ('View Details', "t('pages.fields.viewDetails')"),
        ('Edit', "t('pages.fields.edit')"),
        ('Delete', "t('pages.fields.delete')"),
    ],
    'FieldDetail.jsx': [
        ('Field Details', "t('pages.fieldDetail.title')"),
        ('Field Information', "t('pages.fieldDetail.fieldInfo')"),
        ('Field Name', "t('pages.fieldDetail.fieldName')"),
        ('Crop Type', "t('pages.fieldDetail.cropType')"),
        ('Area', "t('pages.fieldDetail.area')"),
        ('Location', "t('pages.fieldDetail.location')"),
        ('Planted Date', "t('pages.fieldDetail.plantedDate')"),
        ('Status', "t('pages.fieldDetail.status')"),
        ('Growth Stage', "t('pages.fieldDetail.growthStage')"),
        ('Yield Prediction', "t('pages.fieldDetail.yieldPrediction')"),
        ('Weather Info', "t('pages.fieldDetail.weatherInfo')"),
        ('Back to Fields', "t('pages.fieldDetail.backToFields')"),
        ('Edit Field', "t('pages.fieldDetail.editField')"),
        ('Delete Field', "t('pages.fieldDetail.deleteField')"),
    ],
    'CropLifecycle.jsx': [
        ('Crop Growth Stages', "t('pages.cropLifecycle.title')"),
        ('Track your crop through different growth stages', "t('pages.cropLifecycle.subtitle')"),
        ('Current Stage', "t('pages.cropLifecycle.currentStage')"),
        ('Next Stage', "t('pages.cropLifecycle.nextStage')"),
        ('Days Remaining', "t('pages.cropLifecycle.daysRemaining')"),
        ('Vegetative', "t('pages.cropLifecycle.vegetative')"),
        ('Flowering', "t('pages.cropLifecycle.flowering')"),
        ('Fruiting', "t('pages.cropLifecycle.fruiting')"),
        ('Maturation', "t('pages.cropLifecycle.maturation')"),
    ],
    'CropManagement.jsx': [
        ('Crop Management', "t('pages.cropManagement.title')"),
        ('Manage your crops effectively', "t('pages.cropManagement.subtitle')"),
        ('Active Crops', "t('pages.cropManagement.activeCrops')"),
        ('Completed Crops', "t('pages.cropManagement.completedCrops')"),
    ],
    'CropPrediction.jsx': [
        ('Crop Prediction', "t('pages.cropPrediction.title')"),
        ('AI-powered crop recommendations based on your location and climate', "t('pages.cropPrediction.subtitle')"),
        ('Recommended Crops', "t('pages.cropPrediction.recommended')"),
        ('Confidence Level', "t('pages.cropPrediction.confidence')"),
        ('Optimal Season', "t('pages.cropPrediction.optimalSeason')"),
        ('No recommendations available', "t('pages.cropPrediction.noData')"),
    ],
    'YieldPrediction.jsx': [
        ('Yield Prediction', "t('pages.yieldPrediction.title')"),
        ('Predicted yields for your fields', "t('pages.yieldPrediction.subtitle')"),
        ('Field', "t('pages.yieldPrediction.field')"),
        ('Predicted Yield', "t('pages.yieldPrediction.predictedYield')"),
        ('Estimated Harvest Date', "t('pages.yieldPrediction.harvestDate')"),
        ('Accuracy', "t('pages.yieldPrediction.accuracy')"),
    ],
    'PlantDiseaseDetection.jsx': [
        ('Plant Disease Detection', "t('pages.diseaseDetection.title')"),
        ('Upload a photo to detect plant diseases', "t('pages.diseaseDetection.subtitle')"),
        ('Upload Image', "t('pages.diseaseDetection.uploadImage')"),
        ('Disease Detected', "t('pages.diseaseDetection.diseaseDetected')"),
        ('Healthy', "t('pages.diseaseDetection.healthy')"),
        ('Treatment Recommendation', "t('pages.diseaseDetection.treatment')"),
        ('Confidence', "t('pages.diseaseDetection.confidence')"),
    ],
    'ClimateAnalysis.jsx': [
        ('Climate Analysis', "t('pages.climateAnalysis.title')"),
        ('Analyze climate data for your fields', "t('pages.climateAnalysis.subtitle')"),
        ('Current Weather', "t('pages.climateAnalysis.currentWeather')"),
        ('Temperature', "t('pages.climateAnalysis.temperature')"),
        ('Rainfall', "t('pages.climateAnalysis.rainfall')"),
        ('Humidity', "t('pages.climateAnalysis.humidity')"),
        ('Wind Speed', "t('pages.climateAnalysis.windSpeed')"),
        ('Forecast', "t('pages.climateAnalysis.forecast')"),
    ],
    'WaterManagement.jsx': [
        ('Water & Irrigation Management', "t('pages.waterManagement.title')"),
        ('Optimize water usage for your crops', "t('pages.waterManagement.subtitle')"),
        ('Irrigation Schedule', "t('pages.waterManagement.schedule')"),
        ('Water Requirement', "t('pages.waterManagement.requirement')"),
        ('Last Watered', "t('pages.waterManagement.lastWatered')"),
        ('Next Watering', "t('pages.waterManagement.nextWatering')"),
    ],
    'ClimateDamageClaim.jsx': [
        ('Climate Damage Claim', "t('pages.climateDamageClaim.title')"),
        ('File a claim for climate-related crop damage', "t('pages.climateDamageClaim.subtitle')"),
        ('Field', "t('pages.climateDamageClaim.field')"),
        ('Damage Type', "t('pages.climateDamageClaim.damageType')"),
        ('Estimated Loss', "t('pages.climateDamageClaim.estimatedLoss')"),
        ('Date of Damage', "t('pages.climateDamageClaim.dateOfDamage')"),
        ('Description', "t('pages.climateDamageClaim.description')"),
        ('Submit Claim', "t('pages.climateDamageClaim.submitClaim')"),
    ],
    'IrrigationManagement.jsx': [
        ('Irrigation Management', "t('pages.irrigationManagement.title')"),
        ('Manage irrigation for your fields', "t('pages.irrigationManagement.subtitle')"),
        ('Active Irrigation', "t('pages.irrigationManagement.activeIrrigation')"),
        ('Schedule Irrigation', "t('pages.irrigationManagement.schedule')"),
        ('Duration', "t('pages.irrigationManagement.duration')"),
        ('Water Amount', "t('pages.irrigationManagement.waterAmount')"),
        ('Status', "t('pages.irrigationManagement.status')"),
    ],
    'FinancialAid.jsx': [
        ('Government Financial Aid Schemes', "t('pages.financialAid.title')"),
        ('Explore available government schemes', "t('pages.financialAid.subtitle')"),
        ('Available Schemes', "t('pages.financialAid.schemes')"),
        ('Eligibility Criteria', "t('pages.financialAid.eligibility')"),
        ('Benefits', "t('pages.financialAid.benefits')"),
        ('Application Deadline', "t('pages.financialAid.deadline')"),
        ('Apply Now', "t('pages.financialAid.applyNow')"),
    ],
    'Fin_aids.jsx': [
        ('Financial Aids', "t('pages.finAids.title')"),
    ],
    'GovernmentDashboard.jsx': [
        ('Government Dashboard', "t('pages.govDashboard.title')"),
        ('Manage government schemes and monitor farmer data', "t('pages.govDashboard.subtitle')"),
        ('Pending Claims', "t('pages.govDashboard.pendingClaims')"),
        ('Approved Claims', "t('pages.govDashboard.approvedClaims')"),
        ('Total Farmers', "t('pages.govDashboard.totalFarmers')"),
        ('Registered Fields', "t('pages.govDashboard.registeredFields')"),
    ],
    'AIAssistant.jsx': [
        ('AI Assistant', "t('pages.aiAssistant.title')"),
        ('Get farming advice from AI', "t('pages.aiAssistant.subtitle')"),
        ('Type your question...', "t('pages.aiAssistant.placeholder')"),
        ('Send', "t('pages.aiAssistant.send')"),
    ],
    'FarmConsole.jsx': [
        ('Farm Console', "t('pages.farmConsole.title')"),
        ('Central control for your farm operations', "t('pages.farmConsole.subtitle')"),
    ],
}

def add_imports(content):
    """Add useTranslation import if not present"""
    if 'useTranslation' not in content:
        # Find the first import and add after it
        match = re.search(r"^(import\s+.*?;)", content, re.MULTILINE)
        if match:
            pos = match.end()
            new_import = "\nimport { useTranslation } from 'react-i18next';"
            content = content[:pos] + new_import + content[pos:]
    return content

def add_hook(content):
    """Add useTranslation hook initialization"""
    if "const { t } = useTranslation();" not in content:
        # Find component declaration
        match = re.search(r"^const\s+\w+\s*=\s*\(\s*\)\s*=>\s*\{", content, re.MULTILINE)
        if match:
            pos = match.end()
            hook = "\n  const { t } = useTranslation();"
            content = content[:pos] + hook + content[pos:]
    return content

def convert_page(filepath, page_name):
    """Convert a single page"""
    if not os.path.exists(filepath):
        print(f"✗ {page_name}: File not found")
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add imports and hooks
        content = add_imports(content)
        content = add_hook(content)
        
        # Apply string replacements
        if page_name in PAGE_CONVERSIONS:
            for old, new in PAGE_CONVERSIONS[page_name]:
                content = content.replace(old, new)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ {page_name}")
        return True
    except Exception as e:
        print(f"✗ {page_name}: {e}")
        return False

def main():
    pages_dir = r"f:\Krishi___Connect\client\src\pages"
    success_count = 0
    
    for page_name in PAGE_CONVERSIONS.keys():
        filepath = os.path.join(pages_dir, page_name)
        if convert_page(filepath, page_name):
            success_count += 1
    
    print(f"\n{'='*50}")
    print(f"Converted {success_count}/{len(PAGE_CONVERSIONS)} pages")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
