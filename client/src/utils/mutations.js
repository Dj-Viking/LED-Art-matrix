import gql from 'graphql-tag';


export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email){
      done
    }
  }
`;
export const CHANGE_PASSWORD = gql`
  mutation changePassword($token: String!, $password: String!) {
    changePassword(token: $token, password: $password){
      done
      token
      error {
        field
        message
      }
    }
  }
`;

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
    $userSearchTerm: ID!
  ){
    updateUserSearchTerm
    (
      userSearchTerm: $userSearchTerm
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