"""
API Payload Examples and Testing Guide
For InnovateX Expiration Risk Prediction System

This file contains example requests and responses for all API endpoints.
Use these to test the system and understand the data format.
"""

import json
from datetime import datetime, timedelta

# ============================================================================
# 1. HEALTH CHECK
# ============================================================================

HEALTH_CHECK_REQUEST = """
GET /health
"""

HEALTH_CHECK_RESPONSE = {
    "status": "API is running",
    "service": "InnovateX Backend",
    "version": "2.0.0",
    "features": [
        "expiration-risk-prediction",
        "consumption-logging",
        "alerts"
    ]
}

# ============================================================================
# 2. TEST DATA SETUP
# ============================================================================

ADD_TEST_INVENTORY_REQUEST = """
POST /api/test/add-inventory
Query Parameters:
  - user_id: "user_123"
"""

ADD_TEST_INVENTORY_RESPONSE = {
    "success": True,
    "message": "Added 6 test inventory items",
    "items": [
        {
            "id": "inv_001",
            "name": "Milk",
            "category": "dairy",
            "quantity": 1.5,
            "unit": "liters",
            "date_added": "2025-11-16T10:30:00",
            "expiration_date": "2025-11-20T10:30:00",
            "storage_type": "refrigerator"
        },
        {
            "id": "inv_002",
            "name": "Broccoli",
            "category": "vegetables",
            "quantity": 2.0,
            "unit": "kg",
            "date_added": "2025-11-19T10:30:00",
            "expiration_date": "2025-11-24T10:30:00",
            "storage_type": "refrigerator"
        },
        {
            "id": "inv_003",
            "name": "Salmon",
            "category": "seafood",
            "quantity": 0.5,
            "unit": "kg",
            "date_added": "2025-11-20T10:30:00",
            "expiration_date": "2025-11-22T10:30:00",
            "storage_type": "refrigerator"
        },
        {
            "id": "inv_004",
            "name": "Canned Beans",
            "category": "canned",
            "quantity": 3.0,
            "unit": "cans",
            "date_added": "2025-08-12T10:30:00",
            "expiration_date": "2026-05-21T10:30:00",
            "storage_type": "pantry"
        },
        {
            "id": "inv_005",
            "name": "Frozen Pizza",
            "category": "frozen",
            "quantity": 2.0,
            "unit": "pieces",
            "date_added": "2025-10-02T10:30:00",
            "expiration_date": "2025-12-31T10:30:00",
            "storage_type": "freezer"
        },
        {
            "id": "inv_006",
            "name": "Apples",
            "category": "fruits",
            "quantity": 1.5,
            "unit": "kg",
            "date_added": "2025-11-11T10:30:00",
            "expiration_date": "2025-11-26T10:30:00",
            "storage_type": "pantry"
        }
    ],
    "risks": [
        {
            "item_id": "inv_003",
            "item_name": "Salmon",
            "category": "seafood",
            "risk_score": 92.5,
            "risk_level": "critical",
            "days_until_expiry": 1,
            "consumption_priority": 89.3,
            "factors": {
                "base_shelf_life": 90,
                "category_modifier": 95,
                "seasonal_modifier": 150,
                "consumption_frequency": 80,
                "storage_condition": 85
            },
            "recommended_action": "Consume immediately! Salmon expires in 1 days.",
            "expiration_date": "2025-11-22T10:30:00"
        }
    ]
}

# ============================================================================
# 3. LOGGING CONSUMPTION
# ============================================================================

LOG_CONSUMPTION_REQUEST = {
    "item_id": "inv_001",
    "quantity": 0.5,
    "unit": "liters",
    "user_id": "user_123"
}

LOG_CONSUMPTION_REQUEST_BODY = """
POST /api/consumption/log
Content-Type: application/json

{
    "item_id": "inv_001",
    "quantity": 0.5,
    "unit": "liters",
    "user_id": "user_123"
}
"""

