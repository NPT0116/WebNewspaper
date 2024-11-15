import passport, { use } from 'passport'
import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '~/models/userSchema.js'
import { IUser } from '~/interfaces/userInterface.js'
passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id)
})
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id)
    if (!user) throw new Error("can't find user in deserialize")

    return done(null, user)
  } catch (e) {
    done(e, null)
  }
})
export default passport.use(
  'local',
  new LocalStrategy({ usernameField: 'username' }, async (username: string, password: string, done) => {
    try {
      const user = await User.findOne({ username })
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username or password'
        })
      }
      const isMatched: boolean = await bcrypt.compare(password, user.password)
      if (isMatched) {
        return done(null, user)
      }
      return done(null, false, { message: 'Incorrect username or password' })
    } catch (e) {
      return done(e)
    }
  })
)
