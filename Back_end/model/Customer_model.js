const connection = require('../DataBase/Database');
const rollbar = require('../rollbar');

async function findCustomerByEmail(email) {
  try {
    const [rows] = await connection.query('SELECT * FROM customers WHERE email = ?', [email]);
    return rows[0] || null;
  } catch (err) {
    rollbar.error('Error in findCustomerByEmail:', err);
    throw err;
  }
}

async function findCustomerByGoogleId(googleId) {
  try {
    const [rows] = await connection.query('SELECT * FROM customers WHERE google_id = ?', [googleId]);
    return rows[0] || null;
  } catch (err) {
    rollbar.error('Error in findCustomerByGoogleId:', err);
    throw err;
  }
}

async function findCustomerById(id) {
  try {
    const [rows] = await connection.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0] || null;
  } catch (err) {
    rollbar.error('Error in findCustomerById:', err);
    throw err;
  }
}

async function createCustomerWithPassword({ name, email, hashedPassword, phone }) {
  try {
    const [result] = await connection.query(
      `INSERT INTO customers (name, email, password, phone, account_status)
       VALUES (?, ?, ?, ?, 'active')`,
      [name, email, hashedPassword, phone || null]
    );
    return findCustomerById(result.insertId);
  } catch (err) {
    rollbar.error('Error in createCustomerWithPassword:', err);
    throw err;
  }
}

// --- নতুন: Google দিয়ে নতুন customer তৈরি করার জন্য ---
async function createCustomerWithGoogle({ name, email, googleId, profilePic }) {
  try {
    const [result] = await connection.query(
      `INSERT INTO customers (name, email, google_id, profile_pic, account_status)
       VALUES (?, ?, ?, ?, 'active')`,
      [name, email, googleId, profilePic || null]
    );
    return findCustomerById(result.insertId);
  } catch (err) {
    rollbar.error('Error in createCustomerWithGoogle:', err);
    throw err;
  }
}

// --- নতুন: আগে থেকে email/password দিয়ে account থাকলে, তার সাথে google_id যুক্ত করার জন্য ---
async function linkGoogleIdToCustomer(customerId, googleId, profilePic) {
  try {
    await connection.query(
      'UPDATE customers SET google_id = ?, profile_pic = COALESCE(profile_pic, ?) WHERE id = ?',
      [googleId, profilePic, customerId]
    );
    return findCustomerById(customerId);
  } catch (err) {
    rollbar.error('Error in linkGoogleIdToCustomer:', err);
    throw err;
  }
}

async function findAllCustomers() {
  try {
    const [rows] = await connection.query(`
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.account_status,
        c.created_at,
        c.google_id,
        c.profile_pic,
        IFNULL(SUM(o.total_amount), 0) AS total_spent,
        COUNT(o.id) AS order_count
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id AND o.status != 'rejected'
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    return rows;
  } catch (err) {
    rollbar.error('Error in findAllCustomers:', err);
    throw err;
  }
}

async function updateCustomerPhone(id, phone) {
  try {
    await connection.query('UPDATE customers SET phone = ? WHERE id = ?', [phone, id]);
    return findCustomerById(id);
  } catch (err) {
    rollbar.error('Error in updateCustomerPhone:', err);
    throw err;
  }
}

module.exports = {
  findCustomerByEmail,
  findCustomerByGoogleId,
  findCustomerById,
  createCustomerWithPassword,
  createCustomerWithGoogle,
  linkGoogleIdToCustomer,
  findAllCustomers,
  updateCustomerPhone,
};