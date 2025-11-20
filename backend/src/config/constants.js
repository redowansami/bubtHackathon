module.exports = {
  // HTTP Status Codes
  HTTP_OK: 200,
  HTTP_CREATED: 201,
  HTTP_BAD_REQUEST: 400,
  HTTP_UNAUTHORIZED: 401,
  HTTP_FORBIDDEN: 403,
  HTTP_NOT_FOUND: 404,
  HTTP_CONFLICT: 409,
  HTTP_SERVER_ERROR: 500,

  // Messages
  MESSAGES: {
    SUCCESS: 'Success',
    ERROR: 'Error',
    USER_CREATED: 'User registered successfully',
    USER_EXISTS: 'User already exists',
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized - Token missing or invalid',
    PROFILE_UPDATED: 'Profile updated successfully',
    PROFILE_FETCHED: 'Profile fetched successfully',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
  },

  // Dietary Preferences
  DIETARY_PREFERENCES: [
    'vegetarian',
    'vegan',
    'non-vegetarian',
    'low-carb',
    'gluten-free',
    'dairy-free',
    'no-preference',
  ],
};
