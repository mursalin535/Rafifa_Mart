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
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      const profilePic = profile.photos?.[0]?.value;

      // ১. প্রথমে দেখি এই google_id দিয়ে আগে থেকে কোনো customer আছে কিনা
      let customer = await findCustomerByGoogleId(googleId);
      if (customer) {
        return done(null, customer); // আগে থেকেই Google দিয়ে login করা account
      }

      // ২. না থাকলে, দেখি এই email দিয়ে কোনো customer আছে কিনা
      // (হয়তো আগে email/password দিয়ে signup করেছিল)
      customer = await findCustomerByEmail(email);
      if (customer) {
        // থাকলে, তার account-এর সাথে google_id যুক্ত করে দিই
        const updatedCustomer = await linkGoogleIdToCustomer(customer.id, googleId, profilePic);
        return done(null, updatedCustomer);
      }

      // ৩. কোনোটাই না থাকলে, একদম নতুন customer তৈরি করি
      const newCustomer = await createCustomerWithGoogle({ name, email, googleId, profilePic });
      return done(null, newCustomer);

    } catch (err) {
      return done(err, null);
    }
  }
));

// session-এ কী রাখা হবে (শুধু customer-এর id, পুরো object না)
passport.serializeUser((customer, done) => {
  done(null, customer.id);
});

// session থেকে id পড়ে, পুরো customer-কে database থেকে ফিরিয়ে আনা
passport.deserializeUser(async (id, done) => {
  try {
    const customer = await findCustomerById(id);
    done(null, customer);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;