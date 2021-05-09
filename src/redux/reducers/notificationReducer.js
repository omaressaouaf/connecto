import { notificationActionTypes } from "../actions/types";

const inititalState = {
  notifications: [],
};

export default function notificationReducer(state = inititalState, action) {
  switch (action.type) {
    case notificationActionTypes.FETCH_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case notificationActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
      };
    default:
      return state;
  }
}
