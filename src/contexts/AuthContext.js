import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import firebase, { auth, db, storage } from "../firebase";
import { fireToast } from "../helpers";


// creating the auth context
const AuthContext = createContext();
// exporting a custom hook that uses the context
export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = props => {
  // initially the logged user is null
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // upload file function
  const uploadTask = useRef();
  function uploadFile(file, setProgress) {
    return new Promise((resolve, reject) => {
      const storageRef = storage.ref();
      const randomFileName = "" + Date.now() + "";
      const fileRef = storageRef.child(randomFileName);
      uploadTask.current = fileRef.put(file);
      uploadTask.current.on(
        "state_changed",
        snapshot => {
          const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress("ProfileHeader", progress, true);
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
  // this function cancels the upload
  function cancelUploadFile() {
    uploadTask.current.cancel();
  }

  //   auth functions that return a promise that we will check in the component
  function signup(email, password, name) {
    return auth.createUserWithEmailAndPassword(email, password).then(cred => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          name,
          avatar: null,
          bio: `Hello i am ${name} and i wanna ConnecTo the World`,
          postCount: 0,
          followerCount: 0,
          followingCount: 0,
        });
    });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function logout() {
    return auth.signOut();
  }
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  async function updateProfileInfoInOtherCollections(batch, name, avatar) {
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
  function updateProfileInfo(email, name, bio) {
    return new Promise(async (resolve, reject) => {
      try {
        // starting the batch
        const batch = db.batch();
        // user doc reference
        const userRef = db.collection("users").doc(loggedUser.uid);
        // update info in the users collection
        batch.update(userRef, { name, bio });
        // update info in other collecions
        await updateProfileInfoInOtherCollections(batch, name, loggedUser.collData.avatar);
        // and finally in the auth
        await auth.currentUser.updateEmail(email);

        await batch.commit();

        const modifiedLoggedUser = { ...loggedUser };
        modifiedLoggedUser.collData.name = name;
        modifiedLoggedUser.collData.bio = bio;
        modifiedLoggedUser.email = email;
        setLoggedUser(modifiedLoggedUser);

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
  function changePassword(currentPassword, newPassword) {
    return new Promise(async (resolve, reject) => {
      try {
        // reauthenticating (in order to see if the user actually knows the old password)
        var creds = firebase.auth.EmailAuthProvider.credential(loggedUser.email, currentPassword);
        await auth.currentUser.reauthenticateWithCredential(creds);

        // updating password
        await auth.currentUser.updatePassword(newPassword);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
  async function updateAvatar(file, setProgress, clearProgress) {
    try {
      setProgress("ProfileHeader", 0, true);
      const avatar = await uploadFile(file, setProgress);
      // starting the batch
      const batch = db.batch();
      // user doc reference
      const userRef = db.collection("users").doc(loggedUser.uid);
      // update info in the users collection
      batch.update(userRef, { avatar });
      // update info in other collecions
      await updateProfileInfoInOtherCollections(batch, loggedUser.collData.name, avatar);

      batch.commit();
      const modifiedLoggedUser = { ...loggedUser };
      modifiedLoggedUser.collData.avatar = avatar;
      setLoggedUser(modifiedLoggedUser);
    } catch (err) {
      if (err.code === "storage/canceled") {
        fireToast("error", "you have canceled the upload");
      } else {
        fireToast("error", err.message);
      }
    }
    clearProgress("ProfileHeader");
  }
  function addFollowingToLoggedUser(followedId) {
    setLoggedUser(prevLoggedUser => {
      return {
        ...prevLoggedUser,
        followings: [...prevLoggedUser.followings, followedId],
        collData: { ...prevLoggedUser.collData, followingCount: prevLoggedUser.collData.followingCount + 1 },
      };
    });
  }
  function removeFollowingFromLoggedUser(followedId) {
    setLoggedUser(prevLoggedUser => {
      return {
        ...prevLoggedUser,
        followings: prevLoggedUser.followings.filter(following => following !== followedId),
        collData: { ...prevLoggedUser.collData, followingCount: prevLoggedUser.collData.followingCount - 1 },
      };
    });
  }
  function increaseLoggedUserPostCount() {
    setLoggedUser(prevLoggedUser => {
      return { ...prevLoggedUser, collData: { ...prevLoggedUser.collData, postCount: prevLoggedUser.collData.postCount + 1 } };
    });
  }
  function decreaseLoggedUserPostCount() {
    setLoggedUser(prevLoggedUser => {
      return { ...prevLoggedUser, collData: { ...prevLoggedUser.collData, postCount: prevLoggedUser.collData.postCount - 1 } };
    });
  }
  // on auth state changed detects if the auth state has changed (login , logout ...) and firebase handles the token
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
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
      setLoggedUser(user);
      setLoading(false);
    });
    // returning a clean up function which unsubscribes from the function
    return unsubscribe;
  }, []);
  // our states and auth functions which will be passed to the components
  const value = {
    loggedUser,
    signup,
    login,
    logout,
    resetPassword,
    updateProfileInfo,
    changePassword,
    updateAvatar,
    cancelUploadFile,
    addFollowingToLoggedUser,
    removeFollowingFromLoggedUser,
    increaseLoggedUserPostCount,
    decreaseLoggedUserPostCount,
  };

  return <AuthContext.Provider value={value}>{!loading && props.children}</AuthContext.Provider>;
};
