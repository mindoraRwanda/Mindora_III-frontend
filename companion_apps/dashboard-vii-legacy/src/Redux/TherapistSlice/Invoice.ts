import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

interface Invoice {
    id: string;
    userId: string;
    dueDate?: Date;
    services?: Array<{
      id: string;
      name: string;
      price: number;
    }>;
    status?: string;
    createdAt?: string;
  }

interface InvoiceState{
    data: Invoice[],
    status: "idle" | "loading" | "succeeded" | "rejected" ;
    error: string | null;
}

const initialState: InvoiceState = {
    data: [],
    status: "idle",
    error: null
};
export const createInvoice=createAsyncThunk('createInvoice',
    async(data:{userId: string;dueDate: string;services: string[];
    },{rejectWithValue})=>{
        try{
            const response=await axios.post(`${API_BASE_URL}/api/invoices`,data);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

export const getAllInvoices=createAsyncThunk('getAllInvoices',
    async (userId:string,{rejectWithValue})=>{
        try{
            console.log('Fetching invoices for userId:', userId);
            const response=await axios.get(`${API_BASE_URL}/api/invoices/user/${userId}`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const deleteInvoice=createAsyncThunk('deleteInvoice',
    async(id:string,{rejectWithValue})=>{
        try{
            await axios.delete(`${API_BASE_URL}/api/invoices/${id}`);
            return id;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    
});
interface UpdateInvoiceArgs extends Invoice {
    id: string;
  }
  
  export const UpdateInvoice = createAsyncThunk(
    'updateInvoice',
    async ({ id, userId, services, dueDate }: UpdateInvoiceArgs, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/invoices/${id}`,
          { userId, services, dueDate }
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  

const invoiceSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder
       .addCase(createInvoice.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(createInvoice.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.data=[...state.data, action.payload];
        })
        .addCase(createInvoice.rejected, (state, action) => {
            state.status ='rejected';
            console.log(action.payload);
        })
        .addCase(getAllInvoices.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(getAllInvoices.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.data=action.payload;
        })
        .addCase(getAllInvoices.rejected, (state, action) => {
            state.status ='rejected';
            console.log(action.payload);
        })
        .addCase(UpdateInvoice.pending, (state) => {
            state.status = 'loading';
            })
            .addCase(UpdateInvoice.fulfilled, (state, action) => {
                state.status ='succeeded';
                state.data=state.data.map(invoice=>invoice.id===action.payload.id? action.payload : invoice);
            })
            .addCase(UpdateInvoice.rejected, (state, action) => {
                state.status ='rejected';
                console.log(action.payload);
            })
        .addCase(deleteInvoice.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(deleteInvoice.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.data=state.data.filter(invoice=>invoice.id!==action.payload);
        })
        .addCase(deleteInvoice.rejected, (state, action) => {
            state.status ='rejected';
            console.log(action.payload);
        });

    
    }
});
export default invoiceSlice.reducer;