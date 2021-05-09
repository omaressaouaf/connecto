import { postActionTypes } from "../actions/types";
const initialState = {
  posts: [],
  currentPost: null,
  // i defined the single post to avoid the loading error : (cannot read property user of undefined)
  singlePost: {
    user: {},
    comments: [],
  },
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case postActionTypes.RESET_POSTS:
      return {
        ...state,
        posts: [],
      };
    case postActionTypes.FETCH_POSTS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
      };
    case postActionTypes.ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case postActionTypes.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        singlePost: state.singlePost && action.payload === state.singlePost.id ? null : state.singlePost,
      };

    case postActionTypes.LOAD_CURRENT_POST:
      return {
        ...state,
        currentPost: action.payload,
      };
    case postActionTypes.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          return post.id === action.payload.id ? { ...post, body: action.payload.body, image: action.payload.image } : post;
        }),
        singlePost: state.singlePost && action.payload.id === state.singlePost.id ? { ...state.singlePost, body: action.payload.body } : state.singlePost,
        currentPost: null,
      };
    case postActionTypes.FETCH_SINGLE_POST:
      return {
        ...state,
        singlePost: action.payload,
      };
    case postActionTypes.ADD_COMMENT:
      return {
        ...state,
        singlePost: {
          ...state.singlePost,
          commentCount: action.payload.firstTimeListeningToChanges ? state.singlePost.commentCount : state.singlePost.commentCount + 1,
          comments: [action.payload.comment, ...state.singlePost.comments],
        },
      };
    case postActionTypes.DELETE_COMMENT:
      return {
        ...state,
        singlePost: {
          ...state.singlePost,
          commentCount: state.singlePost.commentCount - 1,
          comments: state.singlePost.comments.filter(comment => comment.id !== action.payload),
        },
      };

    case postActionTypes.TOGGLE_LIKE: {
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.payload) {
            return post.likedByLoggedUser
              ? { ...post, likeCount: post.likeCount - 1, likedByLoggedUser: false }
              : { ...post, likeCount: post.likeCount + 1, likedByLoggedUser: true };
          }
          return post;
        }),
        singlePost:
          state.singlePost && state.singlePost.id === action.payload
            ? state.singlePost.likedByLoggedUser
              ? { ...state.singlePost, likeCount: state.singlePost.likeCount - 1, likedByLoggedUser: false }
              : { ...state.singlePost, likeCount: state.singlePost.likeCount + 1, likedByLoggedUser: true }
            : state.singlePost,
      };
    }
    default:
      return state;
  }
}
