export const signupUsernameChange = (data) => {
  return {
    type: 'SIGNUP_USERNAME_CHANGE',
    payload: data
  }
}
export const signupUsernameCompleted = (data) => {
  return {
    type: 'SIGNUP_USERNAME_COMPLETED',
    payload: data
  }
}
export const signupEmailChange = (data) => {
  return {
    type: 'SIGNUP_EMAIL_CHANGE',
    payload: data
  }
}
export const signupEmailCompleted = (data) => {
  return {
    type: 'SIGNUP_EMAIL_COMPLETED',
    payload: data
  }
}
export const signupPasswordChange = (data) => {
  return {
    type: 'SIGNUP_PASSWORD_CHANGE',
    payload: data
  }
}
export const signupPasswordCompleted = (data) => {
  return {
    type: 'SIGNUP_PASSWORD_COMPLETED',
    payload: data
  }
}