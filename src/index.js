require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')

const db = require('./db')
const models = require('./models')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const port = process.env.PORT || 8888
const DB_HOST = process.env.DB_HOST

const app = express()
db.connect(DB_HOST)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models }
  },
})

server.applyMiddleware({ app, path: '/api' })

app.get('/', (request, response) => {
  response.send('hello world!')
})

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
      .underline.green
  )
)
