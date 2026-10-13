import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'farmshare_ai_secure_jwt_token_key_2026_growth'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.'
        });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'This account is deactivated. Please contact support.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, session token failed or expired.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided.'
    });
  }
};

export const authorize = (...allowedAccountTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (
      allowedAccountTypes.includes(req.user.accountType) ||
      allowedAccountTypes.includes(req.user.role) ||
      req.user.role === 'admin'
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Route requires ${allowedAccountTypes.join(' or ')} account type.`
    });
  };
};
