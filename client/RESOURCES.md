- <a href="https://github.com/jsdom/jsdom/issues/2155" rel="noopener noreferrer">silencing the jest errors in tests with the audio media element</a>

- <a href="https://github.com/microsoft/vscode/issues/94474" rel="noopener noreferrer">fixing jest test not being able to import @types/jest with modifying the moduleNameMapper</a>

- had to configure something else with clearImmediate but I dont remember what it was or where I did it but this is where I found the answer to fixing it
  * <a href="https://github.com/testing-library/dom-testing-library/issues/914" rel="noopener noreferrer">here</a>

- how to mock apis things to try
  * <a href="https://stackoverflow.com/questions/65946740/mocking-fetch-with-jest-fn-in-react" rel="noopener noreferrer">GETTING DATA FROM MOCKED RESPONSE</a>
  ```js
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