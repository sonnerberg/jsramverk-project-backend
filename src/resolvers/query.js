const { models } = require('mongoose')

module.exports = {
  user: async (parent, { username }, { models }) => {
    return await models.User.findOne({ username })
  },
  users: async (parent, args, { models }) => {
    return await models.User.find({}).limit(100)
  },
  me: async (parent, args, { user }) => {
    return await models.User.findById(user.id)
  },
  balance: async (parent, args, { models, user }) => {
    const account = await models.Account.findOne({ owner: user.id })
    return account.balance
  },
}
