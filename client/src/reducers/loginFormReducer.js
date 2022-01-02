const loginFormReducer = (
  state = {
    usernameOrEmail: '',
    emailIsComplete: false,
    password: '',
    passwordIsComplete: false
}, action) => 
{
  switch(action.type) {
    case 'LOGIN_EMAIL_OR_USERNAME_CHANGE':
      return {
        ...state,
        usernameOrEmail: action.payload
      }
    case 'LOGIN_EMAIL_COMPLETED':
      return {
        ...state,
        emailIsComplete: action.payload
      }
    case 'LOGIN_PASSWORD_CHANGE':
      return {
        ...state,
        password: action.payload
      }
    case 'LOGIN_PASSWORD_COMPLETED':
      return {
        ...state,
        passwordIsComplete: action.payload
      }
    default: return state;
  };
};

export default loginFormReducer;