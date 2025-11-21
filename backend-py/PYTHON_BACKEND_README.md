# InnovateX Python Backend - Expiration Risk Prediction System

## Overview

This is the AI-powered expiration risk prediction system for InnovateX. It predicts food expiration risks, prioritizes items for consumption, and generates smart alerts based on multiple factors.

## Features

✅ **Real-time Risk Calculation**
- 40% Days to expiry
- 25% Category inherent perishability
- 15% Seasonal modifiers
- 15% Consumption frequency
- 5% Storage conditions

✅ **Smart Prioritization**
- Combines AI risk scores (60%) + FIFO principle (40%)
- Returns items sorted by consumption urgency

✅ **Expired Item Detection**
- Immediate alerts when consuming expired items
- Shows days expired and health warnings

✅ **Real-time Risk Recalculation**
- Triggered automatically after each consumption event
- All remaining items re-scored instantly

✅ **Alert System**
- Critical (80-100): Immediate push notification
- High (60-79): Daily alert
- Medium (40-59): Weekly summary
- Low (0-39): Monitor

## Installation

### 1. Install Dependencies

```bash
cd backend-py
pip install -r requirements.txt
```

### 2. Create .env File

```bash
touch .env
```

Add the following (optional):
```
PORT=8000
DEBUG=True
```

### 3. Run the Server

```bash
python main.py
```

The server will start at: **http://localhost:8000**

## API Documentation

### Interactive API Docs (Swagger UI)
```
http://localhost:8000/docs
```

### ReDoc
```
http://localhost:8000/redoc
```

## Quick Start

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Add Test Inventory
```bash
curl -X POST http://localhost:8000/api/test/add-inventory?user_id=user_123
```

This creates sample items:
- Milk (EXPIRED - 1 day ago)
- Broccoli (expires in 3 days)
- Salmon (expires in 1 day - CRITICAL)
- Canned Beans (expires in 200 days)
- Frozen Pizza (expires in 100 days)
- Apples (expires in 5 days)

### 3. Get Risk Assessment
```bash
curl http://localhost:8000/api/inventory/risks?user_id=user_123
```

Response shows all items with risk scores, levels, and recommendations.

### 4. Log Consumption
```bash
curl -X POST http://localhost:8000/api/consumption/log \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "inv_001",
    "quantity": 0.5,
    "unit": "liters",
    "user_id": "user_123"
  }'
```

Response includes:
- Expired item alert (if applicable)
- Updated inventory
- Recalculated risks for all items
- Priority consumption list

### 5. Get Priority List
```bash
curl http://localhost:8000/api/inventory/priority-list?user_id=user_123
```

Returns top 10 items that should be consumed first.

### 6. Get Alerts
```bash
curl http://localhost:8000/api/alerts/expiration?user_id=user_123
```

### 7. Dismiss Alert
```bash
curl -X POST http://localhost:8000/api/alerts/dismiss/alert_001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Root info |
| POST | `/api/consumption/log` | Log consumption → triggers risk recalculation |
| GET | `/api/inventory/risks` | Get all items with risk scores |
| GET | `/api/inventory/risks/:item_id` | Get risk for specific item |
| GET | `/api/alerts/expiration` | Get active expiration alerts |
| POST | `/api/alerts/dismiss/:alert_id` | Dismiss an alert |
| GET | `/api/inventory/priority-list` | Get consumption priority ranking |
| POST | `/api/test/add-inventory` | Add sample inventory (for testing) |

## File Structure

```
backend-py/
├── main.py                  # FastAPI app & routes
├── models.py               # Pydantic models & schemas
├── risk_calculator.py      # Risk calculation logic
├── consumption_service.py  # Consumption logging & alerts
├── api_payloads.py        # Example payloads & testing guide
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── README.md              # This file
```

## Risk Calculation Formula

```
riskScore = (
  (daysToExpiryScore * 0.40) +
  (categoryRisk * 0.25) +
  (seasonalModifier * 0.15) +
  (consumptionFrequencyScore * 0.15) +
  (storageConditionScore * 0.05)
) * 100
```

## Category Risk Scores (Perishability)

| Category | Score | |
|----------|-------|------|
| Seafood | 0.95 | Highly perishable |
| Meat | 0.90 | Highly perishable |
| Dairy | 0.85 | Perishable |
| Fruits | 0.70 | Moderately perishable |
| Vegetables | 0.65 | Moderately perishable |
| Bakery | 0.60 | Moderately perishable |
| Condiments | 0.25 | Low perishability |
| Frozen | 0.20 | Very stable |
| Grains | 0.20 | Very stable |
| Canned | 0.15 | Highly stable |

## Seasonal Modifiers

Modifiers applied based on current season and category:

**Summer**: Increased spoilage risk
- Fruits & Vegetables: 1.3x
- Dairy: 1.2x
- Meat: 1.4x
- Seafood: 1.5x

**Winter**: Reduced spoilage risk
- Fruits & Vegetables: 0.9x
- Dairy & Meat: 1.0x

## Testing the API

### View All Payloads
```bash
python api_payloads.py
```

This displays:
- Testing guide
- Sample requests/responses
- CURL examples
- Risk reference tables

### Manual Testing with cURL

See the Quick Start section above or run `python api_payloads.py` for more examples.

## Consumption Logging Flow

```
1. User logs consumption
   ↓
