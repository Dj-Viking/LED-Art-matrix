const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Category {
    _id: ID
    name: String
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

  type Query {
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