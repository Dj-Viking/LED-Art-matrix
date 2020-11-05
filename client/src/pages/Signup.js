import React from 'react';

//import actions for signup formstate reducer

const Signup = () => {
  return (
    <>
      <form>
        <input 
          type="text"
          name="username"
          placeholder="Username"
        />
        <input 
          type="email"
          name="email"
          placeholder="Email"
        />
        <input 
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          type="submit"
        >
          Sign Up!
        </button>
      </form>
    </>
  );
};

export default Signup;