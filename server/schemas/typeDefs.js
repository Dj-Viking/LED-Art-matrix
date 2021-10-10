const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Category {
    _id: ID
    name: String
  }

  type Gif {
    _id: ID
    gifCategory: String
    gifSrc: String
    limit: String
  }

  type Product {
    _id: ID
    name: String
    description: String
    image: String
    quantity: Int
    price: Float
    category: Category
  }

  type Preset {
    _id: ID
    presetName: String
  }

  type Order {
    _id: ID
    purchaseDate: String
    products: [Product]
  }

  type SearchTerm {
    _id: ID
    termText: String
    termCategory: String
    limit: String
  }

  type User {
    _id: ID
    username: String
    email: String
    defaultPreset: String
    orders: [Order]
    presets: [Preset]
    userSearchTerm: ID
  }

  type Auth {
    token: ID
    user: User
  }

  type ForgotResponse {
    done: Boolean
    error: MyCustomError
  }
  
  type ChangePasswordResponse {
    done: Boolean
    token: String
    error: MyCustomError
  }

  type MyCustomError {
    field: String
    message: String
  }

  type Query {
    getGifs: [Gif]

    getGifsCreateAndOrUpdate: [Gif]

    categories: [Category]

    products(
      category: ID, 
      name: String
    ): [Product]

    product(
      _id: ID!
    ): Product

    user: User

    getUserDefaultPreset: Preset

    getPresets: [Preset]

    getSearchTerms: [SearchTerm]

    order(
      _id: 
      ID!
    ): Order

    checkout(
      products: [ID]!
    ): Checkout

  }

  type Mutation {
    addSearchTerm(
      termText: String!,
      termCategory: String!,
      limit: String!
    ): SearchTerm

    forgotPassword(
      email: String!
    ): ForgotResponse

    changePassword(
      token: String!
      password: String!
    ): ChangePasswordResponse

    addUser(
      username: String!,
      email: String!, 
      password: String!
    ): Auth

    addOrder(
      products: [ID]!
    ): Order

    updateUser(
      username: String,
      email: String, 
      password: String,
      presetName: String,
      defaultPreset: String
    ): User

    updateProduct(
      _id: ID!, 
      quantity: Int!
    ): Product

    login(
      email: String!, 
      password: String!
    ): Auth

    addUserPreset(
      presetName: String!
    ): User

    updateUserDefaultPreset(
      _id: ID!
    ): User

    updateUserSearchTerm(
      userSearchTerm: ID!
    ): User
  }

  type Checkout {
    session: ID!
  }
`;

module.exports = typeDefs;