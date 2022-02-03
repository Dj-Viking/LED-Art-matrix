export const IS_PROD = process.env.NODE_ENV === "production";
export const API_URL = IS_PROD ? "https://led-matrices.herokuapp.com" : "http://localhost:3001";
export const RAINBOW_TEST_ANIMATION = `
@keyframes rainbowTest {
  0.001% {
    background-color: red;
  }
  25% {
    background-color: orange;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const RAINBOW_V2_ANIMATION = `
@keyframes v2 {
  0.001% {
    background-color: red;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: orange;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const WAVES_ANIMATION = `
@keyframes waves {
  0.001% {
    background-color: red;
  }
  25% {
    background-color: #ff6400;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const SPIRAL_ANIMATION = `
@keyframes spiral {
  0.001% {
    background-color: blue;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: red;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: white;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}
`;
export const FOUR_SPIRALS_ANIMATION = `
@keyframes fourSpirals {
  0.001% {
    background-color: red;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: #ff6400;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const DM5_ANIMATION = `
@keyframes dm5 {
  0.001% {
    background-color: lime;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: black;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: black;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: lime;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;