import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

interface Messages {
    id?: string;
    sender: string;
    recipient: string;
    content: string;
    timestamp: string;
}

interface MessagesState {
    messages: Messages[],
    messageCount: number,
    loading: boolean;
    status: "idle" | "loading" | "succeeded" | "rejected" ;
    error: string | null
}

const initialState: MessagesState = {
    messages: [],
    messageCount: 0,
    loading: false,
    status: "idle",
    error: null
}

export const fetchMessages=createAsyncThunk('getMessages',
    async(_,{rejectWithValue})=>{
        try{
            const response=await axios.get(`${API_BASE_URL}/api/messages`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
       .addCase(fetchMessages.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
       .addCase(fetchMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.messages = action.payload;
            state.messageCount = action.payload.length;
        })
       .addCase(fetchMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
})

export default messagesSlice.reducer;