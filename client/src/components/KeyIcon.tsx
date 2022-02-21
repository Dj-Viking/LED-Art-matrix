import React from "react";

// import { OneKeySvg } from "../lib/svgs";

interface KeyIconProps {
  type: string
}

const KeyIcon: React.FC<KeyIconProps> = ({ type }): JSX.Element => {

  function renderIcon(type: KeyIconProps["type"]): JSX.Element {
    switch(type) {
      case "1":{
        return (
          // <OneKeySvg />
          <img style={{ margin: 0, backgroundColor: "white", borderRadius: "5px" }} height={20} width={20} alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAB3UlEQVRoge2ZP04CQRhHnwQULWys0cbEzmsghMILiCSIMcRSY+dpvAHKJdQrgIIWVhY2hr8W3xhw3RWG3dkddV4yxQIz3++xy7CzAw6HIwpWgRrQBJ6APjA21PqqRlPVzEYlUQI6BoPPao9AMazEKTBMUOKzDYD6ohIlSySmZQq6ElnklCYd3tu6yO91bo4tCB3UjvwCpwJE9nWsY8Y3W5DIrsEgYfHNthTw4R6QMZclFH1g2ftikMjYbJbQfMsddGn9OuISuQS2Y6r1hSinyxdgA7kcohozVpFX4ArYUWMaFUnr2GmwDrwZGtsXUyJ7nuNr4N1QLSC+6TcHPAOjiMZz06/1OBHbcCK24URs48+ImLpF8bIJrJgs4FaItuFEbOPfiNj0o/8xyyyRGtEthsIwQrJo00O+gTSybG2R3EPrFpBHnnyOVba56apOOXW8BpSRtXd7StRE66kaDeCAyTbClnq/oyNyozqVdToZpoJkauh0qqlOtwT/+8dJCrhHMlV1Ok7vWJ1Fn0ubCyRLmwXu2YrIvt0QOCeZM5NCJIYqS37RgepqgDFwBxwid7Im904yqkaFyeU0AE7CDlwAHkhu+m0T4kx4ySKbkA1kajY9/XZVrSqG1zEOxww+ANwzxOpGRVB4AAAAAElFTkSuQmCC"/>
        );
      }  
      case "2":{
        return (
          <img style={{ margin: 0, backgroundColor: "white", borderRadius: "5px" }} height={20} width={20} alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACg0lEQVRoge2Zu2sUURSHP5esruIDiWCjRlQQLCwsxMrGIiYsaKGNYAzEFQmWSv4FC20FIUVqC5vVYGVn4QvExkLJmqyolWKl7NPinDDL7s6ud+aemQHnB5dhHvec3zdz7525dyBXrlw+tB2oAKvAF6AJdI1KU3Osas6SL4gysGFofFxZB2bjQtwC2ilCbJYWsBgVopwRiF6YGVeIEvJI0zbfX+pIf/1n3ciA6bByfZjhQgjIRRfqhDXUWxjISUMjcTXU25aQixtA0c5LLDWBrf0Hw0C6tl5ia8B3WNPyrZZ1AkuQZ8A5YBfSTCeBS8A7w5wDijtELhM8/uPANHBY97cBz2PGTwTkB7BT49wHOnq8A9zV40eR5pZpkBWNcSbk/Ck9/8oniEUf+aTbCyHnz+p23WdSC5BjwGUCw/3aBNhvkHtAVt9Jb5GX2QHgT4w4qYJ8BI5o/EcxY6UG8hjYiwzJ9zzESxzkJ3BFY04qkI+4iYK8BKY0Xhn46vEGJQbyAtgN7AEeegRIFOQ7sA9pSu8NIBIDWdIYK0YQQ0Es5iMngA+6HbVQ8AA4HTHHgO+JiIFG6Rcy1H4bc91vn0nzGWLWlINkTf8NSJY6/Ugv40AqyFw7bXUQL85qIHdgAjgPrGH3lh5X1pBVmKLuN1xA6lrpoO7vAOaAJ0CtB9SiNDRHFbhK8HUwpec3XECeaqU5l0rGmkc8VV0qVbTSa8Lf/kmqgMz3u8CCS8XeP1a3/fty1hLipYasVDppFlkNbAN3SOfJFBCItnqZjhpokWBp8w1wDTiE7b+TouaYJ2hOLeBm3MAzwGfSG35rxHgS/SohPyGryNBsPfzWNdcCEfpErlwe9Rd5cxPAy9F5lQAAAABJRU5ErkJggg=="/>
        );
      }
      case "3":{
        return (
          <img style={{ margin: 0, backgroundColor: "white", borderRadius: "5px" }} height={20} width={20} alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACoElEQVRoge2ZP2sUQRjGf15yeokiioRUmiIWgmgliAqCNjHxChsLC2MgnkgUK/8U2oqdfggJfoDTgKC2FmojBiwkq4kfQBAk5HI5i/c9brnbvbvZmbndg33gZdmZnfd9HubfOzuQI0cOFxgDKsAK8BuoAQ1PVtMYKxqz5EpEGVj3SLyX/QLmbEXcBeopimjaNrCUVEQ5IyLCYmZNRZSQLk2bfLttIPO1b9zKAOk4uxlFuBAj5IqJ6gEjkluckJMeidgiktuumI+3gKI/LlaoAbvbC+OENPxysUYH77ih5QLLwFngILAXOA48Af56jNkB25XlofoZBc4AF4D9WnYCEWPjfyBCPiNdPwmshsr/AOfU/7NhEHJPfbyIqHurdRddC/ExR1b1eTmibsJDPEDGsGu861K3rE/rbLZfuEwpvgLvgTvICCgj+1Tm50i7HQn5PQS8duAzFSGvgJfI2eaA+n88jELC9kPFjADfXArxubNHYRq4hhzYPrh07FpIHUk2p7p8M6nPTZeBXQsZAY4iPyu+x3zzUZ/TjmNHwmYePFUfp5GjabO8FqqbAP5ZxBiIkE3gvPoZB2aAq7R29X3IvjIUq9YW8Bw4haTxY8AxJA8LHPjvQH6wyhpyIVlDLiRr6CUkS6tXVy69hFSAHXdcEmMH4WKM5gluFLgErOEmjU9ia0h2UKS12faNZo50WN/HgXnkdBdgf1TtlRUEQBW4TusaYUrr102EvNFG8yaNPGMB4VQ1aVTRRp+IT2MGiQLwBeG0aNIwfGN13z0vYzxCuATAHtPGc8i9XR14QDo9U0BE1JXLTFJHS+qggfzTvYH83vF5d1LUGAu0htM2cNvW8Szwk/SW3wCLnmhHCbmErCJLs+/ld0NjLZJgTuTI4RD/AVKG4fc4njY8AAAAAElFTkSuQmCC"/>
        );
      }
      case "4":{
        return (
          <img style={{ margin: 0, backgroundColor: "white", borderRadius: "5px" }} height={20} width={20} alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACPklEQVRoge2Zu04bQRSGPyxDnAiBlLQkkEi0vAASLRdRRKIlBIk4ilDKAAUtTwIdDYUJLRUNkCeIggmmDQ1UvlKcseyYXZvZnbO7xXzSFN71mfP/O7OzcwGPx+OCl0AROAFugRrQUio1k+PE5Cy4MrEM3CgKH1T+AktxTXwHGimaaJc6sBnVxHJGTHSbWbQ1UUCaNG3xvaWCvK/P5msGRIeVL0GCcyFGPtq4TphAbWFGZhSFxCVQ21DIn6vAsJ6WWNSAkd6LYUZaulpi80R3WNdyzS3wBviglSAJI01gDbjTTJKEkT3gNIE8gbga88+RQWMWeAe8d1RvokbugWlgHCgbE2pG8jbuLPkG/AYOgCnFPH2J+8T2TT0rXddUW0TDyB9gDJgA/iVlxHXXqgOrwANwBLx2XL81UZ/UronfDrin2iKupyh5ZDE2x9P50Bny3WovWw8j5oAA3a6NhNXnMkdgHtdf9n7dYZT/u5ZTkpo0quONZA2/sMoa3kjW8EayxiAjWRq9+moZZKSI7IKkTRPRYk0VeQJ5YAG4ws30O0q5AuaRTYyW0fZsKiborfn9CtmbOkY2EtpGNUrV5CgBn+gcI0ya+zc2Rn6aoDWbIGXWEU0lm6CiCbrAbo2hRQ74hWjasAnsPrH64V6XNTuIljLwwjZ4CdlMaABbpNMyOcREw2iZj1rRpqmgBVwCn5GtT82zk2GTY51Od6ojG36xWASuSW/4LROjJXopIIeQJWRo1h5+KybXBhHeCY/HIY+8S0Elww0GQAAAAABJRU5ErkJggg=="/>
        );
      }
      // case "q":{

      // }
      // case "w":{

      // }
      // case "e":{

      // }
      // case "r":{

      // }
      case "a":{
        return (
          <img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACIklEQVRoge2YTWsTURhGz2RGSFVErWjjRBNpIBaVUkHcuXHnQsG9uPMH6Ko/pX9AUFyJIH6shW4UurAakpikU6xEY5NKmjROrgvrMBFyx8i9M1buWSV5J/M+J7kfMwMGg8GQJJas+OZ95RpCLAHZmPL8jics7lwsFp6OOyAl/Xqy4QGyCJZkB8gFkg0PgAWnZPUogX8eI5A0RiBp9ryAo+vEG83PvHq9AsDCuSJnsq6WPtoE3pZrrFZqANiOo01A2xCqNNaC19WGhxBCSx8tAt+6XZqtzeB9d7vHRvOLjlZ6BMr1n7/4/qk0x44eBqDS8HS00iNQ3Q2bdzPB2K+uretopV5ADIfUvI8A5NwMeTcDgPepyXa/r7qdeoFw0Jyb4fTJGaxUakRMJcqX0fBQefDk+Wit4TE3m1faT7lAeLJ+7WyN1H5NbsuS3ghOhFKB8HJ5/eoVLhQLAHzw1rn/+FmwvB6fPqKsp9I5EN6wcruTFyA7cwLHtoHRDU4FSv+Bge8zN5tnKp3m0MEDwef7HIdL8+fZbLdRvSHLn0q8K+vZ/ydk4WxhbM49fzltBJLGCCTN/y3Q3xnElWMsvYgMUoFS3Ys8gU56OwNKdfmNkHQnbrW3WF5ZVRpKNVFzoBNLCgkWtGX1KIGXCrP8LS9kRamA77MI6Hmc8Ge0fGEvyg6QCty7fbM09L/PC3hIvMOpY8GjobAv3711oxxjX4PBYJiQHzWku8C8HD7AAAAAAElFTkSuQmCC"/>
        );
      }
      // case "s":{

      // }
      // case "d":{

      // }
      // case "f":{

      // }
      default: return (<></>);
    }
  }
  return (
    <>
      {renderIcon(type)}
    </>
  );
};

