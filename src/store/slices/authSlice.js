import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    role: null, 
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;