import { uiActionTypes } from "./types";

export const setLoading = component => {
  return {
    type: uiActionTypes.SET_LOADING,
    payload: component,
  };
};
export const clearLoading = component => {
  return {
    type: uiActionTypes.CLEAR_LOADING,
    payload: component,
  };
};
export const setErrors = (component, error) => {
  return {
    type: uiActionTypes.SET_ERRORS,
    payload: {
      component,
      error,
    },
  };
};
export const clearErrors = component => {
  return {
    type: uiActionTypes.CLEAR_ERRORS,
    payload: {
      component,
    },
  };
};

export const setProgress = (component, percentage, isUploading) => {
  return {
    type: uiActionTypes.SET_PROGRESS,
    payload: {
      component,
      percentage,
      isUploading,
    },
  };
};
export const clearProgress = component => {
  return {
    type: uiActionTypes.CLEAR_PROGRESS,
    payload: {
      component,
    },
  };
};
