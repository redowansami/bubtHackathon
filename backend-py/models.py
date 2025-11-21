"""
Data models for expiration risk prediction system
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum


class FoodCategory(str, Enum):
    """Food categories with inherent perishability"""
    DAIRY = "dairy"
    MEAT = "meat"
    SEAFOOD = "seafood"
    FRUITS = "fruits"
    VEGETABLES = "vegetables"
    BAKERY = "bakery"
    CANNED = "canned"
    FROZEN = "frozen"
    CONDIMENTS = "condiments"
    GRAINS = "grains"


class StorageType(str, Enum):
    """Storage condition types"""
    REFRIGERATOR = "refrigerator"
    FREEZER = "freezer"
    PANTRY = "pantry"


class RiskLevel(str, Enum):
    """Risk level classification"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RiskFactors(BaseModel):
    """Breakdown of factors contributing to risk score"""
    base_shelf_life: float
    category_modifier: float
    seasonal_modifier: float
    consumption_frequency: float
    storage_condition: float


class ExpirationRisk(BaseModel):
    """Risk assessment for an inventory item"""
    item_id: str
    item_name: str
    category: FoodCategory
    risk_score: float  # 0-100 scale
    risk_level: RiskLevel
    days_until_expiry: int
    consumption_priority: int
    factors: RiskFactors
    recommended_action: str
    expiration_date: Optional[datetime] = None


class InventoryItem(BaseModel):
    """Inventory item structure"""
    id: str
    name: str
    category: FoodCategory
    quantity: float
    unit: str
    date_added: datetime
    expiration_date: Optional[datetime] = None
    storage_type: StorageType


class ConsumptionLog(BaseModel):
    """Record of consumed item"""
    id: str
    user_id: str
    item_id: str
    item_name: str
    quantity_consumed: float
    unit: str
    consumed_at: datetime
    was_expired: bool


class ExpiredConsumptionAlert(BaseModel):
    """Alert for consuming expired item"""
    item_id: str
    item_name: str
    expiration_date: datetime
    days_expired: int
    message: str
    health_warning: str


class ExpirationAlert(BaseModel):
    """Generic expiration alert"""
    id: str
    item_id: str
    item_name: str
    alert_type: str  # 'critical' | 'high' | 'medium'
    message: str
    created_at: datetime
    is_read: bool = False
    suggested_action: str
    related_recipes: Optional[List[str]] = None


class ConsumptionLogRequest(BaseModel):
    """Request body for logging consumption"""
    item_id: str
    quantity: float
    unit: str
    user_id: str


class ConsumptionLogResponse(BaseModel):
    """Response after logging consumption"""
    success: bool
    expired_alert: Optional[ExpiredConsumptionAlert] = None
    consumption_logged: bool
    updated_inventory: Optional[List[InventoryItem]] = None
    risk_assessments: Optional[List[ExpirationRisk]] = None
    priority_list: Optional[List[ExpirationRisk]] = None
    message: str


class ConsumptionFrequency(BaseModel):
    """Consumption frequency data for a category"""
    category: FoodCategory
    total_consumed: float
    last_consumed_date: datetime
    consumption_count: int
    average_days_between_consumption: float
