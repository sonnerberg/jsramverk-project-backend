const { gql } = require('apollo-server-express')

// TODO: Add depot/s to each user

module.exports = gql`
  type Query {
    user(username: String!): User
    users: [User!]!
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
  }
`
