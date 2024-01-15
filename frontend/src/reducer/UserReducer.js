const storedUser = localStorage.getItem("user");
let parsedUser = null;

try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
  // Handle the error, you can choose to set parsedUser to null or take other actions.
}

const initialState = {
  user: parsedUser,
  loading: false,
  error: null,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
        error: null, // Clear error state on logout
      };
    default:
      return state;
  }
};

export default UserReducer;
