"""
Risk calculation engine for expiration prediction
"""

from datetime import datetime, timedelta
from typing import List, Dict
from models import (
    ExpirationRisk,
    RiskFactors,
    RiskLevel,
    FoodCategory,
    InventoryItem,
)


# Category risk scores (based on inherent perishability)
CATEGORY_RISK_SCORES = {
    FoodCategory.DAIRY: 0.85,
    FoodCategory.MEAT: 0.90,
    FoodCategory.SEAFOOD: 0.95,
    FoodCategory.FRUITS: 0.70,
    FoodCategory.VEGETABLES: 0.65,
    FoodCategory.BAKERY: 0.60,
    FoodCategory.CANNED: 0.15,
    FoodCategory.FROZEN: 0.20,
    FoodCategory.CONDIMENTS: 0.25,
    FoodCategory.GRAINS: 0.20,
}

# Seasonal modifiers based on current season
SEASONAL_MODIFIERS = {
    "summer": {
        FoodCategory.FRUITS: 1.3,
        FoodCategory.VEGETABLES: 1.3,
        FoodCategory.DAIRY: 1.2,
        FoodCategory.MEAT: 1.4,
        FoodCategory.SEAFOOD: 1.5,
    },
    "winter": {
        FoodCategory.FRUITS: 0.9,
        FoodCategory.VEGETABLES: 0.9,
        FoodCategory.DAIRY: 1.0,
        FoodCategory.MEAT: 1.0,
        FoodCategory.SEAFOOD: 1.1,
    },
    "spring": {
        FoodCategory.FRUITS: 1.1,
        FoodCategory.VEGETABLES: 1.1,
        FoodCategory.DAIRY: 1.1,
        FoodCategory.MEAT: 1.1,
        FoodCategory.SEAFOOD: 1.2,
    },
    "fall": {
        FoodCategory.FRUITS: 1.0,
        FoodCategory.VEGETABLES: 1.0,
        FoodCategory.DAIRY: 1.0,
        FoodCategory.MEAT: 1.0,
        FoodCategory.SEAFOOD: 1.0,
    },
}

# Storage condition scores
STORAGE_CONDITION_SCORES = {
    "refrigerator": 0.85,
    "freezer": 0.95,
    "pantry": 0.70,
}


def get_current_season() -> str:
    """Determine current season based on date"""
    month = datetime.now().month
    if month in [12, 1, 2]:
        return "winter"
    elif month in [3, 4, 5]:
        return "spring"
    elif month in [6, 7, 8]:
        return "summer"
    else:
        return "fall"


def calculate_days_to_expiry(expiration_date: datetime) -> int:
    """Calculate days until expiration"""
    if expiration_date is None:
        return 365  # Default for items without expiry date
    
    days = (expiration_date - datetime.now()).days
    return max(0, days)


def calculate_days_to_expiry_score(days_to_expiry: int) -> float:
    """
    Convert days to expiry into a score (0-100).
    Closer to expiry = higher score (more urgent)
    """
    if days_to_expiry < 0:
        return 100  # Already expired
    elif days_to_expiry == 0:
        return 95
    elif days_to_expiry <= 1:
        return 90
    elif days_to_expiry <= 3:
        return 80
    elif days_to_expiry <= 7:
        return 60
    elif days_to_expiry <= 14:
        return 40
    elif days_to_expiry <= 30:
        return 25
    else:
        return 10


def calculate_consumption_frequency_score(
    days_since_last_consumed: int,
    category: FoodCategory,
) -> float:
    """
    Calculate consumption frequency score.
    Items not consumed recently = higher risk
    """
    # Threshold varies by category
    category_thresholds = {
        FoodCategory.DAIRY: 7,
        FoodCategory.MEAT: 10,
        FoodCategory.SEAFOOD: 7,
        FoodCategory.FRUITS: 14,
        FoodCategory.VEGETABLES: 14,
        FoodCategory.BAKERY: 5,
        FoodCategory.CANNED: 30,
        FoodCategory.FROZEN: 60,
        FoodCategory.CONDIMENTS: 60,
        FoodCategory.GRAINS: 60,
    }
    
    threshold = category_thresholds.get(category, 30)
    
    if days_since_last_consumed <= threshold:
        return 20  # Low risk - consuming regularly
    elif days_since_last_consumed <= threshold * 2:
        return 50
    else:
        return 80  # High risk - not consumed in a long time


