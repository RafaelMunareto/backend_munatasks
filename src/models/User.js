const bcrypt = require('bcryptjs/dist/bcrypt');
const mongo = require('mongoose');

const UserSchema = new mongo.Schema(
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
  if (data == this.password) {
    return this.password;
  }
  return bcrypt.compare(data, this.password);
};

module.exports = mongo.model('User', UserSchema);
