import { db } from "../../firebase";
import { fireToast } from "../../helpers";
import { postActionTypes } from "./types";
import { setLoading, clearLoading, setProgress, clearProgress } from "./uiActions";
import nprogress from "nprogress";
import { storage } from "../../firebase";

// this function checks if a given post has been liked by a given user
async function postLikedByUser(postId, userId) {
  let res = await db.collection("likes").where("postId", "==", postId).where("userId", "==", userId).get();
  return res.empty ? false : true;
}
// this function handles file upload for posts
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
        dispatch(setProgress("PostForm", progress, true));
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
export const cancelUploadFile = () => dispatch => {
  uploadTask.cancel();
  dispatch(clearProgress("PostForm"));
};

async function deleteOldFile(post) {
  if (post.image) {
    const postImageRef = storage.refFromURL(post.image);
    await postImageRef.delete();
  }
}

export const resetPosts = () => dispatch => {
  dispatch({
    type: postActionTypes.RESET_POSTS,
  });
};

export const fetchPosts = (userId, startAfterDoc) => (dispatch, getState) => {
  return new Promise(async resolve => {
    // pagination variables
    let lastVisibleSnapShot;
    let isEmpty;
    let limit = 5;

    try {
      // if there is no startAfterDoc (initial fetch) then dispatch set loading in order to display skeletons
      if (!startAfterDoc) {
        dispatch(setLoading("Posts"));
      }
      const loggedUser = getState().authReducer.loggedUser;

      // initial query
      let ref = db.collection("posts");

      // if there is userId (profile) then fetch posts for particular user else fetch public posts for the loggedUser
      ref = userId ? ref.where("user.uid", "==", userId) : ref.where("user.uid", "in", [...loggedUser.followings, loggedUser.uid]);

      // chain  orderBy
      ref = ref.orderBy("createdAt", "desc");

      // if there is startAfterDoc (infiniteScroll fetch) then chain the startAfter query
      if (startAfterDoc) {
        ref = ref.startAfter(startAfterDoc);
      }

      // finally limit the data
      ref = ref.limit(limit);

      const postsSnapShot = await ref.get();
      // abstract the lastVisibleSnapShot doc and the empty boolean
      lastVisibleSnapShot = postsSnapShot.docs[postsSnapShot.docs.length - 1];
      isEmpty = postsSnapShot.empty;

      // initializing a posts array
      const posts = await Promise.all(
        postsSnapShot.docs.map(async doc => {
          const data = doc.data();
          const id = doc.id;
          const likedByLoggedUser = await postLikedByUser(doc.id, loggedUser.uid);
          return { id, ...data, likedByLoggedUser };
        })
      );

      dispatch({
        type: postActionTypes.FETCH_POSTS,
        payload: posts,
      });
    } catch (err) {
      fireToast("error", err.message);
    }
    // if there is no startAfterDoc (initial fetch) then dispatch clear loading
    if (!startAfterDoc) {
      dispatch(clearLoading("Posts"));
    }

    // finally resolve some variables that the  component needs
    resolve({
      lastVisibleSnapShot,
      isEmpty,
    });
  });
};
export const addPost = (newPost, file) => (dispatch, getState) => {
  return new Promise(async resolve => {
    try {
      dispatch(setProgress("PostForm", 0, false));
      const loggedUser = getState().authReducer.loggedUser;
      // upload file if there is one
      if (file) {
        newPost["image"] = await uploadFile(file, dispatch);
      }
      const docRef = await db.collection("posts").add(newPost);
      await db
        .collection("users")
        .doc(loggedUser.uid)
        .update({ postCount: loggedUser.collData.postCount + 1 });
      newPost["id"] = docRef.id;
      dispatch({
        type: postActionTypes.ADD_POST,
        payload: newPost,
      });
      fireToast("success", "Post added successfully");
      dispatch(setProgress("PostForm", 100, false));
      resolve();
    } catch (err) {
      if (err.code === "storage/canceled") {
        fireToast("error", "you have canceled the upload");
      } else {
        fireToast("error", err.message);
      }
    }
    //this sleep line is just for the progress bar to be displayed a little longer for the user if the upload was fast
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch(clearProgress("PostForm"));
  });
};
export const deletePost = (id, history) => (dispatch, getState) => {
  return new Promise(async resolve => {
    try {
      nprogress.start();
      const loggedUser = getState().authReducer.loggedUser;
      // starting the batch
      const batch = db.batch();

      // delete the Post
      const postRef = db.collection("posts").doc(id);
      batch.delete(postRef);
      // delete the post comments
      let commentsSnapShot = await db.collection("comments").where("postId", "==", id).get();
      commentsSnapShot.forEach(doc => {
        batch.delete(doc.ref);
      });
      //delete the post likes
      let likesSnapShot = await db.collection("likes").where("postId", "==", id).get();
      likesSnapShot.forEach(doc => {
        batch.delete(doc.ref);
      });
      // delete the post image if there is one
      const deletedPost = getState().postReducer.posts.find(post => post.id === id);
      await deleteOldFile(deletedPost);
      await batch.commit();
      // update the post count in the user document
      await db
        .collection("users")
        .doc(loggedUser.uid)
        .update({ postCount: loggedUser.collData.postCount - 1 });

      // push away to the home page if the deleted post happened to be the single post
      const singlePost = getState().postReducer.singlePost;
      if (singlePost && singlePost.id === id) {
        history.push("/");
      }
      dispatch({
        type: postActionTypes.DELETE_POST,
        payload: id,
      });
      fireToast("success", "Post deleted successfully");
      resolve();
    } catch (err) {
      fireToast("error", err.message);
    }
    nprogress.done();
  });
};
export const loadCurrentPost = post => dispatch => {
  dispatch({
    type: postActionTypes.LOAD_CURRENT_POST,
    payload: post,
  });
};
export const updatePost = (editedPost, file, userDeletedOldFile) => (dispatch, getState) => {
  return new Promise(async resolve => {
    try {
      dispatch(setProgress("PostForm", 0, false));
      // finding the actual post from the reducer state
      const post = getState().postReducer.posts.find(post => post.id === editedPost.id);
      editedPost["image"] = post.image;

      // deleting the old file in case of the user pressed delete on the old post image
      if (userDeletedOldFile) {
        await deleteOldFile(post);
        editedPost["image"] = null;
      }
      // upload file if the user chooses a new file
      if (file) {
        // uploading and updating to the new one
        editedPost["image"] = await uploadFile(file, dispatch);
        // delete the old post image only if the user didn't press the delete on the old image
        if (!userDeletedOldFile) {
          await deleteOldFile(post);
        }
      }

      await db.collection("posts").doc(editedPost.id).update(editedPost);
      dispatch({
        type: postActionTypes.UPDATE_POST,
        payload: editedPost,
      });
      fireToast("success", "Post updated successfully");
      dispatch(setProgress("PostForm", 100, false));
      resolve();
    } catch (err) {
      if (err.code === "storage/canceled") {
        fireToast("error", "you have canceled the upload");
      } else {
        fireToast("error", err.message);
      }
    }
    //this sleep line is just for the progress bar to be displayed a little bit longer for the user if the upload was fast
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch(clearProgress("PostForm"));
  });
};

