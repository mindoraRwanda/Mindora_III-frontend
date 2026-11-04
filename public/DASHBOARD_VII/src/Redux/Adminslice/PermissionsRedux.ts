import { API_BASE_URL } from '../../config/api';
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export interface Permission {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    rolePermission?: {
      roleId: string;
      permissionId: string;
      createdAt: string;
      updatedAt: string;
    };
    roleId?: string;   
    permissionId?: string;  
  }
interface PermissionsState {
    permissions: Permission[];
    rolePermission: {
        [roleId: string]: Permission[];
    };
    loading: boolean;
    error: string | null;
    status: "idle" | "loading" | "succeeded" | "rejected";
}

const initialState: PermissionsState = {
    permissions: [],
    rolePermission: {},
    loading: false,
    error: null,
    status: "idle",
};

export const getPersimission_forRole = createAsyncThunk('getPersimission_forRole',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/roles/${id}/permissions`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return { roleId: id, permissions: response.data };
        }
        catch (error: any) {
            return rejectWithValue(error.message);
        }
    });
export const allSystemPermissions=createAsyncThunk('allSystemPermissions',
    async(_, {rejectWithValue})=>{
        try{
            const response=await axios.get(`${API_BASE_URL}/api/permissions`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const addPermissionToRole=createAsyncThunk('addPermissionToRole',
    async ({ roleId, permissionId }: { roleId: string, permissionId: string }, { rejectWithValue }) => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/roles/${roleId}/permissions/${permissionId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          return { roleId, permissions: response.data };
        } catch (error: any) {
          return rejectWithValue(error.message);
        }
      }
    );

export const removePermissionFromRole=createAsyncThunk('removePermissionFromRole',
    async ({ roleId, permissionId }: { roleId: string, permissionId: string }, { rejectWithValue }) => {
        try {
          const response = await axios.delete(
            `${API_BASE_URL}/api/roles/${roleId}/permissions/${permissionId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          return { roleId, permissions: response.data };
        } catch (error: any) {
          return rejectWithValue(error.message);
        }
      }
    );   
    
    // the Following is for udating Permission
   export const updatePermission=createAsyncThunk('updatePermission',
    async ({ id, formData }: { id: string, formData: any }, { rejectWithValue }) => {
        try {
          const response = await axios.put(
            `${API_BASE_URL}/api/permissions/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message);
        }
    })


    // Permisiion Actions
    export const deletePermission=createAsyncThunk('deletePermission',
    async (id: string | number, { rejectWithValue }) => {
        try {
          const response = await axios.delete(`${API_BASE_URL}/api/permissions/${id}`,{
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

const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(getPersimission_forRole.pending, (state) => {
            state.status = "loading";
            state.loading = true;
            state.error = null;
        });
        // Fix the permission slice reducer to handle the actual API response structure
        builder.addCase(getPersimission_forRole.fulfilled, (state, action) => {
            const { roleId, permissions } = action.payload;
            console.log(`Received permissions for role ${roleId}:`, permissions);

            // Check if permissions exists and has a permissions array
            if (permissions && permissions.permissions && Array.isArray(permissions.permissions)) {
                console.log(`Found ${permissions.permissions.length} permissions for role ${roleId}`);
                console.log("First permission:", JSON.stringify(permissions.permissions[0], null, 2));
            } else {
                console.log("No permissions array found for this role");
            }

            state.loading = false;
            state.error = null;
            state.status = "succeeded";

            // Store the permissions array from inside the response object
            if (permissions && permissions.permissions) {
                state.rolePermission[roleId] = permissions.permissions;
            } else {
                // If no permissions array, store an empty array
                state.rolePermission[roleId] = [];
            }
        });
        builder.addCase(getPersimission_forRole.rejected, (state, action) => {
            state.status = "rejected";
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(allSystemPermissions.pending,(state)=>{
            state.status='loading';
            state.loading=true;
            state.error=null;
        })
        builder.addCase(allSystemPermissions.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.loading=false;
            state.error=null;
            state.permissions=action.payload;
        })
        builder.addCase(allSystemPermissions.rejected,(state,action)=>{
            state.status='rejected';
            state.loading=false;
            state.error=action.payload as string;
        });
          // this is for removing permission to the role
          builder.addCase(removePermissionFromRole.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          builder.addCase(removePermissionFromRole.fulfilled, (state, action) => {
            const { roleId, permissions } = action.payload;
            state.loading = false;
            state.error = null;
            
            // Update the role permissions in the state
            if (permissions && permissions.permissions) {
              state.rolePermission[roleId] = permissions.permissions;
            }
          });
          
          builder.addCase(removePermissionFromRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });

          // this is for adding permission to the role
          builder.addCase(addPermissionToRole.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          builder.addCase(addPermissionToRole.fulfilled, (state, action) => {
            const { roleId, permissions } = action.payload;
            state.loading = false;
            state.error = null;
            
            // Update the role permissions in the state
            if (permissions && permissions.permissions) {
              state.rolePermission[roleId] = permissions.permissions;
            }
          });
          
          builder.addCase(addPermissionToRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });
        // The following are codes for Updatoing Permission
          builder.addCase(updatePermission.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          builder.addCase(updatePermission.fulfilled, (state, action) => {
            const { roleId, permissions } = action.payload;
            state.loading = false;
            state.error = null;
            
            // Update the role permissions in the state
            if (permissions && permissions.permissions) {
              state.rolePermission[roleId] = permissions.permissions;
            }
          });
          
          builder.addCase(updatePermission.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });

          //this is for deleting permission
           builder.addCase(deletePermission.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          builder.addCase(deletePermission.fulfilled, (state, action) => {
            const { roleId, permissions } = action.payload;
            state.loading = false;
            state.error = null;
            
            // Update the role permissions in the state
            if (permissions && permissions.permissions) {
              state.rolePermission[roleId] = permissions.permissions;
            }
          });
          
          builder.addCase(deletePermission.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });
    },
});

export default permissionsSlice.reducer;