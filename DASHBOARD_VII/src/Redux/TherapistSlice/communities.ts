import axions from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCommunities = createAsyncThunk('get/allcommunities',
    async(_,{rejectWithValue})=>{
        try {
            const response = await axions.get('/communities/getAllCommunities');
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response.data);
        }
    })