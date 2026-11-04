import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Reschedule {
    appointmentId: string | number;
    newStartTime: string;
    newEndTime: string; 
    action: string;
    reason: string;
    actionBy?: string | number|null;
    actionTime: string;
    id?: string | number;
    otherParticipant?: {
        firstName: string;
        lastName: string;
    };
    otherParticipants?: boolean;
};

interface RescheduleState {
    data: Reschedule[];
    status: 'idle' | 'loading' | 'succeeded' | 'rejected';
    error: string | null;
};

const initialState: RescheduleState = {
    data: [],
    status: 'idle',
    error: null,
};

export const createReschedule = createAsyncThunk('createReschedule/createReschedule',
    async (data: Reschedule, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/appointment_changes`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
          
            console.log('Reschedule response on Appointment changes:', response.data);
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const getAllAppointmentChanges = createAsyncThunk('get all changes/getAllAppointmentChanges',
    async(_, { rejectWithValue }) => {
        try {
            const result = await axios.get(`${API_BASE_URL}/api/appointment_changes`);
            console.log('Response from the backend about appointment change', result.data);
            return result.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

// Fixed the missing 'id' type - using Reschedule interface instead
export const updateAppointmentChange = createAsyncThunk('updatechange/update',
    async(data: Reschedule, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/appointment_changes/${data.id}`, data);
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const deleteAppointmentChange = createAsyncThunk('deletechange/delete',
    async (id: string | number, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/appointment_changes/${id}`);
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    }
);

const rescheduleSlice = createSlice({
    name: 'reschedule',
    initialState, // Using the properly typed initialState
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReschedule.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createReschedule.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(createReschedule.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string || null;
            })
            .addCase(getAllAppointmentChanges.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllAppointmentChanges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(getAllAppointmentChanges.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string || null;
            })
            .addCase(updateAppointmentChange.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAppointmentChange.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex((item) => item.id === action.payload.id);
                if(index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateAppointmentChange.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string || null;
            })
            .addCase(deleteAppointmentChange.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteAppointmentChange.fulfilled, (state, action: PayloadAction<any, string, { arg: string | number }>) => {
                state.status = 'succeeded';
                // Fixed the comparison - we need to compare with the id that was passed to the thunk
                const index = state.data.findIndex((item) => item.id === action.meta.arg);
                if(index > -1) {
                    state.data.splice(index, 1);
                }
            })
            .addCase(deleteAppointmentChange.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string || null;
            })
    },
});

export const { resetStatus } = rescheduleSlice.actions;

export default rescheduleSlice.reducer;