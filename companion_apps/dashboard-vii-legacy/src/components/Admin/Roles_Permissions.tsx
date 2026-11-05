import { Button, Checkbox, message, Modal,Form, Input, Spin } from "antd";
import {  Search, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRoles, Role } from "../../Redux/Adminslice/RolesRedux";
import {
  addPermissionToRole,
  allSystemPermissions,
  deletePermission,
  getPersimission_forRole,
  Permission,
  removePermissionFromRole,
  updatePermission,
} from "../../Redux/Adminslice/PermissionsRedux";
import { AppDispatch, RootState } from "../../Redux/store";


export default function Roles() {
  const { roles, status, error } = useSelector((state:RootState) => state.roles);
  const { rolePermission } = useSelector((state:RootState) => state.permissions);
  const { permissions } = useSelector((state:RootState) => state.permissions);
  const [showRoles, setShowRoles] = useState(false);
  const [selectedRoles, setselectedRoles] = useState<Role | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({});
  const [hoveredPermission, setHoveredPermission] = useState<string | null>(null);
  const [showUpdatePermission, setShowUpdatePermission] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  // about checkbox for Roles.
  const [checkedPermissions, setCheckedPermissions] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch<AppDispatch>();
  const [form]=Form.useForm();
  // useffect to fetch all role
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllRoles());
    }
  }, [dispatch, status]);

  //useeffect to fetch Permissions for selected role
  useEffect(() => {
    if (selectedRoles) {
      dispatch(getPersimission_forRole(selectedRoles.id));
      if (rolePermission && rolePermission[selectedRoles.id]) {
        const newCheckedState: Record<string, boolean> = {};
        rolePermission[selectedRoles.id].forEach((permission) => {
          newCheckedState[permission.id] = true;
        });
        setCheckedPermissions(newCheckedState);
      }
    }
  }, [dispatch, rolePermission, selectedRoles]);

  // useeffect to fetch Permissions for Each role
  useEffect(() => {
    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        if (!rolePermission[role.id]) {
          console.log(
            `Fetching permissions for role: ${role.name} (${role.id})`
          );
          dispatch(getPersimission_forRole(role.id));
        }
      });
    }
  }, [dispatch, rolePermission, roles]);

  // useEffect to fetch all Permissions which are in the System

  useEffect(() => {
    if (status === "idle") {
      dispatch(allSystemPermissions());
    }
  }, [dispatch, status]);

  const handleRoles = (role:Role) => {
    setselectedRoles(role);
    setShowRoles(true);
  };

  const toggleExpandRole = (roleId:string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  // Function to handle checkBox changes
  const handlePermissionChange = (permissionId:string) => {
    setCheckedPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };
  // function to save permission changes.
  const savePermissions = async () => {
    if (!selectedRoles) return;
    // setIsUpdating(true);

    message.success("All permission changes have been saved");
  setShowRoles(false);
  dispatch(getPersimission_forRole(selectedRoles.id));
  };
const handleRemovePermissionFromRole = (permissionId:string, roleId?:string) => {
  // Use the selected role's ID if not provided
  const targetRoleId = roleId || (selectedRoles ? selectedRoles.id : null);
  
  if (!targetRoleId) return;
  
  if (window.confirm("Are you sure you want to remove this permission from this role?")) {
    dispatch(removePermissionFromRole({ 
      roleId: targetRoleId, 
      permissionId 
    }))
    .unwrap()
    .then(() => {
      message.success("Permission removed successfully");
      dispatch(getPersimission_forRole(targetRoleId));
      setCheckedPermissions((prev) => ({
        ...prev,
        [permissionId]: false
      }));
    })
    .catch((error:any) => {
      message.error("Failed to remove permission");
      console.error("Error removing permission:", error);
    });
  }
};

const handleAddPermissionToRole = (roleId:string,permissionId:string) => {
  dispatch(addPermissionToRole({ roleId, permissionId }))
    .unwrap()
    .then(() => {
      message.success("Permission added successfully");
      dispatch(getPersimission_forRole(roleId));
      setCheckedPermissions((prev) => ({
        ...prev,
        [permissionId]: true
      }));
    })
    .catch((error:any) => {
      message.error("Failed to add permission");
      console.error("Error adding permission:", error);
    });
};
// Function to Open Update Permission
const handleOpenUpdatePermission = (permission: Permission) => {
  setSelectedPermission(permission);
  setShowUpdatePermission(true);
  form.setFieldsValue({
    name: permission.name,
    description: permission.description
  })
}

// Function for update permission
const handleUpdatePermission = async () => {

  try{
    if(!selectedPermission) return;
    const FormData=form.getFieldsValue();
    await dispatch(updatePermission({id:selectedPermission.id,formData:FormData})).unwrap();
    message.success('Permission updated successfully');
    setShowUpdatePermission(false);
    form.resetFields();
    dispatch(allSystemPermissions());
  }catch(error:any){
    console.log(error);
    message.error('Failed to update permission',error);
  }
};

//function to delete Permission
const handleDeletePermission = (permissionId:string) => {
  if (window.confirm("Are you sure you want to delete this permission?")) {
    dispatch(deletePermission(permissionId))
      .unwrap()
      .then(() => {
        message.success("Permission deleted successfully");
        dispatch(allSystemPermissions());
      })
      .catch((error) => {
        message.error("Failed to delete permission");
        console.error("Error deleting permission:", error);
      });
  }
};

if (status === "loading") {
  return (
    <div className="flex items-center justify-center h-64">
      <Spin size="large" />
    </div>
  );
}
  if (status === "failed") {
    return (
      <div className="flex items-center justify-center text-red-600">
        Errors: {error}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm p-6 ">
        <div className=" ">
          <h3 className="text-2xl font-bold mt-6 text-black">
            Permissions for Roles in System.
          </h3>
          <h4 className="text-lg text-md mt-1 text-black">
            {" "}
            Manage access and Permissions for User based on Roles in the system
          </h4>
        </div>
        
        <div className=" flex-col sm:flex-row gap-4 mt-3 border rounded border-black relative flex-1">
          <Search color="black" className="absolute h-5 w-5 mt-3 ml-2" />
          <input
            className="w-full py-2 text-black px-10"
            type="text"
            placeholder="Search User ..."
          />
        </div>
        {roles && roles.length > 0 ? (
          roles.map((role:Role, index:number) => (
            <div
              className="border border-gray-300 rounded p-5 mt-5"
              key={index}
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <div className="">
                    <h3 className="text-lg font-bold  text-black">
                      {role.name}
                    </h3>
                    <h4 className="text-md text-gray-500">System role</h4>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <title>Permisions:</title>
                {/* Updated permissions rendering code */}
                <div className="flex flex-wrap gap-2 text-sm">
                  {rolePermission &&
                  rolePermission[role.id] &&
                  Array.isArray(rolePermission[role.id]) &&
                  rolePermission[role.id].length > 0 ? (
                    <>
                      {/* Always show first 5 permissions */}
                      {rolePermission[role.id]
                        .slice(0, 7)
                        .map((permission, idx) => (
                          <div
                          className="text-white px-2 py-1 bg-purple-950 rounded-md relative"
                          key={idx}
                          onMouseEnter={() => setHoveredPermission(`${role.id}-${permission.id}`)}
                          onMouseLeave={() => setHoveredPermission(null)}
                        >
                          {permission.name}
                          {hoveredPermission === `${role.id}-${permission.id}` && (
                            <button 
                              className="absolute top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 
                                        flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePermissionFromRole(permission.id, role.id);
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        ))}

                      {/* Show View More button if there are more than 5 permissions */}
                      {rolePermission[role.id].length > 5 && (
                        <div className="w-full mt-2 ">
                          <Button
                            className="flex items-center justify-center bg-blue-600 text-gray-100 px-2 py-4 hover:text-blue-800"
                            onClick={() => toggleExpandRole(role.id)}
                          >
                            {expandedRoles[role.id] ? (
                              <>
                                <span>View Less</span>
                                <ChevronUp size={16} className="ml-6" />
                              </>
                            ) : (
                              <>
                                <span>View More</span>
                                <ChevronDown size={16} className="ml-6" />
                              </>
                            )}
                          </Button>

                          {/* Expanded permissions section */}
                          {expandedRoles[role.id] && (
                            <div className="mt-2 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
                              {rolePermission[role.id]
                                .slice(5)
                                .map((permission, idx) => (
                                  <div
                          className="text-white px-2 py-1  bg-purple-950 rounded-md relative"
                          key={idx}
                          onMouseEnter={() => setHoveredPermission(`${role.id}-${permission.id}`)}
                          onMouseLeave={() => setHoveredPermission(null)}
                        >
                          {permission.name}
                          {hoveredPermission === `${role.id}-${permission.id}` && (
                            <button 
                              className="absolute top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 
                                        flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePermissionFromRole(permission.id, role.id);
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 text-md font-semibold w-full">
                      {!rolePermission[role.id] ? (
                        <span className="flex items-center justify-center">
                          <Spin size="small" className="animate-spin mr-2" />
                          Loading permissions...
                        </span>
                      ) : (
                        "No Permissions assigned to this role!"
                      )}
                    </div>
                  )}
                </div>
                <Button
                  className="text-black text-center text-lg font-semibold w-full mt-4"
                  onClick={() => handleRoles(role)}
                >
                  {" "}
                  Manage Permissions
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h3 className="text-xl font-semibold mt-6 text-black">
              No role Found
            </h3>
          </div>
        )}
      </div>
      {/* Replace your existing Modal with this updated version */}
      <Modal
        open={showRoles}
        footer={[
          <Button key="cancel" onClick={() => setShowRoles(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            // loading={isUpdating}
            onClick={savePermissions}
            className="bg-blue-600 text-white"
          >
            Save Changes
          </Button>,
        ]}
        onCancel={() => setShowRoles(false)}
        title={`Assign Permissions to ${selectedRoles?.name || "Role"}`}
      >
        <div>
        {permissions && permissions.length > 0 ? (
           permissions.map((permission:Permission, index:number) => {
    // Check if the permission is already assigned to the role
    const isAssigned = !!checkedPermissions[permission.id];
    
    return (
      <div
        className="border border-gray-300 rounded p-1 mt-4"
        key={index}
      >
        <div className="justify-between">
          <div className="flex gap-2 justify-between">
            <div className="ml-2">
              <h3 className="text-xl text-gray-800">
                {permission.name}
              </h3>
              <h2>{permission.description}</h2>
            </div>
            <div className="flex gap-1">
              <Checkbox
                className="p-2"
                checked={isAssigned}
                disabled={isAssigned} // Disable checkbox if permission is already assigned
                onChange={() => {
                  if (!isAssigned) {
                    // Show confirmation dialog for adding permission
                    if (window.confirm(`Are you sure you want to add "${permission.name}" permission to this role?`)) {
                      // Add permission to role and then update the view
                      if (selectedRoles) {
                        handleAddPermissionToRole(selectedRoles.id, permission.id);
                        handlePermissionChange(permission.id);
                      }
                    }
                  }
                }}
              />
              <Button className="p-1 mt-2" onClick={()=>handleOpenUpdatePermission(permission)}>Update</Button>
              <Button 
                className="p-1 text-red-500 mt-2"
                onClick={() => handleDeletePermission(permission.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  })
) : (
  <div>
    <h3 className="text-xl font-semibold mt-6 text-black">
      No Permission Found
    </h3>
  </div>
)}
        </div>
      </Modal>
      {/* The Following is Modal for Update Permission */}
      <Modal open={showUpdatePermission} onCancel={() => setShowUpdatePermission(false)} title="Update Permission" footer={null}>
        <Form form={form} layout="vertical"  >
          <Form.Item name="name" label="Name">
            <Input placeholder="Enter Permission Name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input placeholder="Enter Permission Description" />
          </Form.Item>
          <Button className="bg-blue-600 w-full text-white" onClick={handleUpdatePermission}>Update Permission</Button>
        </Form>

      </Modal>
    </>
  );
}
