import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface TreatmentPlan {
    id?: string;
    patientId: string;
    therapistId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    patient?: {
        medicalProfile: {
            conditions: string;
        };
    };
}

interface TreatmentState {
    data: TreatmentPlan[];
    selectedPlan?: TreatmentPlan;
    loading: boolean;
    status: "idle" | "loading" | "succeeded" | "rejected";
    error: string | null;
    treatmentPlanId?: string;
    
}

const initialState: TreatmentState = {
    data: [],
    loading: false,
    status: "idle",
    error: null
}

export const createPlan = createAsyncThunk(
    'createPlan/create',
    async (data: TreatmentPlan, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/treatment_plans`,
                data,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.message);
        }
    }
);

//   logic for getting all treatmentPlan

export const getAllTreatmentPlan = createAsyncThunk("getAllTreatmentPlan/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/treatment_plans`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.message);
        }
    }
);

// Logics for getting TreatmentPlan by ID
export const getTreatmentPlanById = createAsyncThunk('getTreatmentPlanById/getSingle',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/treatment_plans/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Fetched Treatment Plan by ID:', response.data);
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.message);
        }
    }
);
// Logics for deleting TreatmentPlans
export const deleteTreatmentPlan = createAsyncThunk('deletePlan/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/treatment_plans/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err:any) {
            return rejectWithValue(err.message);
        }
    }
);

// Logics for updating TreatmentPlans

export const updateTreatmentPlan = createAsyncThunk('UpdateTreatment/Update',
    async (data: { id: string; updateTreatmentData: TreatmentPlan }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/treatment_plans/${data.id}`, data.updateTreatmentData,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err:any) {
            return rejectWithValue(err.message);
        }
    }
);

const treatmentPlanSlice = createSlice({
    name: 'treatmentPlan',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPlan.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data.push(action.payload);
                const treatmentPlanId = action.payload?.id || action.payload?.treatmentPlanId;
                if (treatmentPlanId) {
                    state.treatmentPlanId = treatmentPlanId;
                    localStorage.setItem('treatmentPlanId', treatmentPlanId);
                    console.log('Saved treatmentPlanId:', treatmentPlanId);
                }
            })
            .addCase(createPlan.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getAllTreatmentPlan.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })

            .addCase(getAllTreatmentPlan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getAllTreatmentPlan.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(deleteTreatmentPlan.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteTreatmentPlan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter(item => item.id !== action.payload.id);
            })
            .addCase(deleteTreatmentPlan.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(updateTreatmentPlan.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateTreatmentPlan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex(data => data.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            .addCase(updateTreatmentPlan.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(getTreatmentPlanById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getTreatmentPlanById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedPlan = action.payload;
            })
            .addCase(getTreatmentPlanById.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })

            .addCase(resetStatus, (state) => {
                state.status = 'idle';
                state.error = null;
            });
    },
});

export const { resetStatus } = treatmentPlanSlice.actions;
export default treatmentPlanSlice.reducer;