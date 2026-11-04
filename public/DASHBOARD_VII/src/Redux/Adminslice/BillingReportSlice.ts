import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios  from "axios";

export interface Reports {
    id: string;
    startDate: string;
    endDate: string;
    totalRevenue: number;
    approvedInsuranceClaims: number;
    pendingInsuranceClaims: number;
    rejectedInsuranceClaims: number;
    totalOutstandingBalance: number;
    updatedAt: string;
    // ... other properties if needed
  }

interface ReportsState{
    data: Reports[],
    status: "idle" | "loading" | "succeeded" | "rejected" ;
}

const initialState: ReportsState = {
    data: [],
    status: "idle"
};

export const createBillReport=createAsyncThunk<any, {startDate: string, endDate: string}>("createBillReport",
    async (formData, {rejectWithValue})=>{
        try{
            const response = await axios.post(`${API_BASE_URL}/api/billing-reports`, formData);
            return response.data;
        } catch(error:any){
            return rejectWithValue(error.message);
        }
    });
    export const getBillingReports=createAsyncThunk('getall',
        async (_, { rejectWithValue }) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/billing-reports`);
                return response.data;
            } catch (error:any) {
                return rejectWithValue(error.message);
            }
        }
    );
    export const updateBillReport=createAsyncThunk<any, {id: string} & Partial<Reports>>("editBillReport",
        async (formData:{id:string}, {rejectWithValue})=>{
            try{
                const response=await axios.put(`${API_BASE_URL}/api/billing-reports/${formData.id}`,formData);
                return response.data;
            }
            catch(error:any){
                return rejectWithValue(error.message);
            }

        });
    export const deleteBillReport=createAsyncThunk("deleteBillReport",
        async (id:number, {rejectWithValue})=>{
            try{
                const response=await axios.delete(`${API_BASE_URL}/api/billing-reports/${id}`);
                return response.data;
            }
            catch(error:any){
                return rejectWithValue(error.message);
            }
        })

    const BillingReports=createSlice({
        name:"BillingReports",
        initialState,
        reducers:{},
        extraReducers:builder=>{
            builder
            .addCase(createBillReport.pending,(state)=>{
                state.status="loading";
            })
            .addCase(createBillReport.fulfilled,(state,action)=>{
                state.status="succeeded";
                state.data=[...state.data, action.payload];
            })
            .addCase(createBillReport.rejected,(state,action)=>{
                state.status="rejected";
                console.log(action.payload);
            })
            .addCase(getBillingReports.pending,(state)=>{
                state.status="loading";
            })
            .addCase(getBillingReports.fulfilled,(state,action)=>{
                state.status="succeeded";
                state.data=action.payload;
            })
            .addCase(getBillingReports.rejected,(state,action)=>{
                state.status="rejected";
                console.log(action.payload);
            })
            .addCase(updateBillReport.pending, (state)=>{
                state.status="loading";
            })
            .addCase(updateBillReport.fulfilled, (state,action)=>{
                state.status="succeeded";
                state.data=state.data.map(report=>report.id===action.payload.id? action.payload : report);
            })
            .addCase(updateBillReport.rejected,(state,action)=>{
                state.status="rejected";
                console.log('Update Failed',action.payload);
            })
            .addCase(deleteBillReport.pending,(state)=>{
                state.status="loading";
            })
            .addCase(deleteBillReport.fulfilled,(state,action)=>{
                state.status="succeeded";
                state.data=state.data.filter(report=>report.id!==action.payload);
            })
            .addCase(deleteBillReport.rejected,(state,action)=>{
                state.status="rejected";
                console.log('Delete Failed',action.payload);
            })
        }

    })
    export default BillingReports.reducer;