//REACT IMPORTS
import React, {useEffect} from 'react';

//AUTH
import Auth from '../utils/auth.js';

//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';

//GRAPHQL IMPORTS
import { useMutation } from '@apollo/react-hooks';
import { ADD_USER } from '../utils/mutations';


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

  return (
    <>
    <div
      className="form-container"
    >
      <form 
        className="form-card"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="username"
          className="form-username-label"
        >
          Username:
        </label>
        <input 
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          className="form-username-input"
          autoComplete="off"
        />
        <label
          htmlFor="email"
          className="form-email-label"
        >
          Email:
        </label>
        <input 
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="form-email-input"
          autoComplete="off"
        />
        <label
          htmlFor="password"
          className="form-password-label"
        >
          Password:
        </label>
        <input 
          className="form-password-input"
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          autoComplete="off"
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
        <div
          className="form-button-container"
        >
          <button
            type="submit"
            disabled={false}
            className ='form-btn'
          >
            Sign Up
          </button>
        </div> 
      </form>
    </div>
    </>
  );
};

export default Signup;