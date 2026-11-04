import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

interface Article {
  id?: string;
  title: string;
  category: string;
  content: string;
  author: string;
  publishedDate: string;
  coverImage?: string;
  courseId: string;
  picture?: string;
}

interface ArticleState {
  data: Article[];
  status: 'idle' | 'loading' |'succeeded' | 'failed';
}

const initialState: ArticleState = {
  data: [],
  status:"idle",
};

export const createArticle=createAsyncThunk('articleContent/createArticle',
 async(articleData:any, {rejectWithValue})=>{
    try{
        const response=await axios.post(`${API_BASE_URL}/api/articles`,articleData);
        return response.data;
    }
    catch(error:any){
        return rejectWithValue(error.message);
    }

 });
 export const getAllArticle=createAsyncThunk('getAllArticle',
  async(selectedCourseId:any,{rejectWithValue})=>{
    try{
      if(!selectedCourseId){
        return rejectWithValue('No course Id');
      }
        const response=await axios.get(`${API_BASE_URL}/api/articles/courses/${selectedCourseId}`);
        return response.data;
    }
    catch(error:any){
        return rejectWithValue(error.message);
    }}
 );

 export const UpdateArticle=createAsyncThunk('updateArticle',
  async({id, formData}: {id: string, formData: any}, {rejectWithValue})=>{
    try{
        await axios.put(`${API_BASE_URL}/api/articles/${id}`,formData);
        return id;
    }
    catch(error:any){
        return rejectWithValue(error.message);
    }}
 );

 export const deleteArticle=createAsyncThunk('articleContent/deleteArticle',
  async(id:string,{rejectWithValue})=>{
    try{
        await axios.delete(`${API_BASE_URL}/api/articles/${id}`);
        return id;
    }
    catch(error:any){
      return rejectWithValue(error.message);
  }
});

 const Articles=createSlice({
    name:'articleContent',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
       .addCase(createArticle.pending,(state)=>{
        state.status='loading';
       })
        .addCase(createArticle.fulfilled,(state,action)=>{
        state.status='succeeded';
        state.data.push(action.payload);
       })
       .addCase(createArticle.rejected,(state,action)=>{
        state.status='failed';
        console.log(action.payload);
       })
       .addCase(getAllArticle.pending,(state)=>{
        state.status='loading';
       })
       .addCase(getAllArticle.fulfilled,(state,action)=>{
        state.status='succeeded';
        state.data=action.payload;
       })
       .addCase(getAllArticle.rejected,(state,action)=>{
        state.status='failed';
        console.log(action.payload);
       })
       .addCase(deleteArticle.pending,(state)=>{
        state.status='loading';
       })
       .addCase(deleteArticle.fulfilled,(state, action)=>{
        state.status='succeeded';
        state.data = state.data.filter(article => article.id !== action.payload);
       })
       .addCase(deleteArticle.rejected,(state,action)=>{
        state.status='failed';
        console.log('Delete Failed',action.payload);
       })
    },
 })
 export default Articles.reducer;