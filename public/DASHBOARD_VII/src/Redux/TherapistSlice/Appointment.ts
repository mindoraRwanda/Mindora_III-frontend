import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  appointmentType: string;
  status: string;
  notes: string;
  patientId: string;
  component?: React.ReactNode;
  patient?: {
    user: {
      firstName: string;
      lastName: string;
    };
    personalInformation: {
      gender: string;
    };
    emergencyContact?: {
      name: string;
      contact: string;
      email: string;
    };
    medicalProfile?: {
      condition: string;
      lastVist: string;
    };
  };
  therapist?: {
    user: {
      profileImage: string;
      firstName: string;
      lastName: string;
    };
  };
}
interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  status: 'idle',
  error: null,
};

export const summation_Appointment = (state: { appointment: AppointmentState }) => 
  state.appointment.appointments.length;

export const getAppointmentById = createAsyncThunk(
  "getAppointmentById/getAll",
  async (therapistId: string | number,{rejectWithValue}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/therapists/${therapistId}/appointments`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("API Response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Logic for getting all appintment of specific patient 
export const getAllAppintmentforPatient=createAsyncThunk("getallappointofpatient",
  async (patientId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/patients/${patientId}/appointments`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointments = createAsyncThunk(
  'updateAppointments/update',
  async (appointmentData: Appointment, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/appointments/${appointmentData.id}`,
        appointmentData,{
          headers:{
              Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Logic to delete the appointment

export const deleteAppointment = createAsyncThunk(
  "deleteAppointment/delete",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/appointments/${id}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.status = "idle";
      state.error = null;
      state.appointments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.appointments = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.status = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getAllAppintmentforPatient.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(getAllAppintmentforPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.appointments = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(getAllAppintmentforPatient.rejected, (state, action) => {
        state.loading = false;
        state.status = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        if (action.payload) {
          state.appointments = state.appointments.map(app =>
            app.id === action.payload.id ? { ...app, ...action.payload } : app
          );
        }
      })
      .addCase(updateAppointments.rejected, (state, action) => {
        state.loading = false;
        state.status = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.appointments = state.appointments.filter(app => app.id !== action.payload);
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.status = "rejected";
        state.error = action.payload as string;
      })
  },
});

export const { resetStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;