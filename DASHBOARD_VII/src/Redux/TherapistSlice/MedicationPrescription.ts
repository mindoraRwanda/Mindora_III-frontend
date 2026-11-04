import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

export interface MedicalPrescription{
    id?: string;
    patientId: string;
    therapistId: string;
    medicationId: string;
    dosage: string;
    duration:string;
    startDate:string;
    endDate:string;
    status: string;
    notes:string;
    medication:{
        id:string;
        name: string;
    }
};

interface MedicalPrescriptionState{
    data: MedicalPrescription[],
    status: "idle" | "loading" | "succeeded" | "rejected" ;
    error: string | null
};

const initialState: MedicalPrescriptionState = {
    data: [],
    status: 'idle',
    error: null
};
// getting all specifc patients for Therapits


export const createPrescription=createAsyncThunk('createPrescription',
    async(data:MedicalPrescription,{rejectWithValue})=>{
        try{
            const response=await axios.post(`${API_BASE_URL}/api/medication-prescriptions`,data);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const fetchAllPrescription=createAsyncThunk('fetchAllPrescription',
    async (_,{rejectWithValue})=>{
        try{
            const response=await axios.get(`${API_BASE_URL}/api/medication-prescriptions`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const updatePrescription=createAsyncThunk('updatePrescription',
    async(data:MedicalPrescription,{rejectWithValue})=>{
        try{
            const response=await axios.put(`${API_BASE_URL}/api/medication-prescriptions/${data.id}`,data);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

export const deletePrescription=createAsyncThunk('delete',
    async(id:string,{rejectWithValue})=>{
        try{
            await axios.delete(`${API_BASE_URL}/api/medication-prescriptions/${id}`);
            return id;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

const medicalPrescriptionSlice=createSlice({
    name:'medication_prescription',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
       .addCase(fetchAllPrescription.pending,(state)=>{
        state.status='loading';
       })
       .addCase(fetchAllPrescription.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.data=action.payload;
        })
        .addCase(fetchAllPrescription.rejected,(state,action)=>{
            state.status='rejected';
            console.log(action.payload);
        })
        .addCase(createPrescription.pending,(state)=>{
            state.status='loading';
        })
        .addCase(createPrescription.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.data=[...state.data, action.payload];
        })
        .addCase(createPrescription.rejected,(state,action)=>{
            state.status='rejected';
            console.log(action.payload);
        })
        .addCase(updatePrescription.pending,(state)=>{
            state.status='loading';
        })
        .addCase(updatePrescription.fulfilled,(state,action)=>{
            state.status='succeeded';
            const updatedPrescriptions=state.data.map(prescription=>prescription.id===action.payload.id?action.payload:prescription);
            state.data=updatedPrescriptions;
        })
        .addCase(updatePrescription.rejected,(state,action)=>{
            state.status='rejected';
            console.log(action.payload);
        })
        .addCase(deletePrescription.pending,(state)=>{
            state.status='loading';
        })
        .addCase(deletePrescription.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.data=state.data.filter(prescription=>prescription.id!==action.payload);
        })
        .addCase(deletePrescription.rejected,(state,action)=>{
            state.status='rejected';
            console.log(action.payload);
        })
       
    }
})

export default medicalPrescriptionSlice.reducer;