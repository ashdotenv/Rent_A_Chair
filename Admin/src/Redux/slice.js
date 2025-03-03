import { createSlice } from "@reduxjs/toolkit";

const getLoginStatus = Boolean(localStorage.getItem("loggedIn")) || false;
export const serviceSlice = createSlice({
  initialState: {
    loggedInStatus: getLoginStatus,
  },
  name: "service",
  reducers: {},
});

export const {} = serviceSlice.actions;

export default serviceSlice.reducer;
