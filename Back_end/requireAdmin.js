const { findAdminById } = require('./model/Admin_model');

// session-এর adminId এখনও DB-তে আছে কি না প্রতি request-এ দেখে
async function requireAdmin(req, res, next) {
  try {
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({ error: 'Admin authentication required.' });
    }

    const admin = await findAdminById(req.session.adminId);
    if (!admin) {
      delete req.session.adminId;
      return res.status(401).json({ error: 'Admin authentication required.' });
    }

    req.adminId = admin.id;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAdmin;