import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import Account from '~/models/accountSchema.js';
import { IAccount } from '~/interfaces/Account/accountInterface.js';
import Profile from '~/models/profileSchema.js';
import mongoose from 'mongoose';
import { Profile as githubProfile } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import dotenv from 'dotenv';

dotenv.config();
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

// GitHub Strategy for login
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:3001/account/github/login/callback',
      scope: ['user:email']
    },
    async (accessToken: string, refreshToken: string, profile: githubProfile, done: VerifyCallback) => {
      try {
        let account = await Account.findOne({ 'githubAuth.githubId': profile.id });

        if (!account) {
          account = new Account({
            email: profile.emails ? profile.emails[0].value : '',
            role: 'reader',
            isSubscriber: false,
            githubAuth: { githubId: profile.id },
            profileType: 'readerProfile',
            profileId: null
          });
          const savedAccount = await account.save();
          const newProfile = new Profile({
            name: profile.username || 'Unnamed User',
            accountId: savedAccount._id
          });
          const savedProfile = await newProfile.save();
          savedAccount.profileId = savedProfile._id as mongoose.Types.ObjectId;
        }

        return done(null, account);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
