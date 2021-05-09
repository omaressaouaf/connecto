import firebase, { auth, db, storage } from "../../firebase";
import { fireToast } from "../../helpers";
import { setLoading, clearLoading, setProgress, clearProgress } from "../actions/uiActions";
import { authActionTypes } from "./types";

export const authStateChanged = () => dispatch => {
  return new Promise(async resolve => {
    let unsubscribe;
    try {
      unsubscribe = auth.onAuthStateChanged(async user => {
        if (user) {
          const doc = await db.collection("users").doc(user.uid).get();
          const uid = user.uid;
          const data = doc.data();
          user["collData"] = { uid, ...data };
          const followingsSnapShot = await db.collection("users").doc(user.uid).collection("followings").get();
          const followings = followingsSnapShot.docs.map(doc => {
            return doc.id;
          });
          user["followings"] = followings;
        }
        dispatch({ type: authActionTypes.SET_LOGGED_USER, payload: user });
        dispatch(clearLoading("Login"));
        dispatch(clearLoading("Register"));
      });
      // returning a clean up function which unsubscribes from the auth state event
      resolve(unsubscribe);
    } catch (err) {
      resolve(unsubscribe);
    }
  });
};

export const login = (email, password) => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setLoading("Login"));
      await auth.signInWithEmailAndPassword(email, password);
      resolve();
    } catch (err) {
      dispatch(clearLoading("Login"));
      reject(err);
    }
  });
};
// in order to create some search terms for the names
function getNameTerms(name) {
  // initital name should something like this :Omar Essaouaf
  let nameTerms = [];
  //then we tranform it to lower case
  let nameLowerCase = name.toLowerCase();
  // then we push the name to the nameTerms array : example('o' ,'om' ,'oma' ,'omar' ..........)
  for (let i = 1; i <= nameLowerCase.length; i++) {
    nameTerms.push(nameLowerCase.substring(0, i));
  }
  /*
 no we gonna have to do the same to the reverse name
 ( extra terms in order to have a high chance to match the specified  query)
*/

  // we split the name to the ann array : example : omar essaouaf => ['omar' , 'essaouaf']
  let nameAsArray = nameLowerCase.split(" ");
  // we initialize a variable and we assign the last item in the array to it : essaouaf for this case

  let nameLowerCaseReverse = nameAsArray[nameAsArray.length - 1];
  // we loop through the rest of the items and concatenate : omar  ....
  for (let i = nameAsArray.length - 2; i >= 0; i--) {
    nameLowerCaseReverse = nameLowerCaseReverse + " " + nameAsArray[i];
  }

  // if you are wondering why i assigned the last item seperately then concatenate the rest  , because i wanna avoid an extra space   . try it and see

  // then we push the name to the nameTerms array : example('e' ,'es' ,'ess' ,'essa' ..........)
  for (let i = 1; i <= nameLowerCaseReverse.length; i++) {
    nameTerms.push(nameLowerCaseReverse.substring(0, i));
  }

  // there we go

  return nameTerms;
  // take a look at the firestore users collections for better understanding
}
export const signup = (email, password, name) => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setLoading("Register"));
      const creds = await auth.createUserWithEmailAndPassword(email, password);
      const nameTerms = getNameTerms(name);

      await db
        .collection("users")
        .doc(creds.user.uid)
        .set({
          name,
          avatar: null,
          bio: `Hello i am ${name} and i wanna ConnecTo the World`,
          postCount: 0,
          followerCount: 0,
          followingCount: 0,
          nameTerms,
          createdAt: Date.now(),
        });
      resolve();
    } catch (err) {
      dispatch(clearLoading("Register"));
      reject(err);
    }
  });
};

export const resetPassword = email => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setLoading("ForgotPassword"));
      await auth.sendPasswordResetEmail(email);
      resolve("Check your Email for further Info");
    } catch (err) {
      reject(err);
    }
    dispatch(clearLoading("ForgotPassword"));
  });
};

export const logout = () => dispatch => {
  auth.signOut().catch(err => fireToast("error", "could not log you out ! Try again"));
};

async function updateProfileInfoInOtherCollections(batch, name, avatar, loggedUser) {
  // updating info in the posts collections
  let postsSnapShot = await db.collection("posts").where("user.uid", "==", loggedUser.uid).get();
  postsSnapShot.forEach(doc => {
    batch.update(doc.ref, { user: { name, avatar, uid: loggedUser.uid } });
  });
  // updating info in the comments collections
  let commentsSnapShot = await db.collection("comments").where("user.uid", "==", loggedUser.uid).get();
  commentsSnapShot.forEach(doc => {
    batch.update(doc.ref, { user: { name, avatar, uid: loggedUser.uid } });
  });
}
export const updateProfileInfo = (email, name, bio) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setLoading("ProfileEditInfo"));
      const loggedUser = getState().authReducer.loggedUser;
      // starting the batch
      const batch = db.batch();
      // user doc reference
      const userRef = db.collection("users").doc(loggedUser.uid);
      // update info in the users collection
      const nameTerms = getNameTerms(name);
      batch.update(userRef, { name, bio, nameTerms });
      // update info in other collecions
      await updateProfileInfoInOtherCollections(batch, name, loggedUser.collData.avatar, loggedUser);
      // and finally in the auth
      await auth.currentUser.updateEmail(email);

      await batch.commit();

      dispatch({ type: authActionTypes.UPDATE_PROFILE_INFO, payload: { email, name, bio } });

      resolve("Profile Info Updated Successfully");
    } catch (err) {
      reject(err);
    }
    dispatch(clearLoading("ProfileEditInfo"));
  });
};

export const changePassword = (currentPassword, newPassword) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setLoading("ProfileChangePassword"));
      const loggedUser = getState().authReducer.loggedUser;
      // reauthenticating (in order to see if the user actually knows the old password)
      var creds = firebase.auth.EmailAuthProvider.credential(loggedUser.email, currentPassword);
      await auth.currentUser.reauthenticateWithCredential(creds);
      // updating password
      await auth.currentUser.updatePassword(newPassword);
      resolve("Password changed Successfully");
    } catch (err) {
      reject(err);
    }
    dispatch(clearLoading("ProfileChangePassword"));
  });
};
let uploadTask;
function uploadFile(file, dispatch) {
  return new Promise((resolve, reject) => {
    const storageRef = storage.ref();
    const randomFileName = "" + Date.now() + "";
    const fileRef = storageRef.child(randomFileName);
    uploadTask = fileRef.put(file);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        dispatch(setProgress("ProfileHeader", progress, true));
      },
      err => {
        reject(err);
      },
      async () => {
        const imageUrl = await fileRef.getDownloadURL();
        resolve(imageUrl);
      }
    );
  });
}
export const cancelUploadFile = () => dispatch => {
  uploadTask.cancel();
  dispatch(clearProgress("ProfileHeader"));
};

export const updateAvatar = file => async (dispatch, getState) => {
  try {
    dispatch(setProgress("ProfileHeader", 0, true));
    const loggedUser = getState().authReducer.loggedUser;
    const avatar = await uploadFile(file, dispatch);
    // starting the batch
    const batch = db.batch();
    // user doc reference
    const userRef = db.collection("users").doc(loggedUser.uid);
    // update info in the users collection
    batch.update(userRef, { avatar });
    // update info in other collecions
    await updateProfileInfoInOtherCollections(batch, loggedUser.collData.name, avatar, loggedUser);
    batch.commit();
    dispatch({ type: authActionTypes.UPDATE_AVATAR, payload: avatar });
  } catch (err) {
    if (err.code === "storage/canceled") {
      fireToast("error", "you have canceled the upload");
    } else {
      fireToast("error", err.message);
    }
  }
  dispatch(clearProgress("ProfileHeader"));
};
