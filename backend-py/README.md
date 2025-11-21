# InnovateX FastAPI Backend

Simple FastAPI server for the InnovateX AI-Powered Food Management & Sustainability Platform.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python main.py
```

Or use uvicorn directly:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Access the Server

- **API Root**: http://localhost:8000/
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file (already included):

```
PORT=8000
DEBUG=True
```

## Project Structure

```
backend-py/
├── main.py           # FastAPI application entry point
├── requirements.txt  # Python dependencies
├── .env             # Environment variables
└── README.md        # This file
```

## Features

- ✅ Simple health check endpoint
- ✅ CORS enabled for frontend
- ✅ Auto-reloading in development mode
- ✅ Interactive API documentation (Swagger UI)
- ✅ ReDoc documentation

## Next Steps

Features will be added incrementally as needed for:
- Authentication
- Inventory Management
- Consumption Logging
- Resource Library
- Dashboard Analytics
- File Uploads

---

**Status**: ✅ Basic initialization complete
**Version**: 1.0.0
