- <a href="https://github.com/jsdom/jsdom/issues/2155" rel="noopener noreferrer">silencing the jest errors in tests with the audio media element</a>

- <a href="https://github.com/microsoft/vscode/issues/94474" rel="noopener noreferrer">fixing jest test not being able to import @types/jest with modifying the moduleNameMapper</a>

- had to configure something else with clearImmediate but I dont remember what it was or where I did it but this is where I found the answer to fixing it
  * <a href="https://github.com/testing-library/dom-testing-library/issues/914" rel="noopener noreferrer">here</a>

- how to mock apis things to try
  * <a href="https://stackoverflow.com/questions/65946740/mocking-fetch-with-jest-fn-in-react" rel="noopener noreferrer">GETTING DATA FROM MOCKED RESPONSE</a>
  ```jsx
      describe("Test", () => {
          let originalFetch;

          beforeEach(() => {
              originalFetch = global.fetch;
              global.fetch = jest.fn(() => Promise.resolve({
                  json: () => Promise.resolve({
                      value: "Testing something!"
                  })
              }));
          });

          afterEach(() => {
              global.fetch = originalFetch;
          });

          it('Should have proper description after data fetch', async () => {

              // need to put mock logic here to make it work

              render(<Test />);
              const description = await screen.findByTestId('description');
              expect(description.textContent).toBe("Testing something!");
          });
      });
  ```
  * <a href="https://www.leighhalliday.com/mock-fetch-jest" rel="noopener noreferrer">JEST MOCK FETCH</a>
  * <a href="https://mswjs.io/docs/api/response/network-error" rel="noopener noreferrer">MSW (mock service worker)</a>



* <a href="https://testing-library.com/docs/ecosystem-user-event/" rel="noopener noreferrer">@testing-library/user-event for properly updating state in the react app...</a>

* <a href="https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning" rel="noopener noreferrer">Finally can remove the act() warning</a>
    - 
    ```ts
    //clicking the button will start an asynchronous fetch 
    // that will update state during and after the async function is done
    await act(async () => {
        inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    ```

* <a href="https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c" rel="noopener noreferrer">Good article on jest mocks</a>
       

* Jest bug with leaky mocks and not properly clearing with use of jest.clearAllMocks() jest.resetMocks() or whatever is supposed to cleanup anything doesn't actually work
    - <a href="https://github.com/facebook/jest/issues/7136" rel="noopener noreferrer">Issue #7136 linked here</a>


* have to stub the window.addEventListener function for jest tests after adding in the keybindings feature
    - <a href="https://medium.com/@DavideRama/testing-global-event-listener-within-a-react-component-b9d661e59953" rel="noopener noreferrer">here</a>

    ```ts
    const map = {} as Record<any, any>;
        window.addEventListener = jest.fn((event, cb) => {
        map[event as any] = cb;
    });

    ```