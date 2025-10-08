import { createSlice } from "@reduxjs/toolkit";
import { User } from "../@types";

interface UserState {
  currentUser: User | null;
  isNewUser: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isNewUser: false,
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    setUser(state, action) {
      state.currentUser = { ...state.currentUser, ...action.payload.user };
      state.isNewUser = action.payload.isNewUser;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isNewUser = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
