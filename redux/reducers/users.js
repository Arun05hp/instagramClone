import {
  USERS_POST_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

const initialState = {
  users: [],
  userFollowingLoaded: 0,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
      };

    case USERS_POST_STATE_CHANGE:
      console.log("yes");
      return {
        ...state,
        userFollowingLoaded: state.userLoaded + 1,
        users: state.users.map((user) =>
          user.uid === action.uid ? { ...user, posts: action.posts } : user
        ),
      };
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};
