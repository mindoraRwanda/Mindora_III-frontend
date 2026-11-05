import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface CommunityPost{
    id?: string;
    communityId: string;
    userId: string;
    content: string;
    postId: string;
}

interface CommunityPostState{
        posts: CommunityPost[];
        status: 'idle' | 'loading' | 'succeeded' | 'rejected';
        error: string | null;
    
}

const initialState: CommunityPostState = {
    posts: [],
    status: 'idle',
    error: null
}
export const getAllCommunityPost=createAsyncThunk("getPost",
    async(__,{rejectWithValue})=>{
        const token=localStorage.getItem('token');
        try{
            const response=await axios.get(`${API_BASE_URL}/api/posts`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error as Error);
        }
    }
);
export const deletePots=createAsyncThunk('deletePsot',
    async(id: string | number, {rejectWithValue})=>{
        try{
            await axios.delete(`${API_BASE_URL}/api/posts/${id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return id;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const UpdatePost=createAsyncThunk('UpdatePost',
    async({id,postData}:{id:string,postData:Partial<CommunityPost>},{rejectWithValue})=>{
        try{
            const response=await axios.put(`${API_BASE_URL}/api/posts/${id}`,postData,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }

    }
);
const communityPostSlice=createSlice({
    name:'communityPost',
    initialState,
    reducers:{},
    extraReducers:(build) => build
    .addCase(getAllCommunityPost.pending, (state) => {
        state.status='loading';
    })
    .addCase(getAllCommunityPost.fulfilled, (state, action) => {
        state.status='succeeded';
        state.posts=action.payload;
    })
    .addCase(getAllCommunityPost.rejected, (state, action) => {
        state.status='rejected';
        state.error=action.payload as string | null;
    })
    .addCase(deletePots.pending,(state)=>{
        state.status='loading';
    })
    .addCase(deletePots.fulfilled,(state,action) => {
        state.status='succeeded';
        state.posts=state.posts.filter(post=>post.id!==action.payload);
    })
    .addCase(deletePots.rejected,(state,action) => {
        state.status='rejected';
        state.error=action.payload as string | null;
    })
    .addCase(UpdatePost.pending,(state)=>{
        state.status='loading';
    })
    .addCase(UpdatePost.fulfilled,(state,action) => {
        state.status='succeeded';
        const postIndex=state.posts.findIndex(post=>post.id===action.payload.id);
        if(postIndex>-1){
            state.posts[postIndex]=action.payload;
        }
    })
    .addCase(UpdatePost.rejected,(state,action) => {
        state.status='rejected';
        state.error=action.payload as string | null;
    })
});
export default  communityPostSlice.reducer;