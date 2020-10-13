// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  AuthenticationError /* ForbiddenError */,
  ForbiddenError,
} = require('apollo-server-express')
require('dotenv').config()

const gravatar = require('../util/gravatar')
const mongoose = require('mongoose')

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

      await models.Account.create({
        owner: mongoose.Types.ObjectId(user._id),
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
  addFunds: async (parent, { amount }, { models, user }) => {
    // TODO: Convert to transaction (if multiple additions of funds)

    if (!user) throw new AuthenticationError('Error signing in')

    if (amount > 0) {
      const account = await models.Account.findOne({ owner: user.id })

      const newBalance = account.balance + amount

      await account.updateOne({
        balance: newBalance,
      })

      return newBalance
    }
    throw new ForbiddenError('Must use positive number')
  },
}
