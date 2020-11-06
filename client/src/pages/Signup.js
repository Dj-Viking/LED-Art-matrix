//REACT IMPORTS
import React from 'react';

//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';

//GRAPHQL IMPORTS
import { useMutation } from '@apollo/react-hooks';
import { ADD_USER } from '../utils/mutations';

//AUTH
import Auth from '../utils/auth.js';

//ACTIONS IMPORT for signup formstate reducer
import {
  signupUsernameChange,
  signupUsernameCompleted,
  signupEmailChange,
  signupEmailCompleted,
  signupPasswordChange,
  signupPasswordCompleted
} from '../actions/signup-form-actions';

const Signup = () => {
  //OBSERVE GLOBAL SIGNUP FORM STATE
  const signupFormState = useSelector(state => state.signupForm);
  //console.log(signupFormState);
  //GRAB PIECE OF STATE
  const {
    username,
    email,
    password,
    usernameIsComplete,
    emailIsComplete,
    passwordIsComplete
  } = signupFormState;
  
  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();

  //ESTABLISH GRAPHQL SIGNUP MUTATION
  const [addUser, { error }] = useMutation(ADD_USER);
  
  //FUNCTION TO HANDLE FORM SUBMIT TO GRAPHQL MUTATION
  async function handleSubmit(event){
    event.preventDefault();
    try {
      const mutationResponse = await addUser
      (
        {
          variables: {
            username: username,
            email: email,
            password: password
          }
        }
      );
      //generate a token for the user signing up
      // get the token back from the 
      // graphql returned object of the mutation
      const token = mutationResponse.data.addUser.token;
      //authorize token and send user to home page
      Auth.login(token);
    } catch(err) {
      console.log(err);
    }
  } 

  function handleChange(event) {
    if (event.target.type === 'text') {
      dispatchREDUX(signupUsernameChange(event.target.value));
      dispatchREDUX(signupUsernameCompleted(event.target.value));
    }
    if (event.target.type === 'email') {
      dispatchREDUX(signupEmailChange(event.target.value));
      dispatchREDUX(signupEmailCompleted(event.target.value));
    }
    if (event.target.type === 'password') {
      dispatchREDUX(signupPasswordChange(event.target.value));
      dispatchREDUX(signupPasswordCompleted(event.target.value));
    }
  }

  function enableSignup() {
    if (
      usernameIsComplete && 
      emailIsComplete && 
      passwordIsComplete
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Username"
        />
        <input 
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input 
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        {
          error 
          ?
          (
            <>
              <div
                style={{color: 'red'}}
              >
                An error happened during the signup process!
              </div>
            </>
          )
          : null
        }
        <button
          type="submit"
          disabled={enableSignup()}
        >
          Sign Up!
        </button>
      </form>
    </>
  );
};

export default Signup;