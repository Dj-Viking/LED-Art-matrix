export const loginEmailChange = (data) => {
  return {
    type: 'LOGIN_EMAIL_CHANGE',
    payload: data
  }
}
export const loginEmailCompleted = (data) => {
  if (data.length > 0) {
    return {
      type: 'LOGIN_EMAIL_COMPLETED',
      payload: true
    }
  } else {
    return {
      type: 'LOGIN_EMAIL_COMPLETED',
      payload: false
    }
  }
}
export const loginPasswordChange = (data) => {
  return {
    type: 'LOGIN_PASSWORD_CHANGE',
    payload: data
  }
}
export const loginPasswordCompleted = (data) => {
  if (data.length > 0){
    return {
      type: 'LOGIN_PASSWORD_COMPLETED',
      payload: true
    }
  } else {
    return {
      type: 'LOGIN_PASSWORD_COMPLETED',
      payload: false
    }
  }
}