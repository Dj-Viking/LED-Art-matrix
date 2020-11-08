//IMPORTS FOR CREATING A QUERY
import gql from 'graphql-tag';

//USER GRAPHQL QUERY TO GET USERINFO FROM DATABASE
export const USER_QUERY = gql`
{
  user
  {
    _id
    username
    email
    orders{
      _id
    }
    presets {
      _id
      presetName
    }
    defaultPreset
    userSearchTerm
  }
}
`;

export const GET_PRESETS = gql`

  {
    getPresets{
      _id
      presetName
    }
  }
`;

export const GET_SEARCH_TERMS = gql`
  {
    getSearchTerms{
      _id
      termText
      termCategory
      limit
    }
  }
`;