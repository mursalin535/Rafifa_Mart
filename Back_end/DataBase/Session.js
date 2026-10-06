const session = require('express-session');
const MySQLStoreFactory = require('express-mysql-session');
require('dotenv').config();

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'rafifa_mart',
});

const sessionMiddleware = session({
  key: 'rafifa_session',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});

module.exports = sessionMiddleware;