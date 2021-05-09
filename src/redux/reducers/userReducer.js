import { userActionTypes } from "../actions/types";

const inititalState = {
  singleUser: {},
  // followers: [],

  // followings: [],

  // suggestions: [],
  users: [],
};

export default function userReducer(state = inititalState, action) {
  switch (action.type) {
    case userActionTypes.FETCH_SINGLE_USER:
      return {
        ...state,
        singleUser: action.payload,
      };
    case userActionTypes.FETCH_USERS:
      return {
        ...state,
        users: action.payload,
      };

    case userActionTypes.FOLLOW:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.followedUserId ? { ...user, followedByLoggedUser: true, followerCount: user.followerCount + 1 } : user
        ),
        singleUser:
          state.singleUser.id === action.payload.followedUserId
            ? { ...state.singleUser, followedByLoggedUser: true, followerCount: state.singleUser.followerCount + 1 }
            : state.singleUser,
      };
    case userActionTypes.UNFOLLOW:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.followedUserId ? { ...user, followedByLoggedUser: false, followerCount: user.followerCount - 1 } : user
        ),
        singleUser:
          state.singleUser.id === action.payload.followedUserId
            ? { ...state.singleUser, followedByLoggedUser: false, followerCount: state.singleUser.followerCount - 1 }
            : state.singleUser,
      };
    default:
      return state;
  }
}
