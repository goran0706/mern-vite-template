import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    trim: true,
    unique: [true, 'Email already exists'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: [true, 'Email is required'],
  },
  hashed_password: {
    type: String,
    required: [true, 'Password is required'],
  },
  salt: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
});

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
}, null);

UserSchema.methods = {
  async authenticate(plainText) {
    return await bcrypt.compare(plainText, this.hashed_password);
  },

  encryptPassword(password) {
    if (!password) return '';
    try {
      return bcrypt.hashSync(password, 10);
    } catch (err) {
      return '';
    }
  },

  makeSalt() {
    return bcrypt.genSaltSync(10);
  },
};

const User = mongoose.model('User', UserSchema);

export default User;
