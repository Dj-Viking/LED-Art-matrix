import React from 'react';

//import actions for login formstate reducer

const Login = () => {
  return (
    <form>
      <input 
        type="email"
        name="email"
        placeholder="Your Email"
      />
      <input 
        type="password"
        name="password"
        placeholder="Your Password"
      />
      <button
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default Login;