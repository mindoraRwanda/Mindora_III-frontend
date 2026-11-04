import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

 export interface Course {
  id: string;
  title: string;
  description: string;
  duration: number|string;
  level: string;
  instructors: string;
  category: string;
  price:number|string;
}


interface CourseState {
  coursesData: Course[];
  status: "idle" | "loading" | "succeeded" | "rejected" ;
  courseId?: string;
}

const initialState: CourseState = {
  coursesData: [],
    status: 'idle',
};
export const createCourses=createAsyncThunk<any, Course>("create/course",
    async(courseData,{rejectWithValue})=>{
        try{
            const response=await axios.post(`${API_BASE_URL}/api/courses`,courseData);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const getCourses=createAsyncThunk('getCourses',
    async(_,{rejectWithValue})=>{
        try{
            const response=await axios.get(`${API_BASE_URL}/api/courses`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const editCourse=createAsyncThunk('editCourse',
  async(courseData:Course,{rejectWithValue})=>{
    try{
        const response=await axios.put(`${API_BASE_URL}/api/courses/${courseData.id}`,courseData);
        return response.data;
    }
    catch(error:any){
        return rejectWithValue(error as Error);
    }
  }
);

export const deleteCourse=createAsyncThunk('deleteCourse',
  async(id:string,{rejectWithValue})=>{
    try{
        const response=await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
        return response.data;
    }
    catch(error:any){
        return rejectWithValue(error as Error);
    }
  }
);
const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers:(builder)=> {
        builder
       .addCase(createCourses.pending, (state) => {
        state.status = 'loading';
      })
       .addCase(createCourses.fulfilled, (state, action) => {
        state.status ='succeeded';
        state.coursesData.push(action.payload);
        const courseId=action.payload?.id||action.payload?.courseId;
        console.log(courseId);
        if(courseId) {
          state.courseId = courseId; 
          localStorage.setItem('courseId', courseId);
        }
      })
       .addCase(createCourses.rejected, (state, action) => {
        state.status ='rejected';
        console.log(action.payload);
      })
       .addCase(getCourses.pending, (state) => {
        state.status = 'loading';
      })
       .addCase(getCourses.fulfilled, (state, action) => {
        state.status ='succeeded';
        state.coursesData=action.payload;
      })
       .addCase(getCourses.rejected, (state, action) => {
        state.status ='rejected';
        console.log(action.payload);
      })
       .addCase(deleteCourse.pending, (state) => {
        state.status = 'loading';
      })
       .addCase(deleteCourse.fulfilled, (state, action) => {
        state.status ='succeeded';
        state.coursesData=state.coursesData.filter(course=>course.id!==action.payload);
      })
       .addCase(deleteCourse.rejected, (state, action) => {
        state.status ='rejected';
        console.log(action.payload);
      })
    },
  
});


export default courseSlice.reducer;