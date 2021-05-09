import { uiActionTypes } from "../actions/types";
const initialState = {
  errors: {},
  loading: {},
  progress: {},
};
export default function uiReducer(state = initialState, action) {
  var modifiedLoading = null;
  var modifiedErrors = null;
  var modifiedProgress = null;
  switch (action.type) {
    case uiActionTypes.SET_LOADING:
      modifiedLoading = { ...state.loading };
      modifiedLoading[action.payload] = true;
      return {
        ...state,
        loading: modifiedLoading,
      };
    case uiActionTypes.CLEAR_LOADING:
      modifiedLoading = { ...state.loading };
      modifiedLoading[action.payload] = false;
      return {
        ...state,
        loading: modifiedLoading,
      };
    case uiActionTypes.SET_ERRORS:
      modifiedErrors = { ...state.errors };
      modifiedErrors[action.payload.component] = action.payload.error;
      return {
        ...state,
        errors: modifiedErrors,
      };
    case uiActionTypes.CLEAR_ERRORS:
      modifiedErrors = { ...state.errors };
      delete modifiedErrors[action.payload.component];
      return {
        ...state,
        errors: modifiedErrors,
      };
    case uiActionTypes.SET_PROGRESS:
      modifiedProgress = { ...state.progress };
      modifiedProgress[action.payload.component] = { percentage: action.payload.percentage, isUploading: action.payload.isUploading };
      return {
        ...state,
        progress: modifiedProgress,
      };
    case uiActionTypes.CLEAR_PROGRESS:
      modifiedProgress = { ...state.progress };
      delete modifiedProgress[action.payload.component];
      return {
        ...state,
        progress: modifiedProgress,
      };
    default:
      return state;
  }
}
