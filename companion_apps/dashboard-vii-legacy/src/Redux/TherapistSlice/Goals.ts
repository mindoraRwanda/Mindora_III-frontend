import { API_BASE_URL } from '../../config/api';
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Goal {
    id?: string;
    treatmentPlanId: string;
    description: string;
    targetDate: string;
    status:string;
}
interface GoalState{
    goals: Goal[],
    status: 'idle' | 'loading' | 'succeeded' | 'rejected',
    error: string | null,
    goalId?: string | null,
}

  

export const createGoal=createAsyncThunk('CreateGoal/createGoal',
    async (goalData: Goal, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/treatment-goals`, goalData,{
                headers:{
                    'Content-Type': 'application/json',
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.message);
        }
    }
);

// this is for getting all Goals

export const getAllGoals=createAsyncThunk('GetAllGoals/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/treatment-goals`,{
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

// logic to get single Goal

export const getGoalById=createAsyncThunk('GetGoalById/get',
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/treatment-goals/${id}`,{
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

// logic for deleteGoals
export const deleteGoals=createAsyncThunk('DeleteGoals/delete',
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/treatment-goals/${id}`,{
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

// Logics for Updating Goals
export const updateGoals=createAsyncThunk('UpdateGoals/update',
    async (data:{id:string; goalData: Goal}, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/treatment-goals/${data.id}`, data.goalData,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    });

const GoalPlanSlice = createSlice({
    name: 'goalPlan',
    initialState: {
      goals: [] as Goal[],
      status: 'idle',
      error: null,
    }as GoalState,
    reducers: {
      resetStatus: (state) => {
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createGoal.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(createGoal.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.goals.push(action.payload);
          const goalId=action.payload?.id||action.payload.goalId;
          if(goalId){
              state.goalId=goalId;
              localStorage.setItem('goalId', goalId);
              console.log('Saved goalId:', goalId);
          }
        })
        .addCase(createGoal.rejected, (state, action) => {
          state.status = 'rejected';
          state.error = action.payload as string;
        })
        // this is for getting all Goals
        .addCase(getAllGoals.pending, (state) => {
            state.status = 'loading';
            state.error=null;
        })
     
        .addCase(getAllGoals.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.goals = action.payload;
            state.error = null;
        })
        .addCase(getAllGoals.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload as string;
        })
        .addCase(getGoalById.pending, (state) => {
            state.status = 'loading';
            state.error=null;

        })
        .addCase(getGoalById.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.goals = action.payload;
            state.error=null;
        })
        .addCase(getGoalById.rejected, (state,action)=>{
            state.status='rejected';
            state.error=action.payload as string ;

        })
        .addCase(deleteGoals.pending, (state) => {
            state.status = 'loading';
            state.error=null;
        })
        .addCase(deleteGoals.fulfilled, (state,action) => {
            state.status ='succeeded';
            state.goals = state.goals.filter(goal => goal.id !== action.meta.arg);
            state.error = null;
        })
        .addCase(deleteGoals.rejected, (state,action) => {
            state.status = 'rejected';
            state.error = action.payload as string;
        })
        .addCase(updateGoals.pending, (state) => {
            state.status = 'loading';
            state.error=null;
        })
        .addCase(updateGoals.fulfilled, (state,action) => {
            state.status ='succeeded';
            state.goals=state.goals.map(goal=>goal.id===action.payload.id?action.payload:goal);
            state.error=null;
        })
        .addCase(updateGoals.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload as string;
        });
        
    },
  });

export const { resetStatus } = GoalPlanSlice.actions;
export default GoalPlanSlice.reducer;