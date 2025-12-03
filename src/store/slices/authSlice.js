import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



// const signInUser = createAsyncThunk(
//   "auth/signInUser",
//   async (credentials, thunkAPI) => {
//     try {
//       const response = await fetch(`${import.meta.VITE_AUTH_SERVICE_URL}/signin`, {
//         method: "POST",
//         headers: {  
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentials),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         return data;
//       } else {
//         return thunkAPI.rejectWithValue(data.message);
//       }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// ) 


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
    updateProfile: (state, action) => {
      console.log("While Updating The Profile ==> " + state);
      console.log(action);
      
      
      state.user = { ...action.payload};
      
    } ,
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout  , updateProfile} = authSlice.actions;
export default authSlice.reducer;