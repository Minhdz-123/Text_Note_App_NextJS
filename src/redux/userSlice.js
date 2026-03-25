import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, providers } from "@/src/lib/firebase";

export const LoginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, providers.google);
      const user = result.user;

      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      dispatch(setUser(userData));
      return userData;
    } catch (error) {
      if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user"
      ) {
        return rejectWithValue("Sign-in cancelled");
      }
      console.error("Google login failed:", error);
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { user } = getState();
      if (user.status === "loading") {
        return false;
      }
    },
  },
);

export const Logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error("Logout failed:", error);
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUser: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(LoginWithGoogle.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(LoginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.status = "idle";
        state.userInfo = null;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
