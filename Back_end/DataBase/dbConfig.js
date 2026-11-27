require('dotenv').config();

// pool আর session store দুটোই একই database-সেটিং ব্যবহার করে
const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'rafifa_mart',
};

// ক্লাউড database-এ সাধারণত SSL লাগে: DATABASE_SSL=true
// (নিজে-সই করা সার্টিফিকেট হলে DATABASE_SSL_STRICT=false)
if (process.env.DATABASE_SSL === 'true') {
  dbConfig.ssl = { rejectUnauthorized: process.env.DATABASE_SSL_STRICT !== 'false' };
}

module.exports = dbConfig;