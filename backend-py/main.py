"""
InnovateX FastAPI Backend - AI-Powered Food Management Platform
Expiration Risk Prediction System
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

# Import models and services
from models import (
    ConsumptionLogRequest,
    ConsumptionLogResponse,
    InventoryItem,
    FoodCategory,
    StorageType,
)
from consumption_service import (
    log_consumption,
    get_all_alerts,
    dismiss_alert,
    get_priority_list,
    add_inventory_item,
    get_inventory_risks,
    get_item_risk,
)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="InnovateX API - Expiration Risk Prediction",
    description="AI-Powered Food Management & Sustainability Platform with Smart Expiration Risk Prediction",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Health & Info Endpoints
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "API is running",
        "service": "InnovateX Backend",
        "version": "2.0.0",
        "features": ["expiration-risk-prediction", "consumption-logging", "alerts"],
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to InnovateX API v2.0",
        "features": [
            "Expiration Risk Prediction",
            "Consumption Logging",
            "Real-time Risk Recalculation",
            "Smart Prioritization (FIFO + AI)",
            "Expiration Alerts",
        ],
        "docs_url": "/docs",
        "health_url": "/health",
    }


# ============================================================================
# Consumption Endpoints
# ============================================================================

@app.post("/api/consumption/log", response_model=ConsumptionLogResponse)
async def log_consumption_endpoint(request: ConsumptionLogRequest):
    """
    Log consumption of an inventory item.
    
    Triggers:
    1. Expired item detection
    2. Inventory reduction
    3. Consumption event logging
    4. Real-time risk recalculation for all items
    5. Alert generation for high-risk items
    
    Returns updated inventory, risks, and alerts.
    """
    try:
        response = log_consumption(
            user_id=request.user_id,
            item_id=request.item_id,
            quantity=request.quantity,
            unit=request.unit,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Risk Assessment Endpoints
# ============================================================================

@app.get("/api/inventory/risks")
async def get_inventory_risks_endpoint(user_id: str):
    """
    Get all inventory items with calculated risk scores.
    
    Returns:
    - Complete risk assessment for each item
    - Risk factors breakdown
    - Recommended actions
    - Sorted by consumption priority
    """
    try:
        risks = get_inventory_risks(user_id)
        return {
            "success": True,
            "count": len(risks),
            "risks": risks,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/inventory/risks/{item_id}")
async def get_item_risk_endpoint(item_id: str, user_id: str):
    """
    Get detailed risk assessment for a specific inventory item.
    
    Returns:
    - Risk score and level
    - All contributing factors
    - Days until expiry
    - Recommended actions
    """
    try:
        risk = get_item_risk(user_id, item_id)
        if risk is None:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {
            "success": True,
            "risk": risk,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Alert Endpoints
# ============================================================================

@app.get("/api/alerts/expiration")
async def get_expiration_alerts(user_id: str):
    """
    Get all active expiration alerts for the user.
    
    Includes:
    - Critical alerts (expiring within 24-48 hours)
    - High-risk alerts
    - Expired item consumption warnings
    """
    try:
        alerts = get_all_alerts(user_id)
        return {
            "success": True,
            "count": len(alerts),
            "alerts": alerts,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/alerts/dismiss/{alert_id}")
async def dismiss_alert_endpoint(alert_id: str):
    """
    Mark an alert as read/dismissed.
    """
    try:
        success = dismiss_alert(alert_id)
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {
            "success": True,
            "message": "Alert dismissed",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Priority List Endpoints
# ============================================================================

@app.get("/api/inventory/priority-list")
async def get_priority_list_endpoint(user_id: str):
    """
    Get consumption priority ranking combining:
    - AI risk scores (60% weight)
    - FIFO principle (40% weight)
    
    Returns top 10 items that should be consumed first.
    """
    try:
        priority_list = get_priority_list(user_id)
        return {
            "success": True,
            "count": len(priority_list),
            "priority_list": priority_list,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Test/Demo Endpoints
# ============================================================================

@app.post("/api/test/add-inventory")
async def add_test_inventory(user_id: str):
    """
    Add sample inventory items for testing.
    
    Creates:
    - Expired milk
    - Fresh vegetables
    - Canned goods
    - Frozen items
    """
    try:
        # Add sample items
        items = [
            InventoryItem(
                id="inv_001",
                name="Milk",
                category=FoodCategory.DAIRY,
                quantity=1.5,
                unit="liters",
                date_added=datetime.now() - timedelta(days=5),
                expiration_date=datetime.now() - timedelta(days=1),  # Expired
                storage_type=StorageType.REFRIGERATOR,
            ),
            InventoryItem(
                id="inv_002",
                name="Broccoli",
                category=FoodCategory.VEGETABLES,
                quantity=2.0,
                unit="kg",
                date_added=datetime.now() - timedelta(days=2),
                expiration_date=datetime.now() + timedelta(days=3),
                storage_type=StorageType.REFRIGERATOR,
            ),
            InventoryItem(
                id="inv_003",
                name="Salmon",
                category=FoodCategory.SEAFOOD,
                quantity=0.5,
                unit="kg",
                date_added=datetime.now() - timedelta(days=1),
                expiration_date=datetime.now() + timedelta(days=1),
                storage_type=StorageType.REFRIGERATOR,
            ),
            InventoryItem(
                id="inv_004",
                name="Canned Beans",
                category=FoodCategory.CANNED,
                quantity=3.0,
                unit="cans",
                date_added=datetime.now() - timedelta(days=100),
                expiration_date=datetime.now() + timedelta(days=200),
                storage_type=StorageType.PANTRY,
            ),
            InventoryItem(
                id="inv_005",
                name="Frozen Pizza",
                category=FoodCategory.FROZEN,
                quantity=2.0,
                unit="pieces",
                date_added=datetime.now() - timedelta(days=50),
                expiration_date=datetime.now() + timedelta(days=100),
                storage_type=StorageType.FREEZER,
            ),
            InventoryItem(
                id="inv_006",
                name="Apples",
                category=FoodCategory.FRUITS,
                quantity=1.5,
                unit="kg",
                date_added=datetime.now() - timedelta(days=10),
                expiration_date=datetime.now() + timedelta(days=5),
                storage_type=StorageType.PANTRY,
            ),
        ]
        
        for item in items:
            add_inventory_item(item)
        
        # Get risks for the items
        risks = get_inventory_risks(user_id)
        
        return {
            "success": True,
            "message": f"Added {len(items)} test inventory items",
            "items": items,
            "risks": risks,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=debug,
        log_level="info",
    )
