const requireAuth = require('./requireAuth');
const { findAdminById } = require('./model/Admin_model');

// admin session DB-তে এখনও বৈধ হলে req.isAdmin = true; নইলে login করা active customer লাগবে
async function requireCustomerOrAdmin(req, res, next) {
  try {
    if (req.session && req.session.adminId) {
      const admin = await findAdminById(req.session.adminId);
      if (admin) {
        req.isAdmin = true;
        req.adminId = admin.id;
        return next();
      }
      delete req.session.adminId;
    }
    return requireAuth(req, res, next);
  } catch (err) {
    next(err);
  }
}

module.exports = requireCustomerOrAdmin;