// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { LOGIN_MOCK_PAYLOAD_USERNAME, LOGIN_MOCK_PAYLOAD_EMAIL, LOGIN_MOCK_NO_TOKEN, LOGIN_MOCK_TOKEN } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestApiServiceClass } from "../../utils/TestApiServiceClass";
const tapi = new TestApiServiceClass("alive");

const store = createStore(
  allReducers,
  // @ts-expect-error this will exist in the browser
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

//TODO IMPLEMENT WINDOW NAVIGATION window.location.assign() for login test

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));



describe("Test rendering login correctly", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() => 
      Promise.resolve({
        status: 400
      })
    );
  });

  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("Render the home page and then click Login button to go to that page", async () => {
    expect(tapi.alive()).toBe("alive");
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const page = (await screen.findAllByText(/^Login$/g)).find((el) => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);
    // act(() => {
    //   link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // });

    const formEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      login: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };

    expect(formEls.emailOrUsername).toBeInTheDocument();
    expect(formEls.password).toBeInTheDocument();
    expect(formEls.login).toBeInTheDocument();

    //type in email here
    // fireEvent.change(formEls.emailOrUsername, { target: { value: LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername }});
    // fireEvent.change(formEls.password, { target: { value: LOGIN_MOCK_PAYLOAD_EMAIL.password }});
    user.type(formEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    user.type(formEls.password, LOGIN_MOCK_PAYLOAD_EMAIL.password);
    expect(formEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    expect(formEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.password);

    //submit login
    // fireEvent.click(formEls.login);

    await act(async () => {
      formEls.login.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

  });
});

describe("test signup functionality with no token", () => {

  //create a reference to the original fetch before we change it swap it back
  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(LOGIN_MOCK_NO_TOKEN),
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("Checks the input fields are available and can submit with a stubbed api", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const page = (await screen.findAllByRole("link", { name: "Login" })).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);

    const inputEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      btn: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };

    expect(inputEls.emailOrUsername).toBeInTheDocument();
    expect(inputEls.password).toBeInTheDocument();
    expect(inputEls.btn).toBeInTheDocument();

    // fireEvent.change(inputEls.emailOrUsername, { target: { value: LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername }});
    // fireEvent.change(inputEls.password, { target: { value: LOGIN_MOCK_PAYLOAD_USERNAME.password }});
    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);
    expect(inputEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    expect(inputEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.password);
    
    // fireEvent.click(inputEls.btn);
    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // const logout = (await screen.findAllByText(/Logout/g)).find(el => {
    //   return el.classList.contains("nav-button");
    // }) as HTMLElement;

    // expect(logout).toBeInTheDocument();

    // fireEvent.click(logout);
  });
});
describe("test signup functionality with token", () => {

  //create a reference to the original fetch before we change it swap it back
  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(LOGIN_MOCK_TOKEN),
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    localStorage.clear(); //clear local storage since this test will set a token in LS and log a user in
  });

  it("Checks the input fields are available and can submit with a stubbed api", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const page = (await screen.findAllByRole("link", { name: "Login" })).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);

    // act(() => {
    //   page.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // });

    const inputEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      btn: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };
    expect(inputEls.emailOrUsername).toBeInTheDocument();
    expect(inputEls.password).toBeInTheDocument();
    expect(inputEls.btn).toBeInTheDocument();
    
    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);
    expect(inputEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
    expect(inputEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.password);
    // fireEvent.click(inputEls.btn);
    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // console.log("local storage", localStorage.getItem("id_token"));

    //not sure why logout button can't be found might have to fake local storage too.
    const logout = (await screen.findAllByText(/Logout/g)).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;

    expect(logout).toBeInTheDocument();

    // fireEvent.click(logout);
  });
});

describe("Tests network error message", () => {

  const originalFetch = global.fetch;
  beforeEach(() => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
      Promise.reject({
        message: new Error("network is down").message
      })
    );
  });
  
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    localStorage.clear();
  });

  it("Checks the input fields are available and can submit with a stubbed api to get the network error message", async () => {

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const page = (await screen.findAllByText(/Login/g)).find(el => {
      return el.classList.contains("nav-button");
    }) as HTMLElement;
    expect(page).toBeInTheDocument();
    fireEvent.click(page);

    const inputEls = {
      emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
      password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
      btn: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
        return btn.classList.contains("form-btn");
      }) as HTMLElement
    };

    //check the input elements are in the document
    expect(inputEls.emailOrUsername).toBeInTheDocument();
    expect(inputEls.password).toBeInTheDocument();
    expect(inputEls.btn).toBeInTheDocument();

    // type inputs to form fields and submit
    act(() => {
      inputEls.emailOrUsername.dispatchEvent(new KeyboardEvent(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername));
      inputEls.password.dispatchEvent(new KeyboardEvent(LOGIN_MOCK_PAYLOAD_EMAIL.password));
    });

    user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_EMAIL.password);
    expect(inputEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
    expect(inputEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.password);

    
    //click signup to simulate api mock
    //clicking the button will start an asynchronous fetch that will update state during and after the async function is done
    await act(async () => {
      inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    
  });
});

//TODO IMPLEMENT WINDOW NAVIGATION window.location.assign() for change password
// https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
// https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
// @ts-ignore need to redefine prop for jest

// describe("need to implement window methods here", () => {
//   const fetchMock = jest.fn(() => {
//     return Promise.resolve({
//       status: 200,
//       json: () => Promise.resolve(LOGIN_MOCK_TOKEN)
//     });
//   });
//   beforeEach(() => {
//     // @ts-ignore
//     global.fetch = fetchMock;
//   });

//   afterEach(() => {
//     cleanup();
//     localStorage.clear();
//     fetchMock.mockClear();
//   });


//   it("test the navigation happens after login page to test render", async () => {

//     render(
//       <>
//         <Provider store={store}>
//           <App />
//         </Provider>
//       </>
//     );

//     const page = (await screen.findAllByText(/Login/g)).find(el => {
//       return el.classList.contains("nav-button");
//     }) as HTMLElement;
//     expect(page).toBeInTheDocument();
//     fireEvent.click(page);

//     const inputEls = {
//       emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
//       password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g) as HTMLInputElement,
//       btn: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
//         return btn.classList.contains("form-btn");
//       }) as HTMLElement
//     };

//     // type inputs to form fields and submit
//     act(() => {
//       inputEls.emailOrUsername.dispatchEvent(new KeyboardEvent(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername));
//       inputEls.password.dispatchEvent(new KeyboardEvent(LOGIN_MOCK_PAYLOAD_EMAIL.password));
//     });

//     user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
//     user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_EMAIL.password);
//     expect(inputEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.emailOrUsername);
//     expect(inputEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_EMAIL.password);

//      //clicking the button will start an asynchronous fetch that will update state during and after the async function is done
//     await act(async () => {
//       inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
//     }); 

//   });
// });