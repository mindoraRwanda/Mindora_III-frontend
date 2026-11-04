import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
interface Service{
    id?: string;
    name: string;
    description: string;
}

interface ServiceState {
    services: Service[];
    status: "idle" | "loading" | "succeeded" | "rejected" ;
    error: string | null;
}

const initialState: ServiceState = {
    services: [],
    status: "idle",
    error: null,
};

export const getAllService=createAsyncThunk('getAllService',
    async (_,{rejectWithValue})=>{
        try{
            const response=await axios.get(`${API_BASE_URL}/api/services`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
const ServiceSlice=createSlice({
    name:"Services",
    initialState,
    reducers:{},
    extraReducers:builder=>builder
       .addCase(getAllService.pending, (state) => {
            state.status = "loading";
        })
       .addCase(getAllService.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.services = action.payload;
        })
       .addCase(getAllService.rejected, (state, action) => {
            state.status = "rejected";
            state.error = action.payload as string;
        })
})

export default ServiceSlice.reducer;