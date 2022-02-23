import bcrypt from 'bcryptjs/dist/bcrypt';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: String,
    name: String,
    password: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
UserSchema.virtual('password_hash').get(function (password) {
  this._password = password;
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 8);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

export default model('User', UserSchema);
