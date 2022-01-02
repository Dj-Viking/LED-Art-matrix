/**
 * 
 * @param {string} usernameOrEmail 
 * @returns 
 */
export const loginEmailChange = (usernameOrEmail) => {
  return {
    type: 'LOGIN_EMAIL_OR_USERNAME_CHANGE',
    payload: usernameOrEmail
  }
}
/**
 * 
 * @param {boolean} data 
 * @returns 
 */
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
/**
 * 
 * @param {string} data 
 * @returns 
 */
export const loginPasswordChange = (data) => {
  return {
    type: 'LOGIN_PASSWORD_CHANGE',
    payload: data
  }
}
/**
 * 
 * @param {boolean} data 
 * @returns 
 */
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