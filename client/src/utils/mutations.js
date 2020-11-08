import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation login
  (
    $email: String!,
    $password: String!
  )
  {
    login
    (
      email: $email,
      password: $password
    )
    {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser
  (
    $username: String!,
    $email: String!,
    $password: String!
  )
  {
    addUser
    (
      username: $username,
      email: $email,
      password: $password
    )
    {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER_PRESET = gql`
  mutation addUserPreset
  (
    $presetName: String!
  )
  {
    addUserPreset
    ( 
      presetName: $presetName
    )
    {
      _id
      username
      email
      presets {
        _id
        presetName
      }
      defaultPreset
    }
  }
`;

export const UPDATE_USER_DEFAULT_PRESET = gql`
  mutation updateUserDefaultPreset
  (
    $_id: ID!,
  )
  {
    updateUserDefaultPreset
    (
      _id: $_id,
    )
    {
      _id
      username
      email
      defaultPreset,
      presets {
        _id
        presetName
      }
    }
  }
`;

export const UPDATE_USER_SEARCH_TERM = gql`
  mutation updateUserSearchTerm
  (
    $_id: ID!
  ){
    updateUserSearchTerm
    (
      _id: $_id
    ){
      username
      _id
      searchTerm{
        termText
        limit
        termCategory
      }
    }
  }
`;