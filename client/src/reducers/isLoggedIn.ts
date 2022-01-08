const isLoggedInReducer = (
  state = false, 
  action: { type: "LOGIN" | "LOGOUT" }
): boolean => {
  switch (action.type) {
    case "LOGIN":
      return true;
    case "LOGOUT":
      return false;
    default: 
      return state;
  }
};

export default isLoggedInReducer;

// check when a jwt expires and log 
// the user out of the UI?
