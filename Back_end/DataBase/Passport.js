const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const {
  findCustomerByGoogleId,
  findCustomerByEmail,
  createCustomerWithGoogle,
  linkGoogleIdToCustomer,
  findCustomerById,
} = require('../model/Customer_model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const emailEntry = profile.emails?.[0];
      const email = emailEntry?.value ? String(emailEntry.value).trim().toLowerCase() : null;
      const name = profile.displayName;
      const profilePic = profile.photos?.[0]?.value;

      // Google নিজে email যাচাই করেছে কি না
      const emailVerified =
        emailEntry?.verified === true ||
        profile._json?.email_verified === true ||
        profile._json?.email_verified === 'true';

      // ১. এই google_id দিয়ে আগে থেকে account থাকলে সরাসরি login
      let customer = await findCustomerByGoogleId(googleId);
      if (customer) {
        return done(null, customer);
      }

      // email না থাকলে বা Google যাচাই না করলে নতুন account বা link কিছুই হবে না
      if (!email || !emailVerified) {
        return done(null, false);
      }

      // ২. এই email-এ account থাকলে (যেমন আগে email/password দিয়ে খোলা), google_id জুড়ে দিই
      customer = await findCustomerByEmail(email);
      if (customer) {
        // এই account-এ অন্য Google ID আগেই জোড়া থাকলে overwrite করা যাবে না
        if (customer.google_id && customer.google_id !== googleId) {
          return done(null, false);
        }
        const updatedCustomer = await linkGoogleIdToCustomer(customer.id, googleId, profilePic);
        return done(null, updatedCustomer);
      }

      // ৩. কোনোটাই না থাকলে নতুন customer
      const newCustomer = await createCustomerWithGoogle({ name, email, googleId, profilePic });
      return done(null, newCustomer);

    } catch (err) {
      return done(err, null);
    }
  }
));

// session-এ কী রাখা হবে (শুধু customer-এর id)
passport.serializeUser((customer, done) => {
  done(null, customer.id);
});

// session থেকে id পড়ে customer ফিরিয়ে আনা
passport.deserializeUser(async (id, done) => {
  try {
    const customer = await findCustomerById(id);
    done(null, customer);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;