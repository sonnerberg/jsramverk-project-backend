// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  AuthenticationError /* ForbiddenError */,
} = require('apollo-server-express')
require('dotenv').config()

const gravatar = require('../util/gravatar')

module.exports = {
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase()

    const saltRounds = 10

    const hashed = await bcrypt.hash(password, saltRounds)

    const avatar = gravatar(email)

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      })

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    } catch (err) {
      console.log(err)

      throw new Error('Error creating account')
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) email = email.trim().toLowerCase()

    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    })

    if (!user) throw new AuthenticationError('Error signing in')

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) throw new AuthenticationError('Error signing in')

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET)
  },
}
