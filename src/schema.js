const { gql } = require('apollo-server-express')

module.exports = gql`
  scalar DateTime

  type Query {
    user(username: String!): User
    users: [User!]!
    me: User!
    balance: Int!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    addFunds(amount: Int!): Int!
  }
`
