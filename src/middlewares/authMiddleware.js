const { verifyToken } = require('../utils/jwtUtils');
const { MESSAGES, HTTP_UNAUTHORIZED } = require('../config/constants');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(HTTP_UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.UNAUTHORIZED,
    });
  }
};

module.exports = authMiddleware;