LOG_CONSUMPTION_RESPONSE = {
    "success": True,
    "consumption_logged": True,
    "expired_alert": None,
    "updated_inventory": [
        {
            "id": "inv_001",
            "name": "Milk",
            "category": "dairy",
            "quantity": 1.0,
            "unit": "liters",
            "date_added": "2025-11-16T10:30:00",
            "expiration_date": "2025-11-20T10:30:00",
            "storage_type": "refrigerator"
        },
        {
            "id": "inv_002",
            "name": "Broccoli",
            "category": "vegetables",
            "quantity": 2.0,
            "unit": "kg",
            "date_added": "2025-11-19T10:30:00",
            "expiration_date": "2025-11-24T10:30:00",
            "storage_type": "refrigerator"
        }
    ],
    "risk_assessments": [
        {
            "item_id": "inv_003",
            "item_name": "Salmon",
            "category": "seafood",
            "risk_score": 92.5,
            "risk_level": "critical",
            "days_until_expiry": 1,
            "consumption_priority": 89.3,
            "factors": {
                "base_shelf_life": 90,
                "category_modifier": 95,
                "seasonal_modifier": 150,
                "consumption_frequency": 80,
                "storage_condition": 85
            },
            "recommended_action": "Consume immediately! Salmon expires in 1 days.",
            "expiration_date": "2025-11-22T10:30:00"
        },
        {
            "item_id": "inv_002",
            "item_name": "Broccoli",
            "category": "vegetables",
            "risk_score": 65.3,
            "risk_level": "high",
            "days_until_expiry": 4,
            "consumption_priority": 72.8,
            "factors": {
                "base_shelf_life": 60,
                "category_modifier": 65,
                "seasonal_modifier": 130,
                "consumption_frequency": 50,
                "storage_condition": 85
            },
            "recommended_action": "Use within 4 days. Consider prioritizing this item.",
            "expiration_date": "2025-11-24T10:30:00"
        },
        {
            "item_id": "inv_001",
            "item_name": "Milk",
            "category": "dairy",
            "risk_score": 58.2,
            "risk_level": "medium",
            "days_until_expiry": 0,
            "consumption_priority": 65.4,
            "factors": {
                "base_shelf_life": 55,
                "category_modifier": 85,
                "seasonal_modifier": 120,
                "consumption_frequency": 40,
                "storage_condition": 85
            },
            "recommended_action": "Plan consumption within 1-2 weeks. Milk is moderately urgent.",
            "expiration_date": "2025-11-20T10:30:00"
        }
    ],
    "priority_list": [
        {
            "item_id": "inv_003",
            "item_name": "Salmon",
            "category": "seafood",
            "risk_score": 92.5,
            "risk_level": "critical",
            "days_until_expiry": 1,
            "consumption_priority": 89.3,
            "factors": {
                "base_shelf_life": 90,
                "category_modifier": 95,
                "seasonal_modifier": 150,
                "consumption_frequency": 80,
                "storage_condition": 85
            },
            "recommended_action": "Consume immediately! Salmon expires in 1 days."
        },
        {
            "item_id": "inv_002",
            "item_name": "Broccoli",
            "category": "vegetables",
            "risk_score": 65.3,
            "risk_level": "high",
            "days_until_expiry": 4,
            "consumption_priority": 72.8,
            "factors": {
                "base_shelf_life": 60,
                "category_modifier": 65,
                "seasonal_modifier": 130,
                "consumption_frequency": 50,
                "storage_condition": 85
            },
            "recommended_action": "Use within 4 days. Consider prioritizing this item."
        }
    ],
    "message": "Consumption logged successfully and risks recalculated"
}

# ============================================================================
# 4. CONSUMING EXPIRED ITEM
# ============================================================================

LOG_EXPIRED_CONSUMPTION_REQUEST = {
    "item_id": "inv_001",  # Already expired
    "quantity": 1.0,
    "unit": "liters",
    "user_id": "user_123"
}