2. System checks if item is expired
   ├─ If expired: Create expired item alert
   ↓
3. Reduce inventory quantity
   ├─ If quantity reaches 0: Mark item as depleted
   ↓
4. Create consumption log entry
   ↓
5. Update consumption frequency for category
   ↓
6. TRIGGER: Recalculate risk for ALL remaining items
   ↓
7. Create/update high-risk alerts
   ↓
8. Return comprehensive response with:
   - Expired alert (if applicable)
   - Updated inventory
   - Recalculated risks
   - Priority list
```

## Risk Levels

| Level | Score | Meaning | Action |
|-------|-------|---------|--------|
| Critical | 80-100 | Expires very soon | Consume immediately |
| High | 60-79 | Expires soon | Use within days |
| Medium | 40-59 | Expires moderately soon | Plan usage |
| Low | 0-39 | Plenty of time | No rush |

## Database Integration (Future)

Currently uses in-memory storage. To integrate with a database:

1. Update `consumption_service.py`:
   - Replace `inventory_store` dict with database queries
   - Replace `alerts_store` list with database inserts
   - Replace `consumption_logs_store` with database saves

2. Update `risk_calculator.py`:
   - Load consumption history from database
   - Calculate frequency from historical consumption logs

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### Using Docker
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | Server port |
| `DEBUG` | True | Debug mode |

## Troubleshooting

### Port already in use
```bash
# Use different port
PORT=8001 python main.py
```

### Import errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### CORS errors
Already configured for localhost:3000, localhost:5173, and all origins (`*`)

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] ML-based consumption pattern prediction
- [ ] Recipe recommendations using at-risk items
- [ ] Push notifications
- [ ] User authentication
- [ ] Multi-user support
- [ ] Export consumption history
- [ ] Sustainability scoring

## API Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 404 | Not found |
| 500 | Server error |

## Example: Full Consumption Flow

```bash
# 1. Add test inventory
curl -X POST http://localhost:8000/api/test/add-inventory?user_id=user_123

# 2. Check risks
curl http://localhost:8000/api/inventory/risks?user_id=user_123

# 3. Get priority list
curl http://localhost:8000/api/inventory/priority-list?user_id=user_123

# 4. Log consumption of Salmon (critical item)
curl -X POST http://localhost:8000/api/consumption/log \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "inv_003",
    "quantity": 0.5,
    "unit": "kg",
    "user_id": "user_123"
  }'

# 5. Check updated risks (recalculated automatically)
curl http://localhost:8000/api/inventory/risks?user_id=user_123

# 6. Check for new alerts
curl http://localhost:8000/api/alerts/expiration?user_id=user_123
```

## Support & Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Payloads Guide**: Run `python api_payloads.py`
- **Plan Document**: See `expiration-risk-plan(1).md`

---

**Version**: 2.0.0  
**Last Updated**: November 21, 2025  
**Python Version**: 3.8+
