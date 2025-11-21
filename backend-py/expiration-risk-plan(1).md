# AI Expiration Risk Prediction

## Feature Overview

Predict expiry risks for food items based on consumption frequency, item category, and seasonality. Prioritize items for consumption using a combination of FIFO (First In, First Out) and AI-generated ranking scores, then generate in-app alerts for high-risk items.

---

## Core Requirements

| Requirement | Description |
|-------------|-------------|
| Risk Prediction | Calculate expiry risk based on multiple factors |
| Smart Prioritization | Combine FIFO with AI ranking scores |
| Alert System | Generate in-app alerts for high-risk items |
| Expired Item Alert | Warn user when consuming an already expired item |

---

## Trigger Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGS CONSUMPTION                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Check if consumed item is EXPIRED                      │
│  → If expired: Show "Expired Item Alert" to user                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Reduce inventory quantity                              │
│  → Deduct consumed amount from inventory item                   │
│  → If quantity reaches 0, mark item as depleted                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Trigger Risk Recalculation                             │
│  → Recalculate risk scores for ALL remaining inventory items    │
│  → Update consumption frequency data for the consumed category  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Update UI                                              │
│  → Display updated risk scores on inventory page                │
│  → Show priority consumption list                               │
│  → Display any new high-risk alerts                             │
└─────────────────────────────────────────────────────────────────┘
```

**Key Point:** Risk calculation is NOT scheduled — it is triggered in real-time every time a user logs a consumption event.

---

## Implementation Plan

### 1. Data Models

#### Inventory Item Schema
```typescript
interface InventoryItem {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  dateAdded: Date;
  expirationDate: Date | null;
  storageType: 'refrigerator' | 'freezer' | 'pantry';
}
```

#### Risk Assessment Schema
```typescript
interface ExpirationRisk {
  itemId: string;
  riskScore: number;          // 0-100 scale
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  daysUntilExpiry: number;
  consumptionPriority: number; // Final ranking position
  factors: RiskFactors;
  recommendedAction: string;
}

interface RiskFactors {
  baseShelfLife: number;
  categoryModifier: number;
  seasonalModifier: number;
  consumptionFrequency: number;
  storageCondition: number;
}
```

---

### 2. Risk Calculation Algorithm

#### Factor Weights
| Factor | Weight | Description |
|--------|--------|-------------|
| Days to Expiry | 40% | Primary factor based on expiration date |
| Category Risk | 25% | Inherent perishability of food type |
| Seasonal Modifier | 15% | Warm seasons increase spoilage risk |
| Consumption Frequency | 15% | Low-use items are higher risk |
| Storage Condition | 5% | Proper storage reduces risk |

#### Category Risk Rules (Dummy Dataset)
```javascript
const categoryRiskScores = {
  dairy: 0.85,
  meat: 0.90,
  seafood: 0.95,
  fruits: 0.70,
  vegetables: 0.65,
  bakery: 0.60,
  canned: 0.15,
  frozen: 0.20,
  condiments: 0.25,
  grains: 0.20
};
```

#### Seasonal Modifiers
```javascript
const seasonalModifiers = {
  summer: { fruits: 1.3, vegetables: 1.3, dairy: 1.2, meat: 1.4 },
  winter: { fruits: 0.9, vegetables: 0.9, dairy: 1.0, meat: 1.0 },
  spring: { fruits: 1.1, vegetables: 1.1, dairy: 1.1, meat: 1.1 },
  fall: { fruits: 1.0, vegetables: 1.0, dairy: 1.0, meat: 1.0 }
};
```

#### Risk Score Formula
```
riskScore = (
  (daysToExpiryScore * 0.40) +
  (categoryRisk * 0.25) +
  (seasonalModifier * 0.15) +
  (consumptionFrequencyScore * 0.15) +
  (storageConditionScore * 0.05)
) * 100
```

---

### 3. Prioritization Logic

#### Combined FIFO + AI Ranking
```javascript
function calculateConsumptionPriority(item, riskScore) {
  const fifoScore = calculateFIFOScore(item.dateAdded);
  const aiScore = riskScore;
  
  // 60% AI risk, 40% FIFO
  return (aiScore * 0.6) + (fifoScore * 0.4);
}
```

#### Risk Level Thresholds
| Score Range | Risk Level | Alert Type |
|-------------|------------|------------|
| 80-100 | Critical | Immediate push notification |
| 60-79 | High | Daily alert |
| 40-59 | Medium | Weekly summary |
| 0-39 | Low | No alert |

---

### 4. Alert System

#### Alert Types
- **Expired Item Alert**: Immediate warning when user consumes an expired item
- **Push Notifications**: Critical items expiring within 24-48 hours
- **In-App Banners**: High-risk items on dashboard
- **Daily Digest**: Summary of items needing attention
- **Smart Suggestions**: Recipe recommendations using at-risk items

#### Expired Item Consumption Alert
```typescript
interface ExpiredConsumptionAlert {
  itemId: string;
  itemName: string;
  expirationDate: Date;
  daysExpired: number;
  message: string;
  healthWarning: string;
}

