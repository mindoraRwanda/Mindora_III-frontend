import { useEffect, useState } from "react";
import { FiEdit, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { MdPictureAsPdf } from "react-icons/md";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { Button, message, Modal, Spin } from "antd";
import Create_User from "./Create_User";
import VideoCall from "../VideoCall";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers, updateUser } from "../../Redux/Adminslice/UserSlice";
import { deleteUser } from "../../Redux/Adminslice/UserSlice";
import { useCallback } from "react";
import CreateTherapy from "./Create_Therapy";
import CreatePatient from "./Create_Patient";
import { AppDispatch, RootState } from "../../Redux/store";

// Update the User interface to include the missing properties
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  gender?: string;
  lastLogin?: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  date?: string;
}

export default function AdminUserList() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users) as User[];
  const status = useSelector((state: RootState) => state.users.status);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [TherapyRole, setTherapyRole] = useState(false);
  const [therapyUserId, setTherapyUserId] = useState<string | null>(null);
  const [PatientId, setPatientId] = useState<string | null>(null);
  const [PatientRole, setPatientRole] = useState(false);
  // Remove unused variable or use it somewhere
  // const [newRole, setNewRole] = useState("");
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);

  // Effect to get all users
  useEffect(() => {
    const fetchAllusers = async () => {
      try {
        setLoading(true);
        await dispatch(GetAllUsers());
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllusers();
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setFilteredUsers(users);
    }
  }, [users, status]);

  const handleTherapyRole = (e: React.ChangeEvent<HTMLSelectElement>, user: User) => {
    const selectedRole = e.target.value;
    // Using selectedRole directly instead of setting newRole state
    if (selectedRole === "therapy" || selectedRole === "therapist") {
      setTherapyRole(true);
      setTherapyUserId(user.id);
    } else if (selectedRole === "patient") {
      setPatientRole(true);
      setPatientId(user.id);
    }
    dispatch(updateUser({ id: user.id, credentials: { role: selectedRole } }));
  };
  const showModal = () => {
    setSelectedUser(null);
    setIsEditable(true);
    setIsModalVisible(true);
  };
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = users.filter(
        (user: User) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    },
    [users]
  );

  const paginate = (pageNumber: number) => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: currentUsers.map(
            (user) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `\nName: ${user.firstName} ${user.lastName}`, break: 2 }),
                  new TextRun({ text: `\nEmail: ${user.email}`, break: 1 }),
                  new TextRun({ text: `\nGender: ${user.gender || 'Not specified'}`, break: 1 }),
                  new TextRun({
                    text: `\nLast visit: ${user.role || 'Not specified'}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nPhone Number: ${user.phoneNumber || 'Not specified'}`,
                    break: 1,
                  }),
                ],
              })
          ),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "User_list.docx");
    });
  };

  const handleView = (user: User) => {
    setSelectedUser({
      ...user,
      date: user.lastLogin || "",
    });
    setIsEditable(false);
    setIsModalVisible(true);
  };

  
  const handleCancel = () => {
    setIsModalVisible(false);
    setPatientRole(false);
    setTherapyRole(false);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditable(true);
    setIsModalVisible(true);
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete User?");
    if (confirmed) {
      try {
        await dispatch(deleteUser(id));
        console.log("User deleted successfully");
        message.success("User deleted successfully");
        dispatch(GetAllUsers()); // Refresh the user list
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to delete user: ${errorMessage}`);
      }
    }
  };

  const handleUpdate = async (user: User) => {
    const confirmed = window.confirm("Are you sure you want to update User?");
    if (confirmed) {
      try {
        await dispatch(
          updateUser({
            id: user.id,
            credentials: {
              firstName: user.firstName,
              email: user.email,
              date: user.lastLogin,
            },
          })
        );
        message.success("User updated successfully");
        dispatch(GetAllUsers()); // Refresh the user list
        setIsModalVisible(false);
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      }
    }
  };

  const handleBlock = () => {
    const confirm = window.confirm("Are Sure you want to Block this User?");
    if (confirm) {
      message.info("You will block User");
    }
  };

  // Fix the CreateUser dispatch issue
  const addUser = async (newUser: any) => {
    try {
      await dispatch({
        type: 'CREATE_USER',
        payload: newUser
      });
      setFilteredUsers([...filteredUsers, newUser]);
      setIsModalVisible(false);
      message.success("New User Added Successfully");
    } catch (error: any) {
      message.error(`Failed to create user: ${error.message}`);
    }
  };

  const handleExportPDF = () => {
    const input = document.getElementById("User-table");
    if (input) { // Add null check
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(
          imgData,
          "PNG",
          10,
          10,
          canvas.width / 13,
          canvas.height / 12
        );
        pdf.save("User_list.pdf");
      });
    } else {
      message.error("Could not find table element");
    }
  };

  const handleExportExcel = () => {
    const usersData = filteredUsers.map(user => ({
      Name: `${user.firstName} ${user.lastName}`,
      Email: user.email,
      Address: user.address || 'Not specified',
      Gender: user.gender || 'Not specified',
      Phone: user.phoneNumber || 'Not specified'
    }));
    const worksheet = XLSX.utils.json_to_sheet(usersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users_list.xlsx");
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
  };

  // Function to add therapy
  const handleAddTherapy = () => {
    // Implement the logic you need for Add_Therapy
    console.log("Adding therapy");
    setTherapyRole(false);
  };

  // Function to add patient
  const handleAddPatient = () => {
    // Implement the logic you need for addPatient
    console.log("Adding patient");
    setPatientRole(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-3">
      <div className="flex justify-between mb-4 mt-3">
        <h2 className="text-2xl font-bold m-5 text-black">Users</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="flex gap-4 mb-4">
          <div className="flex float-left border-2 border-slate-300 ml-4 rounded-md ">
          <a
            onClick={showModal}
            className="text-white font-bold p-2 px-2 cursor-pointer bg-purple-600 rounded-md "
          >
            {" "}
            + Add New
          </a>
        </div>
            <div className="items-center border rounded bg-white flex float-right">
              <input
                type="text"
                name="query"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="rounded-l outline-none text-black ml-5"
              />
              <button
                type="submit"
                className="p-2 text-xl text-black bg-white rounded-r"
              >
                <FiSearch />
              </button>
            </div>
          
            <div className="flex ml-auto gap-3 rounded-md mt-4 ">
              <button
                className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                onClick={handleExportPDF}
              >
                <MdPictureAsPdf size={20} />
                Pdf
              </button>
              <button
                className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                onClick={handleExportExcel}
              >
                <FaFileExcel size={20} />
                excel
              </button>
              <button
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={handleExportWord}
              >
                <FaFileWord size={20} />
                Word
              </button>
            </div>
          </div>
          <table id="User-table" className="w-full table-auto">
     <thead>
    <tr>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        No
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Name
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Email
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Role
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Change Role
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Status
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200">
    {currentUsers.map((user, index) => (
      <tr key={user.id}>
        <td className="px-2 py-2 text-sm text-gray-900">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td className="px-2 py-2">
          <div className="flex items-center">
            <div className="h-8 w-8 flex-shrink-0">
              {user.profileImage ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.profileImage}
                  alt=""
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{user.firstName?.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {user.firstName} {user.lastName}
              </div>
            </div>
          </div>
        </td>
        <td className="px-2 py-2 text-sm">
          <div className="text-gray-900 truncate max-w-xs">
            {user.email}
          </div>
        </td>
        <td className="px-2 py-2 text-sm">
          <button onClick={() => handleChangeRole(user)}>
            <div className="text-xs text-white bg-purple-600 p-1 rounded-md truncate max-w-xs">
              {user.role ? user.role : "none"}
            </div>
          </button>
        </td>

        <td className="px-2 py-2 text-sm">
          <select
            className="border text-black rounded-md p-1 text-xs w-full"
            onChange={(e) => handleTherapyRole(e, user)}
            value={user.role || ""}
          >
            <option value="">Select</option>
            <option value="admin">Admin</option>
            <option value="patient">Patient</option>
            <option value="therapy">Therapy</option>
          </select>
        </td>
        <td className="px-2 py-2 text-sm">
          <button
            className="border border-gray-300 p-1 px-3 rounded text-xs font-medium"
            onClick={handleBlock}
          >
            Active
          </button>
        </td>
        <td className="px-2 py-2 text-sm text-gray-500">
          <div className="flex space-x-1">
            <button
              onClick={() => handleView(user)}
              className="p-1 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(user)}
              className="p-1 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="p-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          {/* Pagination section with page numbers */}
          <div className="flex justify-between items-center mt-5 px-2">
            <div className="text-sm text-gray-700">
              Showing {filteredUsers.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 py-1 border ${pageNumber === currentPage ? "bg-purple-600 text-white" : "bg-white text-purple-600"
                      } mx-1 rounded hover:bg-purple-100`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={() => currentPage < Math.ceil(filteredUsers.length / itemsPerPage) && paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
            {selectedUser ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {isEditable ? " Edit User " : " User Details "}
                </h2>
                <p className="text-black m-3">
                  <span>Name:</span>
                  <br />
                  <input
                    type="text"
                    className="p-1 mt-2 rounded-md border-2 border-gray-300 w-full"
                    value={selectedUser.firstName}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        firstName: e.target.value,
                      })
                    }
                  />
                </p>
                <p className="text-black m-3">
                  <span>Email:</span>
                  <br />

                  <input
                    type="email"
                    className="p-1 mt-2 rounded-md border-2 border-gray-300 w-full"
                    value={selectedUser.email}
                    readOnly={!isEditable}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, email: e.target.value })
                    }
                  />
                </p>

                {isEditable && (
                  <Button
                    onClick={() => handleUpdate(selectedUser)}
                    className="text-center border-2 py-2 rounded-md bg-red-600 text-white font-semibold w-full"
                    disabled={status === 'loading'}
                    loading={status === 'loading'}
                  >
                    {status === 'loading' ? 'Updating...' : 'Update'}
                  </Button>
                )}
                <VideoCall />
              </div>
            ) : (
              // Fix the Create_User props issue
              <Create_User onSuccess={handleSuccess} addUser={addUser} {...({} as any)} />
            )}
          </Modal>
          
          {/* Fix therapy prop */}
          <Modal open={TherapyRole} footer={null} onCancel={handleCancel}>
            <CreateTherapy userId={therapyUserId} onSuccess={handleSuccess} Add_Therapy={handleAddTherapy} />
          </Modal>

          {/* Fix patient prop */}
          <Modal open={PatientRole} footer={null} onCancel={handleCancel}>
            <CreatePatient userId={PatientId} onSuccess={handleSuccess} addPatient={handleAddPatient} />
          </Modal>
        </>
      )}
    </div>
  );
}