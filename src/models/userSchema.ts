import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from '~/interfaces/userInterface.js'

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true }
})

export default mongoose.model<IUser>('User', userSchema)
