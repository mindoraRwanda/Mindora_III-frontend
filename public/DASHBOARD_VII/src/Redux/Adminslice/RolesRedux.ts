import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
 export interface Role {
        id:string;
        name: string;
        permissions: string[];
    }
    
    interface RolesState {
        roles: Role[];
        loading: boolean;
        error: string | null;
        status: "idle" | "loading" | "succeeded" | "failed";
    }
    
    const initialState: RolesState = {
        roles: [],
        loading: false,
        error: null,
        status: "idle",
    };
    
    export const fetchAllRoles = createAsyncThunk('roles/fetchRoles', async () => {
        const response = await axios.get(`${API_BASE_URL}/api/roles`);
        return response.data;   
    });
    
    const rolesSlice = createSlice({
        name: 'roles',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(fetchAllRoles.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                    state.status = 'loading';
                })
                .addCase(fetchAllRoles.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.loading = false;
                    state.roles = action.payload;
                })
                .addCase(fetchAllRoles.rejected, (state, action) => {
                    state.status = 'failed';
                    state.loading = false;
                    state.error = action.error.message || 'Failed to fetch roles';
                });
        },
    });
    export default rolesSlice.reducer;