'use client'
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice' // This will manage user state

const store = configureStore({
  reducer: {
    user: userReducer,  // Register the user slice in the store
  },
});

export default store;