def calculate_risk_factors(
    item: InventoryItem,
    days_since_last_consumed: int = 30,
) -> RiskFactors:
    """Calculate all risk factors for an item"""
    
    days_to_expiry = calculate_days_to_expiry(item.expiration_date)
    base_shelf_life_score = calculate_days_to_expiry_score(days_to_expiry)
    
    # Category modifier
    category_modifier = CATEGORY_RISK_SCORES.get(item.category, 0.5) * 100
    
    # Seasonal modifier
    season = get_current_season()
    seasonal_modifiers = SEASONAL_MODIFIERS.get(season, {})
    seasonal_modifier = (
        seasonal_modifiers.get(item.category, 1.0) * 100
    )
    
    # Consumption frequency score
    consumption_frequency = calculate_consumption_frequency_score(
        days_since_last_consumed,
        item.category,
    )
    
    # Storage condition
    storage_condition = (
        STORAGE_CONDITION_SCORES.get(item.storage_type, 0.7) * 100
    )
    
    return RiskFactors(
        base_shelf_life=base_shelf_life_score,
        category_modifier=category_modifier,
        seasonal_modifier=seasonal_modifier,
        consumption_frequency=consumption_frequency,
        storage_condition=storage_condition,
    )


def calculate_risk_score(factors: RiskFactors) -> float:
    """
    Calculate overall risk score using weighted formula.
    Weights:
    - Days to expiry: 40%
    - Category risk: 25%
    - Seasonal modifier: 15%
    - Consumption frequency: 15%
    - Storage condition: 5%
    """
    risk_score = (
        (factors.base_shelf_life * 0.40)
        + (factors.category_modifier * 0.25)
        + (factors.seasonal_modifier * 0.15)
        + (factors.consumption_frequency * 0.15)
        + (factors.storage_condition * 0.05)
    )
    
    # Normalize to 0-100 range
    return min(100, max(0, risk_score))


def get_risk_level(risk_score: float) -> RiskLevel:
    """Determine risk level from score"""
    if risk_score >= 80:
        return RiskLevel.CRITICAL
    elif risk_score >= 60:
        return RiskLevel.HIGH
    elif risk_score >= 40:
        return RiskLevel.MEDIUM
    else:
        return RiskLevel.LOW


def get_recommended_action(
    item: InventoryItem,
    risk_level: RiskLevel,
    days_to_expiry: int,
) -> str:
    """Generate recommended action based on risk level"""
    if risk_level == RiskLevel.CRITICAL:
        return f"Consume immediately! {item.name} expires in {days_to_expiry} days."
    elif risk_level == RiskLevel.HIGH:
        return f"Use within {days_to_expiry} days. Consider prioritizing this item."
    elif risk_level == RiskLevel.MEDIUM:
        return f"Plan consumption within 1-2 weeks. {item.name} is moderately urgent."
    else:
        return f"{item.name} is in good condition. No immediate action needed."


def calculate_fifo_score(date_added: datetime) -> float:
    """
    Calculate FIFO (First In, First Out) score.
    Older items get higher scores (should be consumed first)
    """
    days_old = (datetime.now() - date_added).days
    # Score increases with age, capped at 100
    return min(100, days_old * 2)


def calculate_consumption_priority(
    risk_score: float,
    fifo_score: float,
) -> float:
    """
    Combined priority score: 60% AI risk, 40% FIFO
    Higher score = higher priority for consumption
    """
    return (risk_score * 0.6) + (fifo_score * 0.4)


def calculate_expiration_risk(
    item: InventoryItem,
    days_since_last_consumed: int = 30,
) -> ExpirationRisk:
    """
    Complete risk assessment for an inventory item
    """
    days_to_expiry = calculate_days_to_expiry(item.expiration_date)
    
    # Calculate risk factors
    factors = calculate_risk_factors(item, days_since_last_consumed)
    
    # Calculate risk score
    risk_score = calculate_risk_score(factors)
    
    # Determine risk level
    risk_level = get_risk_level(risk_score)
    
    # Get recommended action
    recommended_action = get_recommended_action(
        item,
        risk_level,
        days_to_expiry,
    )
    
    # Calculate FIFO and final priority
    fifo_score = calculate_fifo_score(item.date_added)
    consumption_priority = calculate_consumption_priority(risk_score, fifo_score)
    
    return ExpirationRisk(
        item_id=item.id,
        item_name=item.name,
        category=item.category,
        risk_score=round(risk_score, 2),
        risk_level=risk_level,
        days_until_expiry=days_to_expiry,
        consumption_priority=round(consumption_priority, 2),
        factors=factors,
        recommended_action=recommended_action,
        expiration_date=item.expiration_date,
    )


def calculate_all_risks(
    items: List[InventoryItem],
    consumption_history: Dict[str, int] = None,
) -> List[ExpirationRisk]:
    """
    Calculate risk for all inventory items and sort by priority
    """
    if consumption_history is None:
        consumption_history = {}
    
    risks = []
    for item in items:
        days_since_consumed = consumption_history.get(item.id, 30)
        risk = calculate_expiration_risk(item, days_since_consumed)
        risks.append(risk)
    
    # Sort by consumption priority (highest first)
    risks.sort(key=lambda x: x.consumption_priority, reverse=True)
    
    return risks
