import { API_BASE_URL } from '../../config/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: {
    therapistId?: string;
    UserId?: string;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  therapistId: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  therapistId: null,
  token: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
      console.log("Login Response:", {
        fullData: response.data,
        user: response.data.user,
        therapistId: response.data.user?.therapist?.id

      });
      return response.data;
    } catch (err:any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      else {
        return rejectWithValue('An error occurred. Please try again later.');
      }
    }
  }
);
export const changePass = createAsyncThunk(
  'auth/changePass',
  async ({ UserId, oldPassword, newPassword }: { UserId: string; oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/${UserId}/change_password`,
        { oldPassword, newPassword }
      );
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const forgotPass = createAsyncThunk('auth/forgotPass',
  async (credential: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/forgot_password`, credential);
      return response.data;
    }
    catch (error: any) {
      return rejectWithValue(error.response.data || { message: error.message });
    }
  });

// the following is for reset passpassword

export const resetPass = createAsyncThunk(
  'auth/resetPass',
  async (
    { password, confirmPassword, token }: { password: string; confirmPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset_password/${token}`,
        { password, confirmPassword },{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateProfile= createAsyncThunk('auth/updateProfile',
  async (data:{UserId:string,firstName:string,lastName:string,email:string}, { rejectWithValue }) => {
    try{
      const response=await axios.put(`${API_BASE_URL}/api/users/${data.UserId}`,data,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
  }catch(error:any){
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        //To store TherapistId on Local storage if User is Therapist
        state.therapistId = action.payload.user?.therapist?.id;
        localStorage.setItem('TherapistId', action.payload.user?.therapist?.id || '');
        console.log("therapy id stored:", state.therapistId);
        // codes for stora token at local storage when login succesfully 
       if(action.payload.token){
        localStorage.setItem('token',action.payload.token);
        state.token=action.payload.token;
        console.log('this is token after login sucessfully',action.payload.token);
       }

        // To store name of any User logedIn
        const fullName = `${action.payload.user?.firstName || ''} ${action.payload.user?.lastName || ''}`.trim();
        localStorage.setItem('fullName', fullName);
        console.log("full Name stored:", fullName);
        // to save names separately
        localStorage.setItem('firstName', action.payload.user?.firstName || '');
        localStorage.setItem('lastName', action.payload.user?.lastName || '');

        // To store Profile in localStorage
        localStorage.setItem('profileImage', action.payload.user?.profileImage || '');
        console.log("Profile Image stored:", action.payload.user?.profileImage);
        localStorage.setItem('email', action.payload.user?.email || '');
        localStorage.setItem('UserId', action.payload.user?.id || '');
        console.log("Logged UserId:", action.payload.user?.id);

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // forgot pass for authentication

      .addCase(forgotPass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(forgotPass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(forgotPass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // The following are about reset password

      .addCase(resetPass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //logic for changing password
      .addCase(changePass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(changePass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(changePass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  },
});

export default authSlice.reducer;