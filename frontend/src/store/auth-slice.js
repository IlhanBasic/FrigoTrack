import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      if (!action.payload || !action.payload.user) {
        console.error("Invalid payload for setUser", action.payload);
        return;
      }

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.user?.role === "admin";
    },
    logout(state) {
      Object.assign(state, initialState);
      fetch(`${import.meta.env.VITE_API_URL}/users/logout`, { method: "GET", credentials: "include" });
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;