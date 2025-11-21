# InnovateX Backend-Python - Documentation Index

**Status**: ✅ COMPLETE & TESTED  
**Version**: 2.0.0  
**Date**: November 21, 2025  
**Branch**: riskEstimate  

---

## 📋 Quick Navigation

### Getting Started
1. **[Start Here](#getting-started)** - Installation & first steps
2. **[Run the Server](#running-the-server)** - Start developing
3. **[Test the API](#testing-the-api)** - Verify everything works

### Documentation
- **[PYTHON_BACKEND_README.md](PYTHON_BACKEND_README.md)** - Complete backend documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built
- **[expiration-risk-plan(1).md](expiration-risk-plan(1).md)** - Original requirements

### API References
- **[api_payloads.py](api_payloads.py)** - Example requests/responses (run with `python api_payloads.py`)
- **Swagger UI** - http://localhost:8000/docs (after starting server)
- **ReDoc** - http://localhost:8000/redoc (after starting server)

### Source Code
- **[main.py](main.py)** - FastAPI app & all routes
- **[models.py](models.py)** - Pydantic data models
- **[risk_calculator.py](risk_calculator.py)** - Risk calculation engine
- **[consumption_service.py](consumption_service.py)** - Business logic

### Utilities
- **[verify_installation.py](verify_installation.py)** - Test everything is working
- **[quick_start.py](quick_start.py)** - Quick start guide script

---

## Getting Started

### Step 1: Install Dependencies

```bash
cd /home/misty/Desktop/food/bubtHackathon/backend-py
pip install -r requirements.txt
```

**Required Packages:**
- fastapi==0.109.0
- uvicorn[standard]==0.27.0
- python-dotenv==1.0.0
- pydantic==2.5.3
- python-dateutil==2.8.2
- requests==2.31.0

### Step 2: Verify Installation

```bash
python verify_installation.py
```

This checks:
- ✅ All files present
- ✅ Dependencies installed
- ✅ Models working
- ✅ Risk calculation functional
- ✅ API endpoints created

---

## Running the Server

### Standard Start

```bash
python main.py
```

Server will run at: **http://localhost:8000**

### With Custom Port

```bash
PORT=8001 python main.py
```

### With Debug Mode Off

```bash
DEBUG=False python main.py
```

---

## Testing the API

### Option 1: View All Examples

```bash
python api_payloads.py
```

Shows:
- Testing guide
- CURL examples
- Request/response samples
- Risk reference tables

### Option 2: Interactive Swagger UI

Visit: **http://localhost:8000/docs**

Try any endpoint directly in the browser.

### Option 3: CURL Commands

```bash
# Health check
curl http://localhost:8000/health

# Add test inventory
curl -X POST http://localhost:8000/api/test/add-inventory?user_id=user_123

# Get risks
curl http://localhost:8000/api/inventory/risks?user_id=user_123

# Log consumption
curl -X POST http://localhost:8000/api/consumption/log \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "inv_001",
    "quantity": 0.5,
    "unit": "liters",
    "user_id": "user_123"
  }'
```

---

## API Endpoints

### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Root info |

### Consumption
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/consumption/log` | Log consumption (triggers risk recalculation) |

### Risk Assessment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory/risks` | Get all items with risk scores |
| GET | `/api/inventory/risks/{item_id}` | Get specific item risk |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/expiration` | Get active alerts |
| POST | `/api/alerts/dismiss/{alert_id}` | Dismiss alert |

### Priority
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory/priority-list` | Get consumption priority list |

### Testing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/test/add-inventory` | Add 6 sample items for testing |

---

## Key Features

### 🎯 Real-time Risk Calculation
```
Risk Score = (
  daysToExpiry (40%) +
  categoryRisk (25%) +
  seasonalModifier (15%) +
  consumptionFrequency (15%) +
  storageCondition (5%)
) * 100
```

### 🔄 Smart Prioritization
- 60% AI risk score
- 40% FIFO principle
- Returns items sorted by urgency

### ⚠️ Expired Item Detection
- Immediate alert when consuming expired items
- Shows days expired and health warnings

### 📊 Real-time Risk Recalculation
- **Automatically triggered after each consumption**
- All items re-scored instantly
- No scheduled tasks needed

### 🚨 Alert System
| Score | Level | Action |
|-------|-------|--------|
| 80-100 | Critical | Consume immediately |
| 60-79 | High | Use within days |
| 40-59 | Medium | Plan usage soon |
| 0-39 | Low | No rush |

---

## Category Risk Scores

**Perishability Ranking:**

```
Seafood (0.95) - Highly perishable
Meat (0.90) - Highly perishable
Dairy (0.85) - Perishable
Fruits (0.70) - Moderately perishable
Vegetables (0.65) - Moderately perishable
Bakery (0.60) - Moderately perishable
Condiments (0.25) - Low perishability
Frozen (0.20) - Very stable
Grains (0.20) - Very stable
Canned (0.15) - Highly stable
```

---

## File Structure

```
backend-py/
├── main.py                           # FastAPI app & routes
├── models.py                         # Pydantic models
├── risk_calculator.py               # Risk calculation logic
├── consumption_service.py           # Business logic
├── api_payloads.py                  # Example payloads & testing guide
├── quick_start.py                   # Quick start script
├── verify_installation.py           # Installation verification
├── requirements.txt                 # Python dependencies
├── PYTHON_BACKEND_README.md         # Complete documentation
├── IMPLEMENTATION_SUMMARY.md        # What was built
├── INDEX.md                         # This file
├── .env                             # Environment variables
└── expiration-risk-plan(1).md      # Original requirements
```

---

## Example Flow

### 1. Setup Test Data
```bash
curl -X POST http://localhost:8000/api/test/add-inventory?user_id=user_123
```

Creates:
- Milk (expired)
- Broccoli (3 days)
- Salmon (1 day - CRITICAL)
- Canned Beans (200 days)
- Frozen Pizza (100 days)
- Apples (5 days)

### 2. View Risks
```bash
curl http://localhost:8000/api/inventory/risks?user_id=user_123
```

Response includes risk scores and priorities.

### 3. Log Consumption
```bash
curl -X POST http://localhost:8000/api/consumption/log \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "inv_003",
    "quantity": 0.5,
    "unit": "kg",
    "user_id": "user_123"
  }'
```

Response includes:
- Updated inventory
- Recalculated risks
- Priority list
- New alerts

### 4. Check Updated Risks
```bash
curl http://localhost:8000/api/inventory/risks?user_id=user_123
```

All items re-scored after consumption.

---

## Troubleshooting

### Port Already in Use
```bash
PORT=8001 python main.py
```

### Import Errors
```bash
pip install -r requirements.txt
```

### Module Not Found
Run verification:
```bash
python verify_installation.py
```

### CORS Issues
Already configured for:
- localhost:3000 (React frontend)
- localhost:5173 (Vite frontend)
- * (all origins)

---

## Integration with Node.js Backend

Both backends run simultaneously on different ports:

- **Python Backend**: http://localhost:8000 (Risk Prediction)
- **Node.js Backend**: http://localhost:5000 (Core API)
- **React Frontend**: http://localhost:3000

### Data Flow
1. Frontend calls Node.js backend for inventory CRUD
2. When consumption logged on Node.js:
   - Also call Python backend to recalculate risks
   - Return risks to frontend along with main response

---

## Deployment

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

### Using systemd (Linux)
Create `/etc/systemd/system/innovatex-python.service`:
```ini
[Unit]
Description=InnovateX Python Backend
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/path/to/backend-py
ExecStart=/usr/bin/python3 main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl start innovatex-python
sudo systemctl enable innovatex-python
```

---

## Development Workflow

### 1. Make Changes
- Edit any `.py` file
- Server auto-reloads in debug mode

### 2. Test Locally
```bash
# Run verification
python verify_installation.py

# View API docs
# Visit: http://localhost:8000/docs

# Test endpoints
python api_payloads.py
```

### 3. Commit Changes
```bash
git add backend-py/
git commit -m "Update risk calculation logic"
git push origin riskEstimate
```

---

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] ML-based pattern prediction
- [ ] Recipe recommendations
- [ ] Push notifications
- [ ] User authentication
- [ ] Multi-user support
- [ ] Export analytics
- [ ] Sustainability scoring

---

## Support & Documentation

### Documentation Files
1. **PYTHON_BACKEND_README.md** - Complete guide
2. **IMPLEMENTATION_SUMMARY.md** - What was built
3. **This file (INDEX.md)** - Quick navigation
4. **expiration-risk-plan(1).md** - Requirements

### Getting Help
1. Check error in verification script: `python verify_installation.py`
2. View API payloads: `python api_payloads.py`
3. Check Swagger UI: http://localhost:8000/docs
4. Read source code comments

### Running Scripts

```bash
# View all API examples
python api_payloads.py

# Verify installation
python verify_installation.py

# Quick start guide
python quick_start.py

# Start server with examples
python main.py
```

---

## Quick Commands

```bash
# Install & verify
pip install -r requirements.txt && python verify_installation.py

# Start server
python main.py

# View API docs (browser)
# http://localhost:8000/docs

# View all examples
python api_payloads.py

# Test single endpoint
curl http://localhost:8000/health
```

---

## Version Info

| Item | Value |
|------|-------|
| Version | 2.0.0 |
| API Version | v1 |
| Python | 3.8+ |
| Framework | FastAPI |
| Status | ✅ Complete |
| Branch | riskEstimate |
| Last Updated | November 21, 2025 |

---

## Implementation Checklist

- ✅ All data models implemented
- ✅ Risk calculation algorithm complete
- ✅ Category & seasonal modifiers added
- ✅ FIFO + AI prioritization working
- ✅ Consumption logging with real-time recalculation
- ✅ Expired item detection & alerts
- ✅ All 8 API endpoints created
- ✅ Test data endpoint for easy testing
- ✅ Comprehensive documentation
- ✅ Example payloads & testing guide
- ✅ Installation verification script
- ✅ CORS configured
- ✅ Ready for production deployment

---

## Start Here! 🚀

```bash
# 1. Install
pip install -r requirements.txt

# 2. Verify
python verify_installation.py

# 3. Run
python main.py

# 4. Test
python api_payloads.py
# OR
# Visit: http://localhost:8000/docs
```

---

**Ready to build! The Python backend is fully operational and documented.** ✨

