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
  signUp: async (parent, { username, email, password }, { models, pubsub }) => {
    if (password.length < 5)
      throw new Error('Password needs to be at least five characters')

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

      pubsub.publish('PERSON_ADDED', { personAdded: { username, avatar } })

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    } catch (err) {
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

    if (amount < 0) throw new ForbiddenError('Must use positive number')

    const account = await models.Account.findOne({ owner: user.id })

    const newBalance = account.balance + amount

    await account.updateOne({
      balance: newBalance,
    })

    return newBalance
  },
  buyStock: async (parent, { stock, amount }, { models, user }) => {
    // Check that the stock exists
    const stocks = await models.Stock.find({})

    const stockExists = stocks.find((item) => item.name === stock)

    if (!stockExists) throw new ForbiddenError('Stock does not exist')

    const account = await models.Account.findOne({ owner: user.id })

    const price = stockExists.startingPoint

    const sum = amount * price

    if (sum > account.balance) throw new ForbiddenError('Insufficient funds')

    const newAccountBalance = account.balance - sum

    await account.updateOne({ balance: newAccountBalance })

    // Check if user already owns the stock about to be purchased
    const stockOwned = account.stocks.find((item) => item.name === stock)

    if (!stockOwned) {
      const newStock = { name: stock, amount: amount }

      await account.updateOne({
        $push: { stocks: newStock },
      })

      // TODO: extend the newStock object, add balance
      return { name: stock, amount, balance: newAccountBalance }
    }

    const newAmount = stockOwned.amount + amount

    await models.Account.findOneAndUpdate(
      { owner: user.id, 'stocks._id': stockOwned._id },
      { $set: { 'stocks.$.amount': newAmount } }
    )

    return {
      name: stockOwned.name,
      amount: newAmount,
      balance: newAccountBalance,
    }
  },
  sellStock: async (parent, { stock, amount }, { models, user }) => {
    // Check that the stock exists
    const stocks = await models.Stock.find({})

    const stockExists = stocks.find((item) => item.name === stock)

    if (!stockExists) throw new ForbiddenError('Stock does not exist')

    const account = await models.Account.findOne({ owner: user.id })

    // Check if user already owns the stock about to be sold
    const stockOwned = account.stocks.find((item) => item.name === stock)

    if (!stockOwned) throw new ForbiddenError('Stock not owned')

    if (stockOwned.amount < amount) throw new ForbiddenError('Not enough stock')

    const price = stockExists.startingPoint

    const sum = amount * price

    const newAccountBalance = account.balance + sum

    await account.updateOne({ balance: newAccountBalance })

    const newAmount = stockOwned.amount - amount

    if (newAmount === 0) {
      const doc = await models.Account.findOne({ owner: user.id })
      doc.stocks.pull(stockOwned._id)
      await doc.save()

      return {
        name: stockOwned.name,
        amount: newAmount,
        balance: newAccountBalance,
      }
    }

    await models.Account.findOneAndUpdate(
      { owner: user.id, 'stocks._id': stockOwned._id },
      { $set: { 'stocks.$.amount': newAmount } }
    )

    return {
      name: stockOwned.name,
      amount: newAmount,
      balance: newAccountBalance,
    }
  },
}