export const fetchSinglePost = (id, history) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    dispatch(setLoading("PostSingle"));
    const loggedUser = getState().authReducer.loggedUser;
    let post;
    let unsubscribe;
    let firstTimeListeningToChanges = true;

    try {
      const doc = await db.collection("posts").doc(id).get();
      if (!doc.exists) {
        history.push("/404");
      } else {
        post = { id: doc.id, ...doc.data() };
        post["likedByLoggedUser"] = await postLikedByUser(doc.id, loggedUser.uid);
        post["comments"] = [];
        dispatch({
          type: postActionTypes.FETCH_SINGLE_POST,
          payload: post,
        });
        unsubscribe = db
          .collection("comments")
          .where("postId", "==", doc.id)
          .orderBy("createdAt", "desc")
          .onSnapshot(
            function (snapshot) {
              snapshot.docChanges().forEach(function (change) {
                if (change.type === "added") {
                  dispatch({
                    type: postActionTypes.ADD_COMMENT,
                    payload: {
                      comment: { id: change.doc.id, ...change.doc.data() },
                      firstTimeListeningToChanges,
                    },
                  });
                }
                if (change.type === "removed") {
                  dispatch({
                    type: postActionTypes.DELETE_COMMENT,
                    payload: change.doc.id,
                  });
                }
              });
              firstTimeListeningToChanges = false;
              dispatch(clearLoading("PostSingle"));
              resolve(unsubscribe);
            },
            function (err) {
              fireToast("error", err.message);
              dispatch(clearLoading("PostSingle"));
              reject(unsubscribe);
            }
          );
      }
    } catch (err) {
      // fireToast("error", err.message);
      dispatch(clearLoading("PostSingle"));
      reject(unsubscribe);
    }
  });
};

export const addComment = newComment => (dispatch, getState) => {
  return new Promise(resolve => {
    dispatch(setLoading("CommentForm"));
    dispatch(setLoading("CommentItem"));
    const singlePost = getState().postReducer.singlePost;
    db.collection("comments")
      .add(newComment)
      .then(docRef => {
        return db
          .collection("posts")
          .doc(singlePost.id)
          .update({
            commentCount: singlePost.commentCount + 1,
          });
      })

      .then(() => {
        fireToast("success", "Comment added successfully");
        resolve();
      })
      .catch(err => {
        fireToast("error", err.message);
      })
      .finally(() => {
        dispatch(clearLoading("CommentForm"));
        dispatch(clearLoading("CommentItem"));
      });
  });
};

export const deleteComment = id => (dispatch, getState) => {
  nprogress.start();
  const singlePost = getState().postReducer.singlePost;
  db.collection("comments")
    .doc(id)
    .delete()
    .then(() => {
      return db
        .collection("posts")
        .doc(singlePost.id)
        .update({
          commentCount: singlePost.commentCount - 1,
        });
    })
    .then(() => {
      fireToast("success", "Comment deleted successfully");
    })
    .catch(err => {
      fireToast("error", err.message);
    })
    .finally(() => {
      nprogress.done();
    });
};

export const toggleLike = (post, userId) => dispatch => {
  return new Promise(async resolve => {
    const postId = post.id;
    dispatch({
      type: postActionTypes.TOGGLE_LIKE,
      payload: postId,
    });

    try {
      if (post.likedByLoggedUser) {
        // unlike
        await db.doc(`/likes/${postId + userId}`).delete();
        await db
          .collection("posts")
          .doc(post.id)
          .update({ likeCount: post.likeCount - 1 });
        resolve("unlike");
      } else {
        // like
        await db
          .collection("likes")
          .doc(postId + userId)
          .set({ postId, userId });
        await db
          .collection("posts")
          .doc(postId)
          .update({ likeCount: post.likeCount + 1 });
        resolve("like");
      }
    } catch (err) {
      /*
     here if the user clicks so fast with a slow network connection . firestore will try to create two entries for the like but i will fail cause of the security rules so we just ignore the error
      */
      // fireToast("error", err.message );
    }
  });
};
