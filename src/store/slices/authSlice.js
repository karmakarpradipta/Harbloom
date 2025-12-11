import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { account, databases } from "@/lib/appwrite";
import { ID } from "appwrite";

// Async Thunks
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      return rejectWithValue(null); // No user logged in is not necessarily an error state for the app, just null user
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await account.createEmailPasswordSession({ email, password });
      const user = await account.get();
      return user;
    } catch (error) {
      console.error("Login failed:", error); // Keep logging for debugging
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      // Create account
      await account.create(ID.unique(), email, password, name);

      // Auto login
      await account.createEmailPasswordSession(email, password);

      // Get logged in user
      const user = await account.get();

      // Create user document
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID_USERS,
        ID.unique(),
        {
          $id: user.$id,
          name,
          email,
        }
      );

      return user;
    } catch (error) {
      console.error("Signup failed:", error);
      return rejectWithValue(error?.message || "Signup failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession({ sessionId: "current" });
      return null;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const updateUserName = createAsyncThunk(
  "auth/updateName",
  async ({ name }, { rejectWithValue }) => {
    try {
      await account.updateName(name);
      const user = await account.get();
      return user;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update name");
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ newPassword, oldPassword }, { rejectWithValue }) => {
    try {
      await account.updatePassword(newPassword, oldPassword);
      return;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update password");
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async ({ avatarUrl }, { rejectWithValue }) => {
    try {
      const user = await account.get();
      const prefs = user.prefs || {};
      await account.updatePrefs({ ...prefs, avatar: avatarUrl });
      const updatedUser = await account.get(); // Get fresh user with new prefs
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update avatar");
    }
  }
);

export const removeUserAvatar = createAsyncThunk(
  "auth/removeAvatar",
  async (_, { rejectWithValue }) => {
    try {
      const user = await account.get();
      const prefs = user.prefs || {};
      // Set avatar to null to remove it
      await account.updatePrefs({ ...prefs, avatar: null });
      const updatedUser = await account.get();
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove avatar");
    }
  }
);

// Email Verification
export const sendEmailVerification = createAsyncThunk(
  "auth/sendVerification",
  async (_, { rejectWithValue }) => {
    try {
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );
      return;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to send verification email"
      );
    }
  }
);

export const completeEmailVerification = createAsyncThunk(
  "auth/completeVerification",
  async ({ userId, secret }, { rejectWithValue }) => {
    try {
      await account.updateVerification(userId, secret);
      const user = await account.get();
      return user;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to verify email");
    }
  }
);

// Password Recovery
export const sendPasswordRecovery = createAsyncThunk(
  "auth/sendRecovery",
  async ({ email }, { rejectWithValue }) => {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      return;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send recovery email");
    }
  }
);

export const completePasswordRecovery = createAsyncThunk(
  "auth/completeRecovery",
  async ({ userId, secret, password, passwordAgain }, { rejectWithValue }) => {
    try {
      await account.updateRecovery(userId, secret, password, passwordAgain);
      return;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reset password");
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start true to check auth on mount
  error: null,
  message: null, // For success messages like "Email sent"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(updateUserName.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Password
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "Avatar updated successfully!";
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeUserAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "Avatar removed successfully!";
      })
      .addCase(removeUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Email Verification
      .addCase(sendEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.loading = false;
        state.message = "Verification email sent successfully!";
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "Email verified successfully!";
      })
      .addCase(completeEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Password Recovery
      .addCase(sendPasswordRecovery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendPasswordRecovery.fulfilled, (state) => {
        state.loading = false;
        state.message = "Password recovery email sent!";
      })
      .addCase(sendPasswordRecovery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completePasswordRecovery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completePasswordRecovery.fulfilled, (state) => {
        state.loading = false;
        state.message = "Password reset successfully! Please login.";
      })
      .addCase(completePasswordRecovery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
