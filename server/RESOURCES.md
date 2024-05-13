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

# TODO:
* fix the problem where the JSON is not in a new state after deleting it and recreating the JSON file again
probably some file handle bullshit that NODEJS does under the hood
even when doing require(jsonPath) or JSON.parse(fs.readFileSync(jsonPath, { encoding: "utf-8" }));
the value read from either of these two things is the same value as the file state
as it was before the file was deleted FOR THE FIRST TIME!!! which is BULLSHIT!! 