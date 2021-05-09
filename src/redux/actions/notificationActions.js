import { db } from "../../firebase";
import { fireToast } from "../../helpers";
import { notificationActionTypes } from "./types";
import { clearLoading, setLoading } from "./uiActions";

export const fetchNotifications = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    dispatch(setLoading("Notifications"));
    const loggedUser = getState().authReducer.loggedUser;
    let firstTimeListeningToChanges = true;
    let unsubscribe;
    unsubscribe = db
      .collection("notifications")
      .where("receiverId", "==", loggedUser.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        snapshot => {
          let notifications = [];
          // this loop just in order to show a little delicious toast
          snapshot.docChanges().forEach(change => {
            if (change.type === "added" && !firstTimeListeningToChanges && change.doc.data().sender === loggedUser.uid) {
              fireToast("info", change.doc.data().title);
            }
          });
          snapshot.forEach(doc => {
            notifications.push({ id: doc.id, ...doc.data() });
          });
          dispatch({
            type: notificationActionTypes.FETCH_NOTIFICATIONS,
            payload: notifications,
          });
          firstTimeListeningToChanges = false;
          dispatch(clearLoading("Notifications"));
          resolve(unsubscribe);
        },
        err => {
          fireToast("error", err.message);
          dispatch(clearLoading("Notifications"));
          resolve(unsubscribe);
        }
      );
  });
};

export const sendNotification = (receiverId, path, title, icon, iconColor) => (dispatch, getState) => {
  const loggedUser = getState().authReducer.loggedUser;
  if (receiverId === loggedUser.uid) {
    return;
  }
  db.collection("notifications").add({
    sender: { id: loggedUser.uid, name: loggedUser.collData.name, avatar: loggedUser.collData.avatar },
    receiverId,
    title: `${loggedUser.collData.name} ${title}`,
    icon,
    iconColor,
    path,
    read: false,
    createdAt: Date.now(),
  });
};
export const markNotificationsRead = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: notificationActionTypes.MARK_NOTIFICATION_READ,
    });
    const loggedUser = getState().authReducer.loggedUser;
    const batch = db.batch();
    const snapshot = await db.collection("notifications").where("receiverId", "==", loggedUser.uid).get();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    batch.commit();
  } catch (err) {
    fireToast("error", err.message);
  }
};
