const {  gql } = require('apollo-server-express');

 const typeDefs= gql`
    type Query {
        allUsers: [UserPayload]
        getAuthUser: UserPayload
    }

    type UserPayload {
      id: ID!
      name: String
      email: String
      password: String
      isOnline: Boolean
      lastLoginAt: String
      createdAt: String
      active: Boolean
    }

    
    type Mutation {
        signin(email: String!, password: String!): AuthData!
        signup(userInput: UserInputData): AuthData!
        logout(userId: String!): LogOutData!
        deleteUsers(usersIds: [ID!]!): BatchPayload!
        blockUsers(usersIds: [ID!]!): BatchPayload!
        unBlockUsers(usersIds: [ID!]!): BatchPayload!
    }

    type LogOutData {
        boolean: Boolean!
    }

    type BatchPayload {
        count: Int!
    }

    type AuthData {
        token: String!
    }

    type IsUserOnlinePayload {
        userId: ID!
        isOnline: Boolean
    }

    input UserInputData {
        email: String!
        name: String
        password: String!
    }

    type Subscription {
    isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload
  }
`;

module.exports = typeDefs;