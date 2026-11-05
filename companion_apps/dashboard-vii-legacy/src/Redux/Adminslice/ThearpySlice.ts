import { API_BASE_URL } from '../../config/api';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface PersonalInformation {
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  gender: string;
  address: string;
  dateOfBirth?: string;
  email?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

 export interface Therapist {
  id: string;
  personalInformation: PersonalInformation;
  diploma: string;
  licence: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};



 export interface TherapyState {
  therapists: Therapist[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: TherapyState = {
  therapists: [],
  status: "idle",
  error: null,
};

export const SelectedTotalTherapist=(state:{Therapy:TherapyState})=>state.Therapy.therapists.length;
// This is for creating new therapist
export const createTherapy = createAsyncThunk(
  "Therapy/createTherapy",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Therapist>(
        `${API_BASE_URL}/api/therapists`,
      formData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      );
      return response.data;
      console.log("Response from API:", response);
    } catch (error:any) {
      console.error("Error response:", error.response || error); 
      return rejectWithValue(error?.response?.data || "An Unexpected error occurred");
    }
  }
);

// this is for getting single therapist
export const getTherapy=createAsyncThunk('getTherapy',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/therapists/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data || "An Unexpected error occurred");
    }
  }
);

// This is for displaying all therapiest information
export const getAllTherapists = createAsyncThunk(
  "Therapist/getAllTherapists",
  async (_, { rejectWithValue }) => {
    const token=localStorage.getItem('token');
    console.log(token);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/therapists`,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
      );
     
      return response.data;
      console.log("Response from API:", response);
    } catch (error:any) {
      return rejectWithValue(error.response?.data || "An Unexpected error occurred");
    }
  }
);
// The following is for deleting Therapists

export const deleteTherapy = createAsyncThunk<{id: string}, string>('delete/Therapy',
  async (id, { rejectWithValue }) => {
    try {
       await axios.delete(`${API_BASE_URL}/api/therapists/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
       });
      return {id};
    }
    catch (error:any) {
      return rejectWithValue(error.response?.data || "An Unexpected error occurred");
    }
  }
);
export const updateTherapy = createAsyncThunk(
  'update/updateTherapy',
  async ({ id, credentials }: { id: string; credentials: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Therapist>(`${API_BASE_URL}/api/therapists/${id}`, {
        personalInformation: {
          email: credentials.personalInformation.email,
          phoneNumber: credentials.personalInformation.phone,
          gender: credentials.personalInformation.gender,
          address: credentials.personalInformation.address,
          lastName: credentials.personalInformation.lastName,
          firstName: credentials.personalInformation.firstName,
          dateOfBirth: credentials.personalInformation.dateOfBirth
        },
        diploma: credentials.diploma,
        licence: credentials.licence,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error("API error:", error.response || error);
      return rejectWithValue(error.response?.data || "An Unexpected error occurred");
    }
  }
);


const TherapySlice = createSlice({
  name: 'Therapy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(createTherapy.pending, (state) => {
      state.status = "loading";
    })
    
      .addCase(createTherapy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.therapists.push(action.payload as Therapist);
      })
      .addCase(createTherapy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // this is for Getting all Therapists
      .addCase(getAllTherapists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTherapists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.therapists = action.payload;
      })
      .addCase(getAllTherapists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // The following is for deleting Therapists

      .addCase(deleteTherapy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTherapy.fulfilled, (state, action) => {
        const index = state.therapists.findIndex(therapy => therapy.id === action.payload.id);
        if (index > -1) {
          state.therapists.splice(index, 1);
        }
      })
      .addCase(deleteTherapy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
    // the following is for updating the therapists
    .addCase(updateTherapy.pending,(state)=>{
      state.status='loading';
    })
    .addCase(updateTherapy.fulfilled,(state,action)=>{
      const index = state.therapists.findIndex(therapy => therapy.id === action.payload.id);
      if (index > -1) {
        state.therapists[index] = action.payload;
      }
    })
 .addCase (updateTherapy.rejected, (state,action)=>{
  state.status='failed';
  state.error=action.payload as string;
 })

},
});

export default TherapySlice.reducer;