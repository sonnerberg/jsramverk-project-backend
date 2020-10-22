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
  myStocks: async (parent, args, { models, user }) => {
    const account = await models.Account.findOne({ owner: user.id })
    return account.stocks
  },
  stocks: async (parent, args, { models }) => {
    return await models.Stock.find({})
  },
  priceNow: async (parent, args, { models }) => {
    const stockHistory = await models.StockHistory.findOne().sort({
      field: 'asc',
      _id: -1,
    })

    return stockHistory
  },
  stockHistory: async (parent, { limit = 0, name }, { models }) => {
    const stockHistory = await models.StockHistory.find().limit(limit).sort({
      field: 'asc',
      _id: -1,
    })

    if (!name) return stockHistory

    return stockHistory.map((stock) => ({
      id: stock.id,
      updatedAt: stock.updatedAt,
      createdAt: stock.createdAt,
      history: stock.history.filter((history) => history.name === name),
    }))
  },
}