LOG_EXPIRED_CONSUMPTION_RESPONSE = {
    "success": True,
    "consumption_logged": True,
    "expired_alert": {
        "item_id": "inv_001",
        "item_name": "Milk",
        "expiration_date": "2025-11-20T10:30:00",
        "days_expired": 1,
        "message": "⚠️ Warning: Milk expired 1 days ago.",
        "health_warning": "Please check for signs of spoilage before consuming. "
                         "Consuming expired food may pose health risks."
    },
    "updated_inventory": [
        {
            "id": "inv_002",
            "name": "Broccoli",
            "category": "vegetables",
            "quantity": 2.0,
            "unit": "kg",
            "date_added": "2025-11-19T10:30:00",
            "expiration_date": "2025-11-24T10:30:00",
            "storage_type": "refrigerator"
        }
    ],
    "risk_assessments": [
        {
            "item_id": "inv_002",
            "item_name": "Broccoli",
            "category": "vegetables",
            "risk_score": 65.3,
            "risk_level": "high",
            "days_until_expiry": 4,
            "consumption_priority": 72.8,
            "factors": {
                "base_shelf_life": 60,
                "category_modifier": 65,
                "seasonal_modifier": 130,
                "consumption_frequency": 50,
                "storage_condition": 85
            },
            "recommended_action": "Use within 4 days. Consider prioritizing this item."
        }
    ],
    "priority_list": [
        {
            "item_id": "inv_002",
            "item_name": "Broccoli",
            "category": "vegetables",
            "risk_score": 65.3,
            "risk_level": "high",
            "days_until_expiry": 4,
            "consumption_priority": 72.8,
            "factors": {
                "base_shelf_life": 60,
                "category_modifier": 65,
                "seasonal_modifier": 130,
                "consumption_frequency": 50,
                "storage_condition": 85
            },
            "recommended_action": "Use within 4 days. Consider prioritizing this item."
        }
    ],
    "message": "Consumption logged (EXPIRED ITEM ALERT!)"
}

# ============================================================================
# 5. GET ALL RISKS
# ============================================================================

GET_INVENTORY_RISKS_REQUEST = """
GET /api/inventory/risks?user_id=user_123
"""

GET_INVENTORY_RISKS_RESPONSE = {
    "success": True,
    "count": 6,
    "risks": [
        {
            "item_id": "inv_003",
            "item_name": "Salmon",
            "category": "seafood",
            "risk_score": 92.5,
            "risk_level": "critical",
            "days_until_expiry": 1,
            "consumption_priority": 89.3,
            "factors": {
                "base_shelf_life": 90,
                "category_modifier": 95,
                "seasonal_modifier": 150,
                "consumption_frequency": 80,
                "storage_condition": 85
            },
            "recommended_action": "Consume immediately! Salmon expires in 1 days."
        },
        {
            "item_id": "inv_002",
            "item_name": "Broccoli",
            "category": "vegetables",
            "risk_score": 65.3,
            "risk_level": "high",
            "days_until_expiry": 4,
            "consumption_priority": 72.8,
            "factors": {
                "base_shelf_life": 60,
                "category_modifier": 65,
                "seasonal_modifier": 130,
                "consumption_frequency": 50,
                "storage_condition": 85
            },
            "recommended_action": "Use within 4 days. Consider prioritizing this item."
        },
        {
            "item_id": "inv_001",
            "item_name": "Milk",
            "category": "dairy",
            "risk_score": 58.2,
            "risk_level": "medium",
            "days_until_expiry": 0,
            "consumption_priority": 65.4,
            "factors": {
                "base_shelf_life": 55,
                "category_modifier": 85,
                "seasonal_modifier": 120,
                "consumption_frequency": 40,
                "storage_condition": 85
            },
            "recommended_action": "Plan consumption within 1-2 weeks. Milk is moderately urgent."
        },
        {
            "item_id": "inv_006",
            "item_name": "Apples",
            "category": "fruits",
            "risk_score": 48.5,
            "risk_level": "medium",
            "days_until_expiry": 5,
            "consumption_priority": 52.3,
            "factors": {
                "base_shelf_life": 45,
                "category_modifier": 70,
                "seasonal_modifier": 130,
                "consumption_frequency": 35,
                "storage_condition": 70
            },
            "recommended_action": "Plan consumption within 1-2 weeks. Apples is moderately urgent."
        },
        {
            "item_id": "inv_005",
            "item_name": "Frozen Pizza",
            "category": "frozen",
            "risk_score": 22.8,
            "risk_level": "low",
            "days_until_expiry": 40,
            "consumption_priority": 28.6,
            "factors": {
                "base_shelf_life": 20,
                "category_modifier": 20,
                "seasonal_modifier": 100,
                "consumption_frequency": 25,
                "storage_condition": 95
            },
            "recommended_action": "Frozen Pizza is in good condition. No immediate action needed."
        },
        {
            "item_id": "inv_004",
            "item_name": "Canned Beans",
            "category": "canned",
            "risk_score": 12.5,
            "risk_level": "low",
            "days_until_expiry": 200,
            "consumption_priority": 15.2,
            "factors": {
                "base_shelf_life": 10,
                "category_modifier": 15,
                "seasonal_modifier": 100,
                "consumption_frequency": 20,
                "storage_condition": 70
            },
            "recommended_action": "Canned Beans is in good condition. No immediate action needed."
        }
    ]
}

