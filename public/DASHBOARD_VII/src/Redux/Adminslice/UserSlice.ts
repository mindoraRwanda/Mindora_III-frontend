import { API_BASE_URL } from '../../config/api';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
    users: any[];
    selectedUser: null | object;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface User{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    role?: string;
    lastLogin?: string;
}

const initialState: UserState = {
    users:[],
    selectedUser: null,
    status: 'idle',
    error: null,
};
export const selectedTotalUser=(state:{users:UserState})=>state.users.users.length;
export const NewUser = createAsyncThunk(
    'users/NewUser',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://mindora-backend-beta-version.onrender.com/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
            });
            console.log('New User Response:', response.data);
            return response.data;
        }
        catch (error:any) {
            return rejectWithValue(error.response?.data || error.response);
        }
    }
);

// featch only single user by using ID.

export const featchUserById = createAsyncThunk('user/featchUserById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Fetched User by ID:', response.data);
            return response.data;
        }
        catch (error:any) {
            return rejectWithValue(error.response?.data || "Unexpected error");
        }
    }
);



export const GetAllUsers = createAsyncThunk('User/GetAllUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/users`,{
            headers: {
                Authorization: 'Bearer '+ localStorage.getItem('token'),
            }
        });
        return response.data;
        console.log('All Users Fetched:', response.data);
    }
    catch (error:any) {
        return rejectWithValue(error.response?.data || "Unexpected error");
    }
}
);

export const deleteUser = createAsyncThunk('users/deleteUser',
    async (id: string, { rejectWithValue }) => {
        console.log("User deleted");
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/users/${id}`,{
                headers: {
                    Authorization: 'Bearer '+ localStorage.getItem('token'),
                }
            });
            return response.data;
        }
        catch (error:any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateUser = createAsyncThunk('Users/updateUser',
    async ({ id, credentials }:{id:string,credentials:any}, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://mindora-backend-beta-version.onrender.com/api/users/${id}`, credentials,{
                headers: {
                    Authorization: 'Bearer '+ localStorage.getItem('token'),
                },
            });
            return response.data;
        }
        catch (error:any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const changeRole = createAsyncThunk('User/changeRole',
    async ({ id, credentials }:{id:string,credentials:any}, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/users/${id}`, credentials,{
                headers: {
                    Authorization: 'Bearer '+ localStorage.getItem('token'),
                },
            });
            return response.data;
        }
        catch (error:any) {
            return rejectWithValue(error.response.data);
        }
    });

    export const changeProfilePicture=createAsyncThunk('changeProfle',
        async({id,formData}:{id:string,formData:FormData},{rejectWithValue}) => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/upload/${id}`,formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                return response.data;
            }
            catch (error:any) {
                return rejectWithValue(error.response.data);
            }
          
        });




const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(NewUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(NewUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users.push(action.payload);
            })
            .addCase(NewUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // the following slice is about fetching single user by ID

            .addCase(featchUserById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(featchUserById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedUser = action.payload;
            })
            .addCase(featchUserById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // the following are for Getting all user in System
            .addCase(GetAllUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(GetAllUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(GetAllUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // the following are for deleting User

            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // the following slice is about updataing users

            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index > -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // change the Role of User
            .addCase(changeRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(changeRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index > -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(changeRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(changeProfilePicture.pending,(state)=>{
                state.status='loading';
            })
            .addCase(changeProfilePicture.fulfilled,(state,action)=>{
                state.status='succeeded';
                state.selectedUser=action.payload as object;
            })
            .addCase(changeProfilePicture.rejected, (state,action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

    }
});
export default userSlice.reducer;