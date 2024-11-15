import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import Account from "~/models/accountSchema.js";
import { ILocalAccount } from "~/interfaces/Account/accountInterface.js"; // Giả sử bạn có interface cho Account

// Serialize account ID vào session
passport.serializeUser((account, done) => {
  done(null, (account as ILocalAccount)._id);
});

// Deserialize account từ ID trong session
passport.deserializeUser(async (id: string, done) => {
  try {
    const account = await Account.findById(id);
    if (!account) {
      return done(new Error("Account not found during deserialization"), null);
    }
    return done(null, account);
  } catch (error) {
    return done(error, null);
  }
});

// Local Strategy cho đăng nhập với username và password
passport.use(
  new LocalStrategy(
    { usernameField: "username" }, // Sử dụng "username" làm field cho tên đăng nhập
    async (username: string, password: string, done) => {
      try {
        // Tìm account theo username
        const account = (await Account.findOne({
          username,
        })) as ILocalAccount | null;

        if (!account) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        // So sánh password đã nhập với password đã lưu (hashed)
        const isMatched = await bcrypt.compare(password, account.password);
        if (!isMatched) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        // Password đúng, trả về account
        return done(null, account);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
