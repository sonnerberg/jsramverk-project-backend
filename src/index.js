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

const port = process.env.PORT || 8888
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

const princessTarta = {
  name: 'Princesstårta',
  rate: 1.002,
  variance: 0.6,
  startingPoint: 20,
}

const mandelKubb = {
  name: 'Mandel kubb',
  rate: 1.001,
  variance: 0.4,
  startingPoint: 20,
}

var cakes = [princessTarta, mandelKubb]

const interval = setInterval(function () {
  cakes.map((cake) => {
    cake['startingPoint'] = stock.getStockPrice(cake)
    return cake
  })

  pubsub.publish('STOCKS_UPDATED', { stocksUpdated: cakes })
}, 5000)

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
