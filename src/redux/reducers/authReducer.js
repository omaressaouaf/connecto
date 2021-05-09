import { authActionTypes, postActionTypes, userActionTypes } from "../actions/types";

const initialState = {
  loggedUser: null,
  authReady: false,
};

export default function authReducer(state = initialState, action) {
  let modifiedLoggedUser;
  switch (action.type) {
    case authActionTypes.SET_LOGGED_USER:
      return {
        ...state,
        loggedUser: action.payload,
        authReady: true,
      };
    case authActionTypes.UPDATE_PROFILE_INFO:
      modifiedLoggedUser = { ...state.loggedUser };
      modifiedLoggedUser.collData.name = action.payload.name;
      modifiedLoggedUser.collData.bio = action.payload.bio;
      modifiedLoggedUser.email = action.payload.email;
      return {
        ...state,
        loggedUser: modifiedLoggedUser,
      };
    case authActionTypes.UPDATE_AVATAR:
      modifiedLoggedUser = { ...state.loggedUser };
      modifiedLoggedUser.collData.avatar = action.payload;

      return {
        ...state,
        loggedUser: modifiedLoggedUser,
      };
    case userActionTypes.FOLLOW:
      modifiedLoggedUser = { ...state.loggedUser };
      modifiedLoggedUser.followings = [...modifiedLoggedUser.followings, action.payload.followedUserId];
      modifiedLoggedUser.collData = { ...modifiedLoggedUser.collData, followingCount: modifiedLoggedUser.collData.followingCount + 1 };
      return {
        ...state,
        loggedUser: modifiedLoggedUser,
      };
    case userActionTypes.UNFOLLOW:
      modifiedLoggedUser = { ...state.loggedUser };
      modifiedLoggedUser.followings = modifiedLoggedUser.followings.filter(following => following !== action.payload.followedUserId);
      modifiedLoggedUser.collData = { ...modifiedLoggedUser.collData, followingCount: modifiedLoggedUser.collData.followingCount - 1 };
      return {
        ...state,
        loggedUser: modifiedLoggedUser,
      };
    case postActionTypes.ADD_POST:
      modifiedLoggedUser = { ...state.loggedUser };
      modifiedLoggedUser.collData = { ...modifiedLoggedUser.collData, postCount: modifiedLoggedUser.collData.postCount + 1 };

      return {
        ...state,
        loggedUser: modifiedLoggedUser,
      };
    case postActionTypes.DELETE_POST:
      modifiedLoggedUser = { ...state.loggedUser };
      modifiedLoggedUser.collData = { ...modifiedLoggedUser.collData, postCount: modifiedLoggedUser.collData.postCount - 1 };

      return {
        ...state,
        loggedUser: modifiedLoggedUser,
      };

    default:
      return state;
  }
}
