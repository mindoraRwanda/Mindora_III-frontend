import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

interface comments{
    id?: string;
    postId: string;

}

interface commentState{
    data: comments[],
    status: "idle" | "loading" | "succeeded" | "rejected" ;
    error: string | null;
}

const initialState: commentState = {
    data: [],
    status: "idle",
    error: null
};

export const fetchPostCommnet=createAsyncThunk('fetchCommnet',
    async (postId: string) => {
        try {
            const response = await axios.get<comments[]>(
                `${API_BASE_URL}/api/post/${postId}/comments`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                   
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    }
);
export const updateComment=createAsyncThunk('updateComment',
    async({id,commentData}:{id:string,commentData:FormData},{rejectWithValue})=>{
        try{
            const response=await axios.put(`${API_BASE_URL}/api/post/comments/${id}`,commentData);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

export const deleteComment=createAsyncThunk('deleteComment',
    async(commentId:string,{rejectWithValue})=>{
        try{
            const response=await axios.delete(`${API_BASE_URL}/api/post/comments/${commentId}`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

const CommentSlice=createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers:(builder)=> {
       builder
       .addCase(fetchPostCommnet.pending,(state)=>{
            state.status='loading';
        })
        .addCase(fetchPostCommnet.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.data=action.payload;
        })
        .addCase(fetchPostCommnet.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload as string;
            console.log("comment not visible",action.payload);
        })
        .addCase(deleteComment.pending,(state)=>{
            state.status='loading';
        })
        .addCase(deleteComment.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.data=state.data.filter(comment=>comment.id!==action.payload);
        })
        .addCase(deleteComment.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload as string;
            console.log("comment not deleted",action.payload);
        })
    }
 });
export default  CommentSlice.reducer;
