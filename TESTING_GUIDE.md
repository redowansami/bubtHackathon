# Quick Test Guide - Resource Fetching Fix

## Step 1: Verify Backend is Running

```bash
curl http://localhost:5000/api/v1/health
# Should return: { "status": "API is running" }
```

## Step 2: Check Resources in Database

### Option A: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your MongoDB instance
3. Navigate to: `database_name > resources`
4. View all documents
5. **Ensure at least one resource has `isActive: true`**

### Option B: Using MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to your database
use innovatex  # or your database name

# Check resources
db.resources.find().pretty()

# Count total resources
db.resources.countDocuments()

# Count active resources
db.resources.countDocuments({ isActive: true })
```

## Step 3: Test Backend Endpoint Directly

```bash
# Get all resources
curl http://localhost:5000/api/v1/resources

# Filter by type
curl "http://localhost:5000/api/v1/resources/type/article"

# Filter by category
curl "http://localhost:5000/api/v1/resources/category/Vegetables"

# Search
curl "http://localhost:5000/api/v1/resources/search?query=storage"
```

### Expected Response Format:
```json
{
  "success": true,
  "message": "Resources retrieved",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "How to Store Vegetables",
      "description": "Learn the best practices for storing vegetables...",
      "category": "Vegetables",
      "type": "guide",
      "content": "...",
      "imageUrl": null,
      "isActive": true,
      "views": 0,
      "createdAt": "2025-11-21T10:30:00Z",
      "updatedAt": "2025-11-21T10:30:00Z"
    }
  ]
}
```

## Step 4: Restart Backend Server

```bash
cd /home/tashrif/Desktop/bubtHackathon/backend

# Kill existing process if running
# Then restart
npm run dev
```

**Output should show:**
```
🚀 Server running on port 5000
```

## Step 5: Restart Frontend Server

```bash
cd /home/tashrif/Desktop/bubtHackathon/frontend

# Kill existing process if running
# Then restart
npm start
```

## Step 6: Test Frontend

1. **Navigate to Resources Page:**
   - URL: `http://localhost:3000/resources`

2. **Open Browser Console:**
   - Press F12 or Right-click → Inspect → Console tab

3. **Check Logs:**
   - You should see: `Fetching resources from API...`
   - Then: `Resource response: { success: true, data: [...] }`

4. **Visual Check:**
   - Resources should display in a grid
   - Click on category/type filters - they should work
   - Search functionality should work

## Step 7: If Resources Don't Show

### Check Console for Errors:
- Look for red error messages
- Check the Network tab to see API response
- Verify API URL (should be `http://localhost:5000/api/v1`)

### Common Issues:

**Issue: 401 Unauthorized**
- Resources endpoint doesn't need authentication
- Check if `isActive: true` in database

**Issue: Empty array returned**
- Check if any resources exist: `db.resources.countDocuments()`
- Check if any are active: `db.resources.countDocuments({ isActive: true })`
- Create a test resource via Postman (see POSTMAN_RESOURCE_TEST.md)

**Issue: Network Error**
- Backend not running? Check if port 5000 is listening
- CORS issue? Check backend CORS configuration

**Issue: TypeError: Cannot read property 'map'**
- This was the original bug and should now be fixed
- If still appearing, check browser console for response format

## Step 8: Test Consumption Logs

1. **Create a consumption log:**
   - Go to `/logs` page
   - Click "Log Consumption"
   - Fill in form and submit

2. **Verify it shows:**
   - Log should appear in the list below
   - Should show date, category, quantity

## Creating Test Resources via Postman

**POST** to `http://localhost:5000/api/v1/resources`

```json
{
  "title": "Quick Storage Tips",
  "description": "Learn how to store your food items properly to keep them fresh and reduce waste",
  "category": "Storage",
  "type": "tip",
  "content": "Store vegetables in the crisper drawer...",
  "tags": ["storage", "food-preservation"],
  "imageUrl": "https://via.placeholder.com/400x300"
}
```

## Troubleshooting Checklist

- [ ] Backend running? `curl http://localhost:5000/api/v1/health`
- [ ] MongoDB connected? Check backend console for "Connected to MongoDB"
- [ ] Resources in DB? `db.resources.countDocuments()`
- [ ] Active resources? `db.resources.countDocuments({ isActive: true })`
- [ ] API returns array? Curl and check response format
- [ ] Frontend running? Check if `http://localhost:3000` is accessible
- [ ] Console logs showing? Open browser DevTools → Console
- [ ] No CORS errors? Check Network tab

## Success Indicators

✅ Resources page loads without errors
✅ Grid displays resources
✅ Filters work (type, category)
✅ Search functionality works
✅ Browser console shows resource data
✅ No red error messages in console