# ============================================================================
# 6. GET SPECIFIC ITEM RISK
# ============================================================================

GET_ITEM_RISK_REQUEST = """
GET /api/inventory/risks/inv_003?user_id=user_123
"""

GET_ITEM_RISK_RESPONSE = {
    "success": True,
    "risk": {
        "item_id": "inv_003",
        "item_name": "Salmon",
        "category": "seafood",
        "risk_score": 92.5,
        "risk_level": "critical",
        "days_until_expiry": 1,
        "consumption_priority": 89.3,
        "factors": {
            "base_shelf_life": 90,
            "category_modifier": 95,
            "seasonal_modifier": 150,
            "consumption_frequency": 80,
            "storage_condition": 85
        },
        "recommended_action": "Consume immediately! Salmon expires in 1 days."
    }
}

# ============================================================================
# 7. GET PRIORITY LIST
# ============================================================================

GET_PRIORITY_LIST_REQUEST = """
GET /api/inventory/priority-list?user_id=user_123
"""

GET_PRIORITY_LIST_RESPONSE = {
    "success": True,
    "count": 10,
    "priority_list": [
        {
            "item_id": "inv_003",
            "item_name": "Salmon",
            "category": "seafood",
            "risk_score": 92.5,
            "risk_level": "critical",
            "days_until_expiry": 1,
            "consumption_priority": 89.3,
            "factors": {
                "base_shelf_life": 90,
                "category_modifier": 95,
                "seasonal_modifier": 150,
                "consumption_frequency": 80,
                "storage_condition": 85
            },
            "recommended_action": "Consume immediately! Salmon expires in 1 days."
        },
        {
            "item_id": "inv_002",
            "item_name": "Broccoli",
            "category": "vegetables",
            "risk_score": 65.3,
            "risk_level": "high",
            "days_until_expiry": 4,
            "consumption_priority": 72.8,
            "factors": {
                "base_shelf_life": 60,
                "category_modifier": 65,
                "seasonal_modifier": 130,
                "consumption_frequency": 50,
                "storage_condition": 85
            },
            "recommended_action": "Use within 4 days. Consider prioritizing this item."
        },
        {
            "item_id": "inv_001",
            "item_name": "Milk",
            "category": "dairy",
            "risk_score": 58.2,
            "risk_level": "medium",
            "days_until_expiry": 0,
            "consumption_priority": 65.4,
            "factors": {
                "base_shelf_life": 55,
                "category_modifier": 85,
                "seasonal_modifier": 120,
                "consumption_frequency": 40,
                "storage_condition": 85
            },
            "recommended_action": "Plan consumption within 1-2 weeks. Milk is moderately urgent."
        }
    ]
}

# ============================================================================
# 8. GET ALERTS
# ============================================================================

GET_ALERTS_REQUEST = """
GET /api/alerts/expiration?user_id=user_123
"""

GET_ALERTS_RESPONSE = {
    "success": True,
    "count": 2,
    "alerts": [
        {
            "id": "alert_001",
            "item_id": "inv_003",
            "item_name": "Salmon",
            "alert_type": "critical",
            "message": "High priority: Consume immediately! Salmon expires in 1 days.",
            "created_at": "2025-11-21T15:30:00",
            "is_read": False,
            "suggested_action": "Consume immediately! Salmon expires in 1 days.",
            "related_recipes": None
        },
        {
            "id": "alert_002",
            "item_id": "inv_002",
            "item_name": "Broccoli",
            "alert_type": "high",
            "message": "High priority: Use within 4 days. Consider prioritizing this item.",
            "created_at": "2025-11-21T15:30:00",
            "is_read": False,
            "suggested_action": "Use within 4 days. Consider prioritizing this item.",
            "related_recipes": None
        }
    ]
}

# ============================================================================
# 9. DISMISS ALERT
# ============================================================================

DISMISS_ALERT_REQUEST = """
POST /api/alerts/dismiss/alert_001
"""

DISMISS_ALERT_RESPONSE = {
    "success": True,
    "message": "Alert dismissed"
}

# ============================================================================
# TESTING GUIDE
# ============================================================================

