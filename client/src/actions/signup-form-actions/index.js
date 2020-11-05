export const signupUsernameChange = (data) => {
  return {
    type: 'SIGNUP_USERNAME_CHANGE',
    payload: data
  }
}
export const signupUsernameCompleted = (data) => {
  if (data.length > 0) {
    return {
      type: 'SIGNUP_USERNAME_COMPLETED',
      payload: true
    }
  } else {
    return {
      type: 'SIGNUP_USERNAME_COMPLETED',
      payload: false
    }
  }
}
export const signupEmailChange = (data) => {
  return {
    type: 'SIGNUP_EMAIL_CHANGE',
    payload: data
  }
}
export const signupEmailCompleted = (data) => {
  if (data.length > 0) {
    return {
      type: 'SIGNUP_EMAIL_COMPLETED',
      payload: true
    }
  } else {
    return {
      type: 'SIGNUP_EMAIL_COMPLETED',
      payload: false
    }
  }
}
export const signupPasswordChange = (data) => {
  return {
    type: 'SIGNUP_PASSWORD_CHANGE',
    payload: data
  }
}
export const signupPasswordCompleted = (data) => {
  if (data.length > 0) {
    return {
      type: 'SIGNUP_PASSWORD_COMPLETED',
      payload: true
    }
  } else {
    return {
      type: 'SIGNUP_PASSWORD_COMPLETED',
      payload: false
    }
  }
}