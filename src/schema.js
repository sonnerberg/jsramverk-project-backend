const { gql } = require('apollo-server-express')

module.exports = gql`
  scalar DateTime

  type Query {
    user(username: String!): User
    users: [User!]!
    me: User!
    balance: Float!
    myStocks: [OwnedStock!]!
    stocks: [Stock!]!
    priceNow: StockHistoryObject!
    stockHistory(limit: Int, name: String): [StockHistoryObject!]!
  }

  type StockHistoryObject {
    id: ID!
    history: [StockHistory!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type StockHistory {
    id: ID!
    name: String!
    value: Float!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
  }

  type Stock {
    id: ID!
    name: String!
    rate: Float!
    variance: Float!
    startingPoint: Float!
  }

  type OwnedStock {
    id: ID!
    name: String!
    amount: Float!
  }

  type OwnedStockAndBalance {
    id: ID!
    name: String!
    amount: Float!
    balance: Float!
  }

  type CurrentPriceStock {
    id: ID!
    name: String!
    value: Float!
    createdAt: DateTime!
  }

  type UsernameAvatar {
    username: String!
    avatar: String!
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    addFunds(amount: Int!): Float!
    buyStock(stock: String!, amount: Float!): OwnedStockAndBalance!
    sellStock(stock: String!, amount: Float!): OwnedStockAndBalance!
  }

  type Subscription {
    personAdded: UsernameAvatar!
    stocksUpdated: [Stock!]!
  }
`
