import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getPostReport = createAsyncThunk('get/reports',
    async(postId,{rejectWithValue})=>{
        try {
            const response = await axios.get(`${API_BASE_URL}/api/post-report/post/${postId}`);
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
)
  