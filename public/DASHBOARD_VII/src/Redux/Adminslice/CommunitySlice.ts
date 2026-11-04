import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface CommunityDetailsProps {
    visible: boolean;
    onClose: () => void;
    communityId: string | number;
   
  }
  export interface Member {
    id: string | number;
    username: string;
    UserCommunity?: {
      role?: string;
      status?: string;
    };
  }

  export interface CommunityFormValues {
    name: string;
    description: string;
    isPrivate: boolean;
    // other form fields
  }
interface Community {
    id?: string;
    moderatorId?: string;
    name: string;
    description: string;
    isPrivate?: boolean;
    profile?: File | string;
    members?: Member[];
    // posts?: Post[];
}
interface CommunityState {
    communities: Community[];
    selectedCommunity: Community | null;
    status: 'idle' | 'loading' | 'succeeded' | 'rejected';
    error: string | null;
}
const initialState: CommunityState = {
    communities: [],
    selectedCommunity: null,
    status: 'idle',
    error:null,
};

export const createCommunity = createAsyncThunk('createCommunity/create',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const token=localStorage.getItem('token');
            const response = await axios.post<Community>(`${API_BASE_URL}/api/support-communities`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            console.log("data catched:", response);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    }
);

export const getAllcommunity = createAsyncThunk("getAll/getAllCommunity",
    async (__, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/support-communities`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log("data to be displayed", response.data);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    });
export const GetCommunityById = createAsyncThunk('GetCommunityById',
    async (id:string|number, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/support-communities/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    }
);
export const UpdateCommunity = createAsyncThunk('UpdateCommunity/update',
    async ({ id, CommunityData }: { id: string, CommunityData: Partial<Community> }, { rejectWithValue }) => {
        try {
            const response = await axios.put<Community>(`${API_BASE_URL}/api/support-communities/${id}`, CommunityData,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            }
            );
            console.log("data to be updated", response.data);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    });
export const deleteCommunity = createAsyncThunk('deleteCommunity/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/support-communities/${id}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            console.log("data to be deleted", response.data);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    }
);

const CommunityGroup = createSlice({
    name: 'communityGroup',
    initialState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(createCommunity.pending, (state) => {
            state.status = 'loading';
        })
        build.addCase(createCommunity.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.communities.push(action.payload);
        })
        build.addCase(createCommunity.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload as string;
        })

        build.addCase(getAllcommunity.pending, (state) => {
            state.status = 'loading';
        })
        build.addCase(getAllcommunity.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.communities = action.payload;
        })
        build.addCase(getAllcommunity.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload as string;
        })
        build.addCase(GetCommunityById.pending, (state) => {
            state.status = 'loading';
        })
        build.addCase(GetCommunityById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.selectedCommunity = action.payload;
        })
        build.addCase(GetCommunityById.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload as string;
        })

        build.addCase(deleteCommunity.pending, (state) => {
            state.status = 'loading';
        })
        build.addCase(deleteCommunity.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.communities = state.communities.filter((community) => community.id !== action.payload);
        })
        build.addCase(deleteCommunity.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload as string;
        })
        build.addCase(UpdateCommunity.pending, (state) => {
            state.status = 'loading';
        })
        build.addCase(UpdateCommunity.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const index = state.communities.findIndex(comm => comm.id === action.payload.id);
            if (index !== -1) {
                state.communities[index] = action.payload;
            }
        })
        build.addCase(UpdateCommunity.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload as string;
        })
    }
})
export default CommunityGroup.reducer;