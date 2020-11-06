require('dotenv').config()
const http = require('http')
const express = require('express')
// const helmet = require('helmet')
const { ApolloServer, PubSub } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')

const db = require('./db')
const models = require('./models')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const pubsub = new PubSub()

const stock = require('./util/stock')

const port = process.env.BACKEND_PORT || 8888
const DB_HOST =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DB_HOST

const app = express()
// app.use(helmet())
// TODO: limit requests to certain origins using cors
app.use(cors())
db.connect(DB_HOST)

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('Session invalid')
    }
  }
}

const intervalLength = process.env.NODE_ENV === 'test' ? 100 : 5000

const interval = setInterval(async () => {
  const cakes = await models.Stock.find({})
  cakes.map((cake) => {
    cake['startingPoint'] = stock.getStockPrice(cake)
    return cake
  })
  for (const cake of cakes) {
    await models.Stock.updateOne(
      { _id: cake._id },
      { startingPoint: cake.startingPoint }
    )
  }
  const history = cakes.map((cake) => {
    return { name: cake.name, value: cake.startingPoint }
  })
  await models.StockHistory.create({ history: history })

  pubsub.publish('STOCKS_UPDATED', { stocksUpdated: cakes })
}, intervalLength)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) return { pubsub }

    const token = req.headers.authorization

    const user = getUser(token)

    return { models, user, pubsub }
  },
  subscriptions: { path: '/subscription' },
})

server.applyMiddleware({ app, path: '/api' })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const application = httpServer.listen(port, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`.underline
      .green
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
      .underline.green
  )
})

module.exports = { application, interval }
