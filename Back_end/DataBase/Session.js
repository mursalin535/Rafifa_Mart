const session = require('express-session');
const MySQLStoreFactory = require('express-mysql-session');
const dbConfig = require('./dbConfig');
require('dotenv').config();

const MySQLStore = MySQLStoreFactory(session);

const isProd = process.env.NODE_ENV === 'production';

const sessionStore = new MySQLStore(dbConfig);

// Cookie-র সেটিং env থেকে (ডিফল্ট: আগের মতোই)
//   COOKIE_SAMESITE = lax (ডিফল্ট) | none | strict
//     - frontend আর backend একই মূল ডোমেইনে (shop.x.com + api.x.com) বা একই ডোমেইনে হলে: lax
//     - একদম আলাদা ডোমেইনে হলে: none (তখন secure আপনাআপনি true হয়)
//   COOKIE_SECURE = true | false (ডিফল্ট: production-এ true, না হলে false)
//   COOKIE_DOMAIN = (ঐচ্ছিক) যেমন .client.com
const allowedSameSite = ['lax', 'none', 'strict'];
const requestedSameSite = String(process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
const sameSite = allowedSameSite.includes(requestedSameSite) ? requestedSameSite : 'lax';

let secure = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === 'true'
  : isProd;
if (sameSite === 'none') secure = true; // browser-এর নিয়ম: SameSite=None হলে Secure লাগবেই

const cookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
if (process.env.COOKIE_DOMAIN) cookieOptions.domain = process.env.COOKIE_DOMAIN;

const sessionMiddleware = session({
  key: 'rafifa_session',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: cookieOptions,
});

module.exports = sessionMiddleware;