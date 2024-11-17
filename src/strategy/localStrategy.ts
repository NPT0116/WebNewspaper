import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Account } from '~/models/Account/accountSchema.js';
import { IAccount } from '~/interfaces/Account/accountInterface.js';

// Serialize account ID into session
passport.serializeUser((account, done) => {
  done(null, (account as IAccount)._id);
});

// Deserialize account from ID in session
passport.deserializeUser(async (id: string, done) => {
  try {
    const account = await Account.findById(id);
    if (!account) {
      return done(new Error('Account not found during deserialization'), null);
    }
    return done(null, account);
  } catch (error) {
    return done(error, null);
  }
});

// Local Strategy for login with username and password
passport.use(
  new LocalStrategy(
    { usernameField: 'username' }, // Use "username" as the login field
    async (usernameOrEmail: string, password: string, done) => {
      try {
        // Find account by localAuth.username

        const existingAccount = await Account.findOne({ $or: [{ 'localAuth.username': usernameOrEmail }, { email: usernameOrEmail }] });

        // Check if the account exists
        if (!existingAccount || !existingAccount.localAuth) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        // Compare the entered password with the stored hashed password
        const isMatched = await bcrypt.compare(password, existingAccount.localAuth.password);
        if (!isMatched) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        // Password is correct, return the existingAccount
        return done(null, existingAccount);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
