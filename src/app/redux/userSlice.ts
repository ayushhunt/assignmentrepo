'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { name, email } = action.payload;
      state.name = name;
      state.email = email;
      state.isAuthenticated = true;
    },
    logoutUser(state) {
      state.name = '';
      state.email = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
