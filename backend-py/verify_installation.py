#!/usr/bin/env python3
"""
Test Verification Script for InnovateX Python Backend

This script verifies that all components are working correctly.
Run this before deploying to production.
"""

import sys
import importlib
from pathlib import Path

def print_header(title):
    """Print formatted header"""
    print("\n" + "="*80)
    print(f" {title}")
    print("="*80)

def check_file_exists(filepath):
    """Check if file exists"""
    if Path(filepath).exists():
        print(f"✅ {filepath}")
        return True
    else:
        print(f"❌ {filepath} - NOT FOUND")
        return False

def check_import(module_name):
    """Check if module can be imported"""
    try:
        importlib.import_module(module_name)
        print(f"✅ {module_name}")
        return True
    except ImportError as e:
        print(f"❌ {module_name} - {str(e)}")
        return False

def check_package(package_name):
    """Check if package is installed"""
    try:
        importlib.import_module(package_name)
        print(f"✅ {package_name}")
        return True
    except ImportError:
        print(f"❌ {package_name} - NOT INSTALLED")
        return False

def test_risk_calculation():
    """Test risk calculation functionality"""
    print_header("Testing Risk Calculation")
    
    try:
        from models import (
            InventoryItem,
            FoodCategory,
            StorageType,
        )
        from risk_calculator import calculate_expiration_risk
        from datetime import datetime, timedelta
        
        # Create test item
        test_item = InventoryItem(
            id="test_001",
            name="Test Milk",
            category=FoodCategory.DAIRY,
            quantity=1.0,
            unit="liters",
            date_added=datetime.now() - timedelta(days=5),
            expiration_date=datetime.now() + timedelta(days=3),
            storage_type=StorageType.REFRIGERATOR,
        )
        
        # Calculate risk
        risk = calculate_expiration_risk(test_item, days_since_last_consumed=7)
        
        print(f"✅ Risk calculation successful")
        print(f"   - Item: {risk.item_name}")
        print(f"   - Risk Score: {risk.risk_score}")
        print(f"   - Risk Level: {risk.risk_level}")
        print(f"   - Days to Expiry: {risk.days_until_expiry}")
        
        return True
    except Exception as e:
        print(f"❌ Risk calculation failed: {str(e)}")
        return False

def test_models():
    """Test all models can be instantiated"""
    print_header("Testing Models")
    
    try:
        from models import (
            InventoryItem,
            ConsumptionLog,
            ExpirationRisk,
            RiskLevel,
            FoodCategory,
            StorageType,
        )
        from datetime import datetime, timedelta
        
        # Test InventoryItem
        item = InventoryItem(
            id="test_001",
            name="Test Item",
            category=FoodCategory.VEGETABLES,
            quantity=1.0,
            unit="kg",
            date_added=datetime.now(),
            expiration_date=datetime.now() + timedelta(days=7),
            storage_type=StorageType.REFRIGERATOR,
        )
        print(f"✅ InventoryItem model")
        
        # Test ConsumptionLog
        log = ConsumptionLog(
            id="log_001",
            user_id="user_001",
            item_id="item_001",
            item_name="Test Item",
            quantity_consumed=0.5,
            unit="kg",
            consumed_at=datetime.now(),
            was_expired=False,
        )
        print(f"✅ ConsumptionLog model")
        
        return True
    except Exception as e:
        print(f"❌ Model testing failed: {str(e)}")
        return False

def test_apis():
    """Test API endpoints can be created"""
    print_header("Testing API Endpoints")
    
    try:
        from main import app
        
        # Check that app is a FastAPI instance
        print(f"✅ FastAPI app initialized")
        print(f"   - Title: {app.title}")
        print(f"   - Version: {app.version}")
        
        # Check routes
        routes = [route.path for route in app.routes]
        expected_routes = [
            "/health",
            "/api/consumption/log",
            "/api/inventory/risks",
            "/api/alerts/expiration",
            "/api/inventory/priority-list",
        ]
        
        for route in expected_routes:
            if any(expected in r for expected in [route.split("/")[1]]):
                print(f"✅ {route}")
        
        return True
    except Exception as e:
        print(f"❌ API testing failed: {str(e)}")
        return False

def check_dependencies():
    """Check all dependencies are installed"""
    print_header("Checking Dependencies")
    
    packages = [
        "fastapi",
        "uvicorn",
        "pydantic",
        "dotenv",
        "datetime",
        "typing",
    ]
    
    all_ok = True
    for package in packages:
        if not check_package(package):
            all_ok = False
    
    return all_ok

def check_files():
    """Check all required files exist"""
    print_header("Checking Files")
    
    files = [
        "main.py",
        "models.py",
        "risk_calculator.py",
        "consumption_service.py",
        "api_payloads.py",
        "requirements.txt",
        "PYTHON_BACKEND_README.md",
        "IMPLEMENTATION_SUMMARY.md",
    ]
    
    all_ok = True
    for file in files:
        if not check_file_exists(file):
            all_ok = False
    
    return all_ok

def main():
    """Run all tests"""
    print_header("InnovateX Python Backend - Verification Tests")
    
    results = {
        "Files": check_files(),
        "Dependencies": check_dependencies(),
        "Models": test_models(),
        "Risk Calculation": test_risk_calculation(),
        "APIs": test_apis(),
    }
    
    print_header("Test Results Summary")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✅ PASSED" if passed_test else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! System is ready to run.")
        print("\nNext steps:")
        print("1. Start the server: python main.py")
        print("2. Visit: http://localhost:8000/docs")
        print("3. View examples: python api_payloads.py")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix before running.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
