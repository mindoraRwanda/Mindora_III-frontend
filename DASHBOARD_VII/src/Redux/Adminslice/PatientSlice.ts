import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Replace your Patient interface with this:
export interface Patient {
    id: number | string;
    userId?: string;
    user: {
        email: string;
        firstName: string;
        lastName: string;
        profileImage?: string;
        phoneNumber?: string;
    };
    personalInformation: {
        age: number;
        gender: string;
        // address:any;
    };
    medicalProfile: {
        lastVisit: string;
        condition: string;
    };
    emergencyContact: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    lastLogin?: string;
    totalUsers?: number;
}
export interface Invoice {
    id: string;
    userId: string;
    services: Array<{
      id: string;
      name: string;
      price: number;
    }>;
    dueDate: string;
    createdAt: string;
    status: string;
  }
export interface PatientsListProps {
    goToPlan: (patientId: number | string) => void;
}

export const SelectedTotalPatints = (state: { patients: { patients: Patient[] } }) => state.patients.patients.length;



// the following ia about creating new patient
export const createPatient = createAsyncThunk('Patient/createPatient',
    async (PatientData: Partial<Patient>, { rejectWithValue }) => {
        console.log('Sending data to the server:', PatientData);
        try {
            const response = await axios.post<Patient>(`${API_BASE_URL}/api/patients`,
                PatientData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Server response:', response);
            return response.data;
           
        }
        catch (err:any) {
            console.error('Error in createPatient:', err.response || err);
            return rejectWithValue((err as Error).message);
        }

    }

);
// Get all the patient
export const allPatients = createAsyncThunk('getPatients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/patients`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("API Response:", response.data);
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);
export const getAllPatientOfTherapy = createAsyncThunk('getAllPatientOfTherapy',
    async (therapistId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/therapists/${therapistId}/patients`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data;
        }
        catch (error:any) {
            return rejectWithValue(error.message);
        }
    });



// the following is for getting single patient
export const getPatientById = createAsyncThunk('patient/getById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

// the following Api is for Updating Patient

export const updatePatient = createAsyncThunk('updatePatient',
    async ({ id, updatePatientData }: { id: number | string; updatePatientData: any }, { rejectWithValue }) =>
        {

        try {
            const response = await axios.put(`${API_BASE_URL}/api/patients/${id}`, updatePatientData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);
// the followinf codes are for deleting the patient

export const deletePatient = createAsyncThunk('deletePatient',
    async (id: number | string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            });
            return id;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const patientSlice = createSlice({
    name: 'patients',
    initialState: {
        patients: [] as Patient[],
        status: 'idle',
        error: null as string | null,
        data: [] as Patient[],
        selectedPatient: null as Patient | null,
    },
    reducers: {
        setPatients: (state, action) => {
            state.patients = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // this is for creating patient
            .addCase(createPatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPatient.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.patients.push(action.payload);
            })
            .addCase(createPatient.rejected, (state, action) => {
                console.log('Error payload:', action.payload);
                console.log('Error message:', action.error.message);
                state.status = 'rejected';
                state.error = action.payload as string;
            })
            // this is for getting
            .addCase(allPatients.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(allPatients.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.patients = action.payload;
            })

            .addCase(allPatients.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(getPatientById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getPatientById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.selectedPatient = action.payload;
            })
            .addCase(getPatientById.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })

            // The Following Extra redux are for Updating patient
            .addCase(updatePatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePatient.fulfilled, (state, action) => {
                const index = state.patients.findIndex(patient => patient.id === action.payload.id);
                if (index > -1) {
                    state.patients[index] = action.payload;
                }
            })
            .addCase(updatePatient.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })

            // The Following Extra redux are for deleting patient
            .addCase(deletePatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deletePatient.fulfilled, (state, action) => {
                state.patients = state.patients.filter(patient => patient.id !== action.payload);
                state.status = 'succeeded';

            })
            .addCase(deletePatient.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(getAllPatientOfTherapy.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllPatientOfTherapy.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(getAllPatientOfTherapy.rejected, (state, action) => {
                state.status = 'rejected';
                console.log(action.payload);
            })
    }
}

);
export const { setPatients } = patientSlice.actions;
export default patientSlice.reducer;


