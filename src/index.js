require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const { ApolloServer } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')

const db = require('./db')
const models = require('./models')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const port = process.env.PORT || 8888
const DB_HOST =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DB_HOST

const app = express()
app.use(helmet())
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization

    const user = getUser(token)

    return { models, user }
  },
})

server.applyMiddleware({ app, path: '/api' })

app.get('/', (request, response) => {
  response.send('hello world!')
})

const application = app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
      .underline.green
  )
)

module.exports = application
