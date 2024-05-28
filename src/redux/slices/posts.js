import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");

  return data;
});

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");

  return data;
});

export const fetchPostsFromTag = createAsyncThunk(
  "posts/fetchPostsFromTag",
  async (tag) => {
    const { data } = await axios.get(`/tags/${tag}`);

    return data;
  }
);

export const fetchPopularPosts = createAsyncThunk(
  "posts/fetchPopularPosts",
  async () => {
    const { data } = await axios.get("/posts/popular");

    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => await axios.delete(`/posts/${id}`)
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    // Получение постов
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },

    // Получение тэгов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    // Удаление постов
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
    // Сортировка статей
    [fetchPopularPosts.pending]: (state) => {
      state.posts.items = [];
      state.tags.status = "loading";
    },
    [fetchPopularPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchPopularPosts.rejected]: (state) => {
      state.posts.items = [];
      state.tags.status = "error";
    },
    // Получение статей по тегу
    [fetchPostsFromTag.pending]: (state) => {
      state.posts.items = [];
      state.tags.status = "loading";
    },
    [fetchPostsFromTag.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchPostsFromTag.rejected]: (state) => {
      state.posts.items = [];
      state.tags.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;
