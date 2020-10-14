const mongoose = require('mongoose')
const joigoose = require('joigoose')(mongoose)
const Joi = require('joi')

const joiUserSchema = Joi.object({
  username: Joi.string()
    .min(5)
    .required()
    .trim()
    .meta({ _mongoose: { index: { unique: true } } }),
  email: Joi.string()
    .email()
    .trim()
    .required()
    .meta({ _mongoose: { index: { unique: true } } }),
  password: Joi.string().required(),
  avatar: Joi.string(),
})

const UserSchema = new mongoose.Schema(joigoose.convert(joiUserSchema), {
  timestamps: true,
})

const User = mongoose.model('User', UserSchema)
module.exports = User
