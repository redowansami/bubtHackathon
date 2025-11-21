"""
Consumption logging and alert service
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict
from models import (
    ConsumptionLog,
    ConsumptionLogResponse,
    ExpiredConsumptionAlert,
    InventoryItem,
    ExpirationAlert,
    ExpirationRisk,
)
from risk_calculator import (
    calculate_all_risks,
    calculate_days_to_expiry,
    get_risk_level,
)


# Simulated data store (in production, use a real database)
inventory_store: Dict[str, InventoryItem] = {}
consumption_logs_store: List[ConsumptionLog] = []
consumption_frequency_store: Dict[str, int] = {}  # {item_id: days_since_consumed}
alerts_store: List[ExpirationAlert] = []


def check_if_expired(item: InventoryItem) -> bool:
    """Check if an item is expired"""
    if item.expiration_date is None:
        return False
    return datetime.now() > item.expiration_date


def get_days_expired(item: InventoryItem) -> int:
    """Calculate how many days an item has been expired"""
    if item.expiration_date is None:
        return 0
    days = (datetime.now() - item.expiration_date).days
    return max(0, days)


def create_expired_consumption_alert(item: InventoryItem) -> ExpiredConsumptionAlert:
    """Create alert for consuming expired item"""
    days_expired = get_days_expired(item)
    
    return ExpiredConsumptionAlert(
        item_id=item.id,
        item_name=item.name,
        expiration_date=item.expiration_date,
        days_expired=days_expired,
        message=f"⚠️ Warning: {item.name} expired {days_expired} days ago.",
        health_warning="Please check for signs of spoilage before consuming. "
        "Consuming expired food may pose health risks.",
    )


def update_consumption_frequency(
    user_id: str,
    item_id: str,
    item: InventoryItem,
):
    """Update consumption frequency for category"""
    # Reset days_since_consumed for this item
    consumption_frequency_store[item_id] = 0
    
    # In production, update database with consumption history
    # For now, we'll just track in memory


def reduce_inventory_quantity(
    item_id: str,
    quantity: float,
) -> Optional[InventoryItem]:
    """Reduce inventory quantity"""
    if item_id not in inventory_store:
        return None
    
    item = inventory_store[item_id]
    new_quantity = item.quantity - quantity
    
    if new_quantity < 0:
        return None  # Insufficient quantity
    
    # Update inventory
    item.quantity = new_quantity
    inventory_store[item_id] = item
    
    return item


def log_consumption_event(
    user_id: str,
    item_id: str,
    item: InventoryItem,
    quantity: float,
    unit: str,
    was_expired: bool,
) -> ConsumptionLog:
    """Create consumption log entry"""
    log = ConsumptionLog(
        id=f"log_{len(consumption_logs_store)}",
        user_id=user_id,
        item_id=item_id,
        item_name=item.name,
        quantity_consumed=quantity,
        unit=unit,
        consumed_at=datetime.now(),
        was_expired=was_expired,
    )
    
    consumption_logs_store.append(log)
    return log


def create_high_risk_alerts(
    user_id: str,
    risks: List[ExpirationRisk],
) -> List[ExpirationAlert]:
    """Create alerts for high-risk items"""
    new_alerts = []
    
    for risk in risks:
        if risk.risk_level.value in ["critical", "high"]:
            alert = ExpirationAlert(
                id=f"alert_{len(alerts_store)}",
                item_id=risk.item_id,
                item_name=risk.item_name,
                alert_type=risk.risk_level.value,
                message=f"High priority: {risk.recommended_action}",
                created_at=datetime.now(),
                is_read=False,
                suggested_action=risk.recommended_action,
                related_recipes=None,
            )
            alerts_store.append(alert)
            new_alerts.append(alert)
    
    return new_alerts


def log_consumption(
    user_id: str,
    item_id: str,
    quantity: float,
    unit: str,
) -> ConsumptionLogResponse:
    """
    Complete consumption logging flow with risk recalculation
    
    Steps:
    1. Fetch the inventory item
    2. Check if item is expired
    3. Reduce inventory quantity
    4. Log the consumption event
    5. Update consumption frequency for this category
    6. Recalculate risk for all remaining items
    7. Return comprehensive response
    """
    
    try:
        # Step 1: Fetch inventory item
        if item_id not in inventory_store:
            return ConsumptionLogResponse(
                success=False,
                consumption_logged=False,
                message="Item not found in inventory",
            )
        
        item = inventory_store[item_id]
        
        # Check if quantity is sufficient
        if item.quantity < quantity:
            return ConsumptionLogResponse(
                success=False,
                consumption_logged=False,
                message=f"Insufficient quantity. Available: {item.quantity}",
            )
        
        # Step 2: Check if item is expired
        is_expired = check_if_expired(item)
        expired_alert = None
        
        if is_expired:
            expired_alert = create_expired_consumption_alert(item)
        
        # Step 3: Reduce inventory quantity
        updated_item = reduce_inventory_quantity(item_id, quantity)
        if updated_item is None:
            return ConsumptionLogResponse(
                success=False,
                consumption_logged=False,
                message="Failed to reduce inventory quantity",
            )
        
        # Step 4: Log consumption event
        consumption_log = log_consumption_event(
            user_id,
            item_id,
            item,
            quantity,
            unit,
            is_expired,
        )
        
        # Step 5: Update consumption frequency
        update_consumption_frequency(user_id, item_id, item)
        
        # Step 6: Recalculate risk for all remaining items
        remaining_items = [
            inv_item for inv_item in inventory_store.values()
            if inv_item.quantity > 0
        ]
        
        updated_risks = calculate_all_risks(
            remaining_items,
            consumption_frequency_store,
        )
        
        # Create alerts for high-risk items
        new_alerts = create_high_risk_alerts(user_id, updated_risks)
        
        # Step 7: Return comprehensive response
        return ConsumptionLogResponse(
            success=True,
            consumption_logged=True,
            expired_alert=expired_alert,
            updated_inventory=remaining_items,
            risk_assessments=updated_risks,
            priority_list=sorted(
                updated_risks,
                key=lambda x: x.consumption_priority,
                reverse=True,
            )[:10],  # Top 10 priority items
            message="Consumption logged successfully and risks recalculated"
            if not is_expired
            else "Consumption logged (EXPIRED ITEM ALERT!)",
        )
    
    except Exception as e:
        return ConsumptionLogResponse(
            success=False,
            consumption_logged=False,
            message=f"Error logging consumption: {str(e)}",
        )


def get_all_alerts(user_id: str) -> List[ExpirationAlert]:
    """Get all unread expiration alerts"""
    return [alert for alert in alerts_store if not alert.is_read]


def dismiss_alert(alert_id: str) -> bool:
    """Mark alert as read/dismissed"""
    for alert in alerts_store:
        if alert.id == alert_id:
            alert.is_read = True
            return True
    return False


def get_priority_list(user_id: str) -> List[ExpirationRisk]:
    """Get consumption priority list"""
    items = [
        item for item in inventory_store.values()
        if item.quantity > 0
    ]
    
    risks = calculate_all_risks(items, consumption_frequency_store)
    return risks[:10]  # Return top 10 priority items


def add_inventory_item(item: InventoryItem):
    """Add item to inventory (for testing)"""
    inventory_store[item.id] = item
    consumption_frequency_store[item.id] = 30  # Default: not consumed recently


def get_inventory_risks(user_id: str) -> List[ExpirationRisk]:
    """Get all items with risk scores"""
    items = list(inventory_store.values())
    risks = calculate_all_risks(items, consumption_frequency_store)
    return risks


def get_item_risk(user_id: str, item_id: str) -> Optional[ExpirationRisk]:
    """Get risk details for specific item"""
    if item_id not in inventory_store:
        return None
    
    item = inventory_store[item_id]
    days_since_consumed = consumption_frequency_store.get(item_id, 30)
    
    from risk_calculator import calculate_expiration_risk
    
    return calculate_expiration_risk(item, days_since_consumed)