TESTING_GUIDE = """
╔════════════════════════════════════════════════════════════════════════════╗
║     InnovateX API - TESTING GUIDE & USAGE INSTRUCTIONS                    ║
╚════════════════════════════════════════════════════════════════════════════╝

ENVIRONMENT SETUP
─────────────────
1. Start the Python FastAPI server:
   cd /path/to/backend-py
   python main.py

2. Server will run at: http://localhost:8000

3. API Documentation available at:
   - Interactive Docs: http://localhost:8000/docs (Swagger UI)
   - ReDoc: http://localhost:8000/redoc

4. Health check:
   curl http://localhost:8000/health

QUICK START FLOW
────────────────
1. Add test inventory:
   POST /api/test/add-inventory?user_id=user_123

2. Get all risks:
   GET /api/inventory/risks?user_id=user_123

3. Log consumption:
   POST /api/consumption/log
   Body: {
       "item_id": "inv_001",
       "quantity": 0.5,
       "unit": "liters",
       "user_id": "user_123"
   }

4. Check alerts:
   GET /api/alerts/expiration?user_id=user_123

5. Get priority list:
   GET /api/inventory/priority-list?user_id=user_123

KEY FEATURES
────────────
✓ Real-time Risk Calculation
  - 40%: Days to expiry
  - 25%: Category inherent perishability
  - 15%: Seasonal modifiers
  - 15%: Consumption frequency
  - 5%: Storage conditions

✓ Smart Prioritization
  - Combines AI risk scores (60%) + FIFO principle (40%)
  - Returns items in consumption priority order

✓ Expired Item Detection
  - Alerts when consuming expired items
  - Shows days expired and health warnings

✓ Real-time Risk Recalculation
  - Triggered automatically after each consumption
  - All remaining items re-scored

✓ Alert System
  - Critical (risk score 80-100): Immediate action
  - High (60-79): Daily attention
  - Medium (40-59): Weekly review
  - Low (0-39): Monitor

SAMPLE TEST SCENARIOS
─────────────────────

Scenario 1: Consume Fresh Item
- Item: inv_001 (Milk)
- Action: Log 0.5 liters consumption
- Expected: Risk scores update for all items

Scenario 2: Consume Expired Item
- Item: inv_001 (Already expired)
- Action: Log full consumption (1.0 liter)
- Expected: EXPIRED_ALERT in response

Scenario 3: Check Priority List
- Before: Salmon (Critical), Broccoli (High), Milk (Medium)
- After consumption: Risks recalculated, list reordered

CURL EXAMPLES
─────────────

1. Health Check:
curl http://localhost:8000/health

2. Add Test Inventory:
curl -X POST http://localhost:8000/api/test/add-inventory?user_id=user_123

3. Log Consumption:
curl -X POST http://localhost:8000/api/consumption/log \\
  -H "Content-Type: application/json" \\
  -d '{
    "item_id": "inv_001",
    "quantity": 0.5,
    "unit": "liters",
    "user_id": "user_123"
  }'

4. Get Risks:
curl http://localhost:8000/api/inventory/risks?user_id=user_123

5. Get Priority List:
curl http://localhost:8000/api/inventory/priority-list?user_id=user_123

6. Get Alerts:
curl http://localhost:8000/api/alerts/expiration?user_id=user_123

7. Dismiss Alert:
curl -X POST http://localhost:8000/api/alerts/dismiss/alert_001

RISK LEVEL REFERENCE
────────────────────
Score Range | Level    | Action Required
  80-100    | Critical | Consume immediately
  60-79     | High     | Use within days
  40-59     | Medium   | Plan usage soon
   0-39     | Low      | No rush

CATEGORY RISK SCORES (Perishability)
─────────────────────────────────────
Seafood (0.95) > Meat (0.90) > Dairy (0.85) > 
Fruits (0.70) > Vegetables (0.65) > Bakery (0.60) > 
Condiments (0.25) > Frozen (0.20) > Grains (0.20) > Canned (0.15)
"""

if __name__ == "__main__":
    print(TESTING_GUIDE)
    print("\n" + "="*80)
    print("API PAYLOADS REFERENCE")
    print("="*80)
    
    print("\n1. LOG CONSUMPTION REQUEST:")
    print(json.dumps(LOG_CONSUMPTION_REQUEST, indent=2))
    
    print("\n2. LOG EXPIRED CONSUMPTION RESPONSE:")
    print(json.dumps(LOG_EXPIRED_CONSUMPTION_RESPONSE, indent=2, default=str))
    
    print("\n3. GET INVENTORY RISKS RESPONSE:")
    print(json.dumps(GET_INVENTORY_RISKS_RESPONSE, indent=2, default=str))
