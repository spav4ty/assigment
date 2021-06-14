import { gql } from '@apollo/client';


export const GET_ALL_USERS = gql`
query { 
  allUsers {
    id
    name
    email
    password
    isOnline
    lastLoginAt
    createdAt
    active
  }
}
`;

export const GET_AUTH_USER = gql`
  query {
    getAuthUser {
      id
      name
      email
      createdAt
      lastLoginAt
      isOnline
      }
    }
`;

export const SIGN_IN = gql`
    mutation SIGNIN($email: String!,$password: String! ){
      signin(email:$email, password: $password){
        token
      }
    }
`;

export const SIGN_UP = gql`
    mutation SIGNUP($userInput: UserInputData ){
      signup(userInput: $userInput){
        token
      }
    }
`;

export const LOG_OUT = gql`
  mutation LOG_OUT($userId: String!){
    logout(userId: $userId){
      boolean
    }
  }
`;

export const DELETE_USERS = gql`
  mutation DELETE_USERS($usersIds: [ID!]!){
    deleteUsers(usersIds: $usersIds){
      count
    }
  }
`;

export const BLOCK_USERS = gql`
  mutation BLOCK_USERS($usersIds: [ID!]!){
    blockUsers(usersIds: $usersIds){
      count
    }
  }
`;

export const UNBLOCK_USERS = gql`
  mutation UNBLOCK_USERS($usersIds: [ID!]!) {
    unBlockUsers(usersIds: $usersIds){
      count
    }
  }
  `;