// Example alert message:
// "⚠️ Warning: The milk you just logged expired 2 days ago. 
//  Please check for signs of spoilage before consuming."
```

#### Alert Schema
```typescript
interface ExpirationAlert {
  id: string;
  itemId: string;
  itemName: string;
  alertType: 'critical' | 'high' | 'medium';
  message: string;
  createdAt: Date;
  isRead: boolean;
  suggestedAction: string;
  relatedRecipes?: string[];
}
```

---

### 5. Consumption Logging & Risk Trigger

#### Consumption Log Schema
```typescript
interface ConsumptionLog {
  id: string;
  userId: string;
  itemId: string;
  quantityConsumed: number;
  unit: string;
  consumedAt: Date;
  wasExpired: boolean;
}
```

#### Consumption Service Logic
```javascript
async function logConsumption(userId, itemId, quantity) {
  // Step 1: Fetch the inventory item
  const item = await getInventoryItem(itemId);
  
  // Step 2: Check if item is expired
  const isExpired = item.expirationDate && new Date() > item.expirationDate;
  
  if (isExpired) {
    // Trigger expired item alert to user
    await createExpiredItemAlert(userId, item);
  }
  
  // Step 3: Reduce inventory quantity
  const newQuantity = item.quantity - quantity;
  await updateInventoryQuantity(itemId, newQuantity);
  
  // Step 4: Log the consumption event
  await saveConsumptionLog({
    userId,
    itemId,
    quantityConsumed: quantity,
    consumedAt: new Date(),
    wasExpired: isExpired
  });
  
  // Step 5: Update consumption frequency for this category
  await updateConsumptionFrequency(userId, item.category);
  
  // Step 6: TRIGGER RISK RECALCULATION for all remaining items
  const updatedRisks = await recalculateAllRisks(userId);
  
  // Step 7: Return updated data to display on UI
  return {
    consumptionLogged: true,
    expiredAlert: isExpired ? getExpiredAlertMessage(item) : null,
    updatedInventory: await getRemainingInventory(userId),
    riskAssessments: updatedRisks,
    priorityList: generatePriorityList(updatedRisks)
  };
}
```

---

### 6. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/consumption/log` | Log consumption → triggers risk recalculation |
| GET | `/api/inventory/risks` | Get all items with risk scores |
| GET | `/api/inventory/risks/:itemId` | Get risk details for specific item |
| GET | `/api/alerts/expiration` | Get active expiration alerts |
| POST | `/api/alerts/dismiss/:alertId` | Dismiss an alert |
| GET | `/api/inventory/priority-list` | Get consumption priority ranking |

#### POST `/api/consumption/log` Request/Response
```typescript
// Request Body
{
  "itemId": "inv_123",
  "quantity": 1,
  "unit": "cup"
}

// Response
{
  "success": true,
  "expiredAlert": {
    "isExpired": true,
    "message": "⚠️ This item expired 2 days ago!",
    "itemName": "Milk",
    "expirationDate": "2025-01-18"
  } | null,
  "updatedInventory": [...],
  "riskAssessments": [...],
  "priorityList": [...]
}
```

---

### 7. Tech Stack Requirements

#### Required
- **Backend**: Node.js/Express or Python/FastAPI
- **Database**: PostgreSQL or MongoDB (for inventory storage)

#### Optional Enhancements
- **LLM Integration**: OpenAI API for natural language alert messages
- **ML Model**: TensorFlow.js for advanced pattern-based predictions

> **Note:** No scheduler needed — risk calculation is triggered on each consumption event, not on a time-based schedule.

---

### 8. Implementation Steps

#### Phase 1: Core Logic (2-3 hours)
- [ ] Define data models and schemas
- [ ] Implement risk calculation function
- [ ] Create category and seasonal rule datasets
- [ ] Build prioritization algorithm

#### Phase 2: Consumption Logging (1-2 hours)
- [ ] Create consumption log endpoint
- [ ] Implement inventory reduction logic
- [ ] Add expired item detection and alert
- [ ] Wire risk recalculation to consumption trigger

#### Phase 3: API & Integration (1-2 hours)
- [ ] Create remaining REST endpoints
- [ ] Connect to existing inventory system
- [ ] Implement database queries for consumption history

#### Phase 4: UI Components (1-2 hours)
- [ ] Risk indicator badges on inventory items
- [ ] Priority consumption list view
- [ ] Alert notification panel (including expired item warnings)
- [ ] Dashboard widget for high-risk items
- [ ] Real-time UI update after consumption logged

---

### 8. Sample Output

#### Risk Assessment Response
```json
{
  "item": {
    "id": "inv_123",
    "name": "Milk",
    "category": "dairy",
    "expirationDate": "2025-01-20"
  },
  "risk": {
    "score": 78,
    "level": "high",
    "daysUntilExpiry": 3,
    "consumptionPriority": 2,
    "factors": {
      "baseShelfLife": 85,
      "categoryModifier": 85,
      "seasonalModifier": 72,
      "consumptionFrequency": 60,
      "storageCondition": 90
    }
  },
  "recommendation": "Use within 2 days. Consider making smoothies or baked goods."
}
```

---

### 9. Testing Checklist

- [ ] Risk scores calculate correctly for all categories
- [ ] Seasonal modifiers apply based on current date
- [ ] FIFO + AI ranking produces logical ordering
- [ ] Alerts trigger at correct thresholds
- [ ] **Consumption logging reduces inventory correctly**
- [ ] **Risk recalculation triggers after every consumption**
- [ ] **Expired item alert shows when consuming expired item**
- [ ] **UI updates in real-time after consumption**
- [ ] Edge cases: items without expiry dates, new items with no history

---

## Dependencies

```json
{
  "required": [
    "date-fns or moment.js (date calculations)",
    "database driver (pg or mongoose)"
  ],
  "optional": [
    "openai (for smart recommendations)",
    "web-push (for push notifications)"
  ]
}
```
