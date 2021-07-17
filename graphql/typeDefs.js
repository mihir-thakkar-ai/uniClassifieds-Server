const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    university: String!
    profilePicture: String
    token: String!
    username: String!
    createdAt: String!
    email: String!
  }
  type interestedUser {
    id: ID!
    createdAt: String!
    email: String!
    postId: String!
  }

  type Post {
    id: ID!
    body: String!
    itemName: String!
    sellingPrice: Int!
    negotiable: Boolean!
    img: [String]!
    createdAt: String!
    username: String!
    interestedUsers: [interestedUser]!
    interestCount: Int!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    university: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(
      body: String!
      itemName: String!
      img: [String]!
      sellingPrice: Int!
      negotiable: Boolean!
    ): Post!
    deletePost(postId: ID!): String!
    conveyInterest(postId: ID!): String!
  }
  type Subscription {
    newPost: Post!
  }
`;
