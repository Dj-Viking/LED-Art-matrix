<a href="https://github.com/facebook/jest/issues/1456" rel="noopener noreferrer">JEST TEST HANGING DURING GITHUB ACTIONS JEST CI</a>


* <a href="https://stackoverflow.com/questions/63155034/body-used-already-for-error-when-mocking-node-fetch" rel="noopener noreferrer">Mocking node-fetch "body already used for: " type error</a>
```ts
jest.mock("node-fetch");
//@ts-ignore
import fetch from "node-fetch";

// so that when the node-fetch module is executed will return a fake response
// because I don't want my test to fail in a CI if giphy is down for some reason
// and also I get a TLSWRAP warning during the CI maybe because the container is trying
// to make outbound http requests and I don't know how to get rid of this warning
fetch.mockImplementation(() => {
  return Promise.resolve({
    json: () => {
      return Promise.resolve(MOCK_GIPHY_RES);
    },
  });
});
```