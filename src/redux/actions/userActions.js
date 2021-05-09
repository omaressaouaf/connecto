import { db } from "../../firebase";
import { fireToast } from "../../helpers";
import { userActionTypes } from "./types";
import { clearLoading, setLoading } from "./uiActions";

function userFollowedByLoggedUser(userId, loggedUser) {
  return loggedUser.followings.includes(userId);
}
export const fetchSingleUser = (id, loggedUser, history) => async dispatch => {
  try {
    dispatch(setLoading("Profile"));
    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      history.push("/404");
      return;
    }

    const followedByLoggedUser = userFollowedByLoggedUser(userDoc.id, loggedUser);
    const singleUser = { id: userDoc.id, ...userDoc.data(), followedByLoggedUser };
    dispatch({
      type: userActionTypes.FETCH_SINGLE_USER,
      payload: singleUser,
    });
  } catch (err) {
    fireToast("error", err.message);
  }
  dispatch(clearLoading("Profile"));
};
export const fetchSuggestions = (loggedUser, pathname) => async dispatch => {
  dispatch(setLoading("FollowSuggestions"));
  try {
    let ref = db.collection("users").where("__name__", "not-in", [...loggedUser.followings, loggedUser.uid]);
    ref = pathname === "/" ? ref.limit(4) : ref;
    const suggestionsSnapShot = await ref.get();
    const suggestions = suggestionsSnapShot.docs.map(doc => {
      return { id: doc.id, ...doc.data(), followedByLoggedUser: false };
    });
    dispatch({
      type: userActionTypes.FETCH_USERS,
      payload: suggestions,
    });
  } catch (err) {
    fireToast("error", err.message);
  }
  dispatch(clearLoading("FollowSuggestions"));
};

export const fetchUserFollowers = (userId, loggedUser) => async dispatch => {
  dispatch(setLoading("Followers"));
  try {
    const followersSnapshot = await db.collection("users").doc(userId).collection("followers").get();
    const followers = await Promise.all(
      followersSnapshot.docs.map(async doc => {
        const userDoc = await db.collection("users").doc(doc.id).get();
        const followedByLoggedUser = userFollowedByLoggedUser(userDoc.id, loggedUser);
        return { id: doc.id, ...userDoc.data(), followedByLoggedUser };
      })
    );
    dispatch({
      type: userActionTypes.FETCH_USERS,
      payload: followers,
    });
  } catch (err) {
    fireToast("error", err.message);
  }
  dispatch(clearLoading("Followers"));
};

export const fetchUserFollowings = (userId, loggedUser) => async dispatch => {
  dispatch(setLoading("Followings"));
  try {
    const followingsSnapShot = await db.collection("users").doc(userId).collection("followings").get();
    const followings = await Promise.all(
      followingsSnapShot.docs.map(async doc => {
        const userDoc = await db.collection("users").doc(doc.id).get();
        const followedByLoggedUser = userFollowedByLoggedUser(userDoc.id, loggedUser);
        return { id: doc.id, ...userDoc.data(), followedByLoggedUser };
      })
    );
    dispatch({
      type: userActionTypes.FETCH_USERS,
      payload: followings,
    });
  } catch (err) {
    fireToast("error", err.message);
  }
  dispatch(clearLoading("Followings"));
};

export const follow = (loggedUser, followedUser) => async dispatch => {
  try {
    dispatch(setLoading(`FollowButton${followedUser.id}`));
    await db.collection("users").doc(loggedUser.uid).collection("followings").doc(followedUser.id).set({});
    await db.collection("users").doc(followedUser.id).collection("followers").doc(loggedUser.uid).set({});
    await db
      .collection("users")
      .doc(loggedUser.uid)
      .update({ followingCount: loggedUser.collData.followingCount + 1 });
    await db
      .collection("users")
      .doc(followedUser.id)
      .update({ followerCount: followedUser.followerCount + 1 });
    dispatch({
      type: userActionTypes.FOLLOW,
      payload: {
        followedUserId: followedUser.id,
      },
    });
  } catch (err) {
    fireToast("error", err.message);
  }
  dispatch(clearLoading(`FollowButton${followedUser.id}`));
};
export const unfollow = (loggedUser, followedUser) => async dispatch => {
  try {
    dispatch(setLoading(`UnfollowButton${followedUser.id}`));
    await db.collection("users").doc(loggedUser.uid).collection("followings").doc(followedUser.id).delete();
    await db.collection("users").doc(followedUser.id).collection("followers").doc(loggedUser.uid).delete();
    await db
      .collection("users")
      .doc(loggedUser.uid)
      .update({ followingCount: loggedUser.collData.followingCount - 1 });
    await db
      .collection("users")
      .doc(followedUser.id)
      .update({ followerCount: followedUser.followerCount - 1 });
    dispatch({
      type: userActionTypes.UNFOLLOW,
      payload: {
        followedUserId: followedUser.id,
      },
    });
  } catch (err) {
    fireToast("error", err.message);
  }
  dispatch(clearLoading(`UnfollowButton${followedUser.id}`));
};

export const searchUsers = name => async (dispatch, getState) => {
  try {
    dispatch(setLoading("SearchedUsers"));
    const loggedUser = getState().authReducer.loggedUser;
    const nameLowerCase = name.toLowerCase();
    const res = await db.collection("users").where("nameTerms", "array-contains", nameLowerCase).get();
    const users = res.docs.map(doc => {
      const followedByLoggedUser = userFollowedByLoggedUser(doc.id, loggedUser);
      return { id: doc.id, ...doc.data(), followedByLoggedUser };
    });
    dispatch({
      type: userActionTypes.FETCH_USERS,
      payload: users,
    });
  } catch (err) {
    fireToast("error", err.message);
  }
  dispatch(clearLoading("SearchedUsers"));
};
