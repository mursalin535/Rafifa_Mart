const { findCustomerById } = require('./model/Customer_model');

async function requireAuth(req, res, next) {
  try {
    if (!req.session || !req.session.customerId) {
      return res.status(401).json({ success: false, message: 'You must be logged in to do this.' });
    }

    const customer = await findCustomerById(req.session.customerId);
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Account not found. Please log in again.' });
    }
    if (customer.account_status !== 'active') {
      return res.status(403).json({ success: false, message: 'This account is not active.' });
    }

    req.customerId = customer.id;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAuth;