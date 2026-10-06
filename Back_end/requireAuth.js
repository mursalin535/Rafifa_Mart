function requireAuth(req, res, next) {
  if (!req.session.customerId) {
    return res.status(401).json({ error: 'You must be logged in to do this.' });
  }
  next();
}

module.exports = requireAuth;