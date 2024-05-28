import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios.js";

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");

  return data;
});

export const fetchAuthRegister = createAsyncThunk(
  "auth/fetchAuthRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);

    return data;
  }
);

export const fetchAuthLogin = createAsyncThunk(
  "auth/fetchAuthLogin",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);

    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchAuthLogin.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuthLogin.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthLogin.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthMe.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchAuthRegister.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuthRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthRegister.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
