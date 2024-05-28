import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async () => {
    const { data } = await axios.get("/comments");

    return data;
  }
);

export const fetchAllComments = createAsyncThunk(
  "comments/fetchAllComments",
  async () => {
    const { data } = await axios.get("/comments/all");

    return data;
  }
);

export const fetchPostComments = createAsyncThunk(
  "comments/fetchPostComments",
  async (id) => {
    const { data } = await axios.get(`/comments/${id}`);

    return data;
  }
);

export const fetchRemoveComments = createAsyncThunk(
  "posts/fetchRemoveComments",
  async (id) => await axios.delete(`/comments/${id}`)
);

const initialState = {
  allComments: {
    items: [],
    status: "loading",
  },
  postComments: {
    items: [],
    status: "loading",
  },
  allPostsComments: {
    items: [],
    status: "loading",
  },
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // deleteComments: (state, action) => {
    //   state.allComments.items = state.allComments.items.filter(
    //     (obj) => obj.post !== action.payload
    //   );
    // },
  },
  extraReducers: {
    // Получение комментариев
    [fetchComments.pending]: (state) => {
      state.allComments.items = [];
      state.allComments.status = "loading";
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.allComments.items = action.payload;
      state.allComments.status = "loaded";
    },
    [fetchComments.rejected]: (state) => {
      state.allComments.items = [];
      state.allComments.status = "error";
    },
    //
    [fetchPostComments.pending]: (state) => {
      state.postComments.items = [];
      state.postComments.status = "loading";
    },
    [fetchPostComments.fulfilled]: (state, action) => {
      state.postComments.items = action.payload;
      state.postComments.status = "loaded";
    },
    [fetchPostComments.rejected]: (state) => {
      state.postComments.items = [];
      state.postComments.status = "error";
    },

    // Удаление комментариев
    [fetchRemoveComments.pending]: (state, action) => {
      state.allComments.items = state.allComments.items.filter(
        (obj) => obj.post !== action.meta.arg
      );
    },

    // Получение всех комментариев
    [fetchAllComments.pending]: (state) => {
      state.allPostsComments.items = [];
      state.allPostsComments.status = "loading";
    },
    [fetchAllComments.fulfilled]: (state, action) => {
      state.allPostsComments.items = action.payload;
      state.allPostsComments.status = "loaded";
    },
    [fetchAllComments.rejected]: (state) => {
      state.allPostsComments.items = [];
      state.allPostsComments.status = "error";
    },
  },
});

export const commentsReducer = commentsSlice.reducer;
