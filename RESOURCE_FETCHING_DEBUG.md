# Resource Fetching - Debugging Guide

## Issue Identified

The **`getAllResources`** endpoint returns a paginated structure:
```json
{
  "resources": [...],
  "pagination": { "total": 5, "page": 1, "pages": 1 }
}
```

But the frontend expects just an array in `response.data`.

## Root Cause

In `ResourceService.js`:
```javascript
async getAllResources(page = 1, limit = 10) {
  const result = await ResourceRepository.findWithPagination(page, limit);
  return {
    success: true,
    message: 'Resources retrieved',
    statusCode: 200,
    data: result  // ❌ This is { resources, pagination }
  };
}
```

The `data` contains both `resources` and `pagination`, but the frontend expects just the array.

## Solution

### Option 1: Fix Backend (Recommended)
Update `ResourceService.js` to extract just the resources array:

```javascript
async getAllResources(page = 1, limit = 10) {
  const result = await ResourceRepository.findWithPagination(page, limit);
  return {
    success: true,
    message: 'Resources retrieved',
    statusCode: 200,
    data: result.resources  // ✅ Just the array
  };
}
```

### Option 2: Fix Frontend
Update `resourceService.js`:

```javascript
getAllResources: async () => {
  const response = await api.get('/resources');
  // Handle paginated response
  const data = response.data;
  if (data.data && data.data.resources) {
    data.data = data.data.resources; // Extract resources array
  }
  return data;
}
```

## Checklist

- [ ] Verify resources exist in MongoDB (`db.resources.find()`)
- [ ] Check if `isActive` field is `true` for your resources
- [ ] Test backend directly: `curl http://localhost:5000/api/v1/resources`
- [ ] Check browser console for error messages
- [ ] Verify `REACT_APP_API_URL` is set correctly (should default to http://localhost:5000/api/v1)

## MongoDB Query to Check Resources

```javascript
// Connect to MongoDB and run:
db.resources.find().pretty()

// Check if any exist:
db.resources.countDocuments()

// Check active status:
db.resources.find({ isActive: true }).count()
```

## Common Issues

1. **No resources showing**
   - Ensure resources have `isActive: true`
   - Check if database connection is working
   - Verify resources collection has documents

2. **Empty response**
   - Backend might be returning `{ resources: [] }`
   - Check if query parameters are passed correctly

3. **Network error**
   - Ensure backend is running on port 5000
   - Check CORS settings
   - Verify API URL in frontend config
