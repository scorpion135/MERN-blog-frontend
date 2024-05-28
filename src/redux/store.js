import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts.js";
import { authReducer } from "./slices/auth.js";
import { commentsReducer } from "./slices/comments.js";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
});

export default store;
