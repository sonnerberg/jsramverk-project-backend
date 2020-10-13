const mongoose = require('mongoose')

// TODO: Use [yoitsro/joigoose: Joi validation for your Mongoose models without the hassle of maintaining two schemas](https://github.com/yoitsro/joigoose)
// for validation

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', UserSchema)
module.exports = User
