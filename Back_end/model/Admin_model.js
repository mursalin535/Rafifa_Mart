const connection = require('../DataBase/Database');
const rollbar = require('../rollbar');

async function findAdminByEmail(email) {
  try {
    const [rows] = await connection.query('SELECT * FROM admin_info WHERE admin_email = ?', [email]);
    return rows[0] || null;
  } catch (err) {
    rollbar.error('Error in findAdminByEmail:', err);
    throw err;
  }
}

async function findAdminById(id) {
  try {
    const [rows] = await connection.query('SELECT id, admin_email FROM admin_info WHERE id = ?', [id]);
    return rows[0] || null;
  } catch (err) {
    rollbar.error('Error in findAdminById:', err);
    throw err;
  }
}

async function findAllAdmins() {
  try {
    const [rows] = await connection.query('SELECT id, admin_email, created_at FROM admin_info ORDER BY created_at DESC');
    return rows;
  } catch (err) {
    rollbar.error('Error in findAllAdmins:', err);
    throw err;
  }
}

async function updateAdminPassword(id, hashedPassword) {
  try {
    await connection.query('UPDATE admin_info SET password = ? WHERE id = ?', [hashedPassword, id]);
    return true;
  } catch (err) {
    rollbar.error('Error in updateAdminPassword:', err);
    throw err;
  }
}

async function deleteAdminById(id) {
  try {
    await connection.query('DELETE FROM admin_info WHERE id = ?', [id]);
    return true;
  } catch (err) {
    rollbar.error('Error in deleteAdminById:', err);
    throw err;
  }
}

async function createAdmin(email, hashedPassword) {
  try {
    const [result] = await connection.query(
      'INSERT INTO admin_info (admin_email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    return { id: result.insertId, admin_email: email };
  } catch (err) {
    rollbar.error('Error in createAdmin:', err);
    throw err;
  }
}

module.exports = {
  findAdminByEmail,
  findAdminById,
  findAllAdmins,
  updateAdminPassword,
  deleteAdminById,
  createAdmin,
};
