const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Access forbidden. Insufficient permissions.',
        requiredRole: roles,
        userRole: req.user.rol
      });
    }

    next();
  };
};

module.exports = checkRole;