export { KeyIcon };
/**
 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAB3UlEQVRoge2ZP04CQRhHnwQULWys0cbEzmsghMILiCSIMcRSY+dpvAHKJdQrgIIWVhY2hr8W3xhw3RWG3dkddV4yxQIz3++xy7CzAw6HIwpWgRrQBJ6APjA21PqqRlPVzEYlUQI6BoPPao9AMazEKTBMUOKzDYD6ohIlSySmZQq6ElnklCYd3tu6yO91bo4tCB3UjvwCpwJE9nWsY8Y3W5DIrsEgYfHNthTw4R6QMZclFH1g2ftikMjYbJbQfMsddGn9OuISuQS2Y6r1hSinyxdgA7kcohozVpFX4ArYUWMaFUnr2GmwDrwZGtsXUyJ7nuNr4N1QLSC+6TcHPAOjiMZz06/1OBHbcCK24URs48+ImLpF8bIJrJgs4FaItuFEbOPfiNj0o/8xyyyRGtEthsIwQrJo00O+gTSybG2R3EPrFpBHnnyOVba56apOOXW8BpSRtXd7StRE66kaDeCAyTbClnq/oyNyozqVdToZpoJkauh0qqlOtwT/+8dJCrhHMlV1Ok7vWJ1Fn0ubCyRLmwXu2YrIvt0QOCeZM5NCJIYqS37RgepqgDFwBxwid7Im904yqkaFyeU0AE7CDlwAHkhu+m0T4kx4ySKbkA1kajY9/XZVrSqG1zEOxww+ANwzxOpGRVB4AAAAAElFTkSuQmCC"/>
 */