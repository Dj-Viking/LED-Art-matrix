const signupFormReducer = (
  state = {
    username: '',
    usernameIsComplete: false,
    email: '',
    emailIsComplete: false,
    password: '',
    passwordIsComplete: false
}, action) =>
{
  switch(action.type) {
    case 'SIGNUP_USERNAME_CHANGE':
      return {
        ...state,
        username: action.payload
      }
    case 'SIGNUP_USERNAME_COMPLETED':
      return {
        ...state,
        usernameIsComplete: action.payload
      }
    case 'SIGNUP_EMAIL_CHANGE':
      return {
        ...state,
        email: action.payload
      }
    case 'SIGNUP_EMAIL_COMPLETED':
      return {
        ...state,
        emailIsComplete: action.payload
      }
    case 'SIGNUP_PASSWORD_CHANGE':
      return {
        ...state,
        password: action.payload
      }
    case 'SIGNUP_PASSWORD_COMPLETED':
      return {
        ...state,
        passwordIsComplete: action.payload
      }
    default: return state
  };
};

export default signupFormReducer;