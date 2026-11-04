import { FiDownload, FiEdit, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import {  MdPictureAsPdf } from "react-icons/md";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";

import { message, Modal,Spin,Input} from "antd";
import Create_Therapy from "./Create_Therapy";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import {
  deleteTherapy,
  getAllTherapists,
  Therapist,
  updateTherapy,
} from "../../Redux/Adminslice/ThearpySlice";
import { getAllAvailableSlot } from "../../Redux/TherapistSlice/Appointment_Slot";



export default function AdminTherapistList() {
  const dispatch = useDispatch<AppDispatch>();
  const therapists = useSelector((state:RootState) => state.Therapy.therapists);
  const status = useSelector((state:RootState) => state.Therapy.status);
  const slots = useSelector((state: RootState) => state.availableSlot.data);
  const slotStatus = useSelector((state: RootState) => state.availableSlot.status);
  const [userId, setUserId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredtherapists, setFilteredtherapists] = useState<Therapist[]>([]);
  const [isShowModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId') || "";
    setUserId(currentUserId);
  }, []);
  useEffect(() => {
    const getAll=async()=>{
      try{
      setLoading(true);
      await dispatch(getAllTherapists());
    }
    catch(error){
      const errorMessage = (error as Error).message;
      message.error(`Failed to update goal: ${errorMessage}`);
    }
    finally{
      setLoading(false);
    }
  }
  getAll();
  }, [dispatch]);


  useEffect(() => {
    if (status === "succeeded") {
      setFilteredtherapists([...therapists]);
    }
  }, [therapists, status]);

  useEffect(() => {
    if(selectedTherapy?.id){
      console.log("Fetching slots for therapist:", selectedTherapy.id);
      dispatch(getAllAvailableSlot(selectedTherapy.id));
    }
  },[selectedTherapy,dispatch]);

  const formatTime = (isoString:any) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    });
  };
  const paginate = (pageNumber:any) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTherapy = filteredtherapists.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const Add_Therapy = () => {
    setShowModal(false);
    message.success("New Therapist added successfully");
    dispatch(getAllTherapists()); // Fetch the updated list
  };

  const handleSearch = useCallback((event:any) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = therapists.filter(
        (therapist:any) =>
          therapist.personalInformation.name.toLowerCase().includes(query) ||
          therapist.personalInformation.phoneNumber
            .toLowerCase()
            .includes(query)
      );
      setFilteredtherapists(filtered);
      setCurrentPage(1);
    },
    [therapists]
  );

  const handleEdit = (therapist:any) => {
    setSelectedTherapy(therapist);
    setIsEditable(true);
    setShowModal(true);
  };

  const handleView = (therapist:any) => {
    setSelectedTherapy(therapist);
    setIsEditable(false);
    setShowModal(true);
  };

  const handleDelete = async (therapyId:string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete Therapy?"
    );
    if (confirmed) {
      try {
        await dispatch(deleteTherapy(therapyId));
        message.success("delete therapy sucessfully");
        dispatch(getAllTherapists());
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to delete therapy: ${errorMessage}`);
      }
    }
  };

  const handleUpdate = async (therapist: Therapist) => {
    const confirm = window.confirm("Are you sure you want to update");
    if (confirm) {
      try {
        console.log('Therapist Data to Update:', therapist);
        
        // Restructure the data to match the expected format
        const updatePayload = {
          id: therapist.id,
          credentials: {
            personalInformation: {
              email: therapist.user?.email || therapist.personalInformation?.email,
              phone: therapist.user?.phoneNumber || therapist.personalInformation?.phoneNumber,
              gender: therapist.personalInformation?.gender,
              address: therapist.personalInformation?.address,
              lastName: therapist.user?.lastName || therapist.personalInformation?.lastName,
              firstName: therapist.user?.firstName || therapist.personalInformation?.firstName,
              dateOfBirth: therapist.personalInformation?.dateOfBirth
            },
            diploma: therapist.diploma,
            licence: therapist.licence
          }
        };
        
        console.log('Update Payload:', updatePayload);
        const response = await dispatch(updateTherapy(updatePayload));
        console.log('updated response:', response);
        
        message.success("Updated Successfully");
        dispatch(getAllTherapists());
        setShowModal(false);
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to update therapist: ${errorMessage}`);
      }
    }
  };
  const handleExportPDF = () => {
    const input = document.getElementById("therapist-table");
    if (input) {
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
        pdf.save("therapist_list.pdf");
      });
    } else {
      message.error("Table element not found");
    }
  };

  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: currentTherapy.map(
            (therapist) =>
              new Paragraph({
                children: [

                  new TextRun({text:`Name: ${therapist.user.firstName} ${therapist.user.lastName}`,break: 2}),
                  new TextRun({
                    text: `\nEmail: ${therapist.user.email}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nAddress: ${therapist.personalInformation.address}`,
                    break: 1,
                  }),
                  new TextRun({ 
                    text: `\nPhone Number: ${therapist.personalInformation.phoneNumber}`, 
                    break: 1 
                  }),
                  new TextRun({ 
                    text: `\nGender: ${therapist.personalInformation.gender}`, 
                    break: 1 
                  }),
                ],
              })
          ),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "therapist_list.docx");
    });
  };

  const handleExportExcel = () => {
    const simplifiedData = filteredtherapists.map(therapist => ({
      Name: `${therapist.user.firstName} ${therapist.user.lastName}`,
      Email: therapist.user.email,
      Address: therapist.personalInformation.address,
      Gender: therapist.personalInformation.gender
    }));
    const worksheet = XLSX.utils.json_to_sheet(simplifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Therapists");
    XLSX.writeFile(workbook, "therapist_list.xlsx");
  };


  const handleDiploma = (diplomaUrl:any) => {
    const link = document.createElement("a");
    link.href = diplomaUrl;
    link.download = "diploma.pdf";
    link.click();
  };
  
  const handleLicense = (LicenseUrl:any) => {
    const link = document.createElement("a");
    link.href = LicenseUrl;
    link.download = "license.pdf";
    link.click();
  };

  const handleClodeModal = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    // SetChangePassModal(false);
  };

  const formatDateForInput=(dateString: string) =>{
    return dateString ? dateString.split('T')[0]:''; 
   };

  return (
   
    <div className="bg-white rounded-lg shadow-xl  mt-10 p-3">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Therapists
        </h2>
    
      </div>
      {loading? ( <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" />
      </div>
       ) : (<>
      <div className="flex gap-4 mb-8">
      <div className="items-center border rounded bg-white flex float-right">
          <input
            type="text"
            name="query"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="rounded-l outline-none text-black m-3"
          />
          <button
            type="submit"
            className="p-2 text-xl text-black bg-white rounded-r"
          >
            <FiSearch />
          </button>
        </div>
        <div className="flex ml-auto gap-3 rounded-md mt-4 ">
        <button className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            onClick={handleExportPDF}
          >
            <MdPictureAsPdf size={20} />
            Pdf
          </button>
            <button className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={handleExportExcel}
          >
            <FaFileExcel size={20} />
            excel
          </button>
        <button className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleExportWord}
          >
            <FaFileWord size={20} />
            Word
          </button>
        
        </div>
      </div>
     <div>
      {/* logic gfor loading */}

      <table id="therapist-table" className="w-full table-auto">
  <thead>
    <tr>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        No
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Name
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Address
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Phone
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Diploma
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        License
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Gender
      </th>
      <th className="px-2 py-2 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {currentTherapy.map((therapist, index) => (
      <tr key={therapist.id}>
        <td className="px-2 py-3 text-sm text-gray-900">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td className="px-2 py-3">
          <div className="flex items-center">
            <div className="h-8 w-8 flex-shrink-0">
              {therapist.user.profileImage ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={therapist.user.profileImage}
                  alt=""
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{therapist.user.firstName?.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {therapist.user.firstName} {therapist.user.lastName}
              </div>
            </div>
          </div>
        </td>
        <td className="px-2 py-3 text-sm text-gray-900">
          <div className="truncate max-w-xs">
            {therapist.user.email}
          </div>
        </td>
        <td className="px-2 py-3 text-sm text-gray-900">
          {therapist.user.phoneNumber}
        </td>
        <td className="px-2 py-3 text-sm text-gray-900">
          <button className="bg-transparent text-black flex items-center gap-1 border-purple-600 border rounded p-1 text-xs" 
            onClick={() => handleDiploma(therapist.diploma)}>
            <span>Diploma</span> <FiDownload size={12} />
          </button>
        </td>
        <td className="px-2 py-3 text-sm text-gray-900">
          <button className="bg-transparent text-black flex items-center gap-1 border-purple-600 border rounded p-1 text-xs"
            onClick={() => handleLicense(therapist.licence)}>
            <span>License</span> <FiDownload size={12} />
          </button>
        </td> 
        <td className="px-2 py-3 text-sm text-gray-500">
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold 
            ${therapist.personalInformation.gender === 'female' ? 'bg-pink-100 text-pink-800' : 
            therapist.personalInformation.gender === 'male' ? 'bg-blue-100 text-blue-800' : 
            'bg-purple-100 text-purple-800'}`}>
            {therapist.personalInformation.gender}
          </span>
        </td>
        <td className="px-2 py-3 text-sm text-gray-500">
          <div className="flex space-x-1">
            <button 
              onClick={() => handleView(therapist)} 
              className="p-1 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleEdit(therapist)} 
              className="p-1 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(therapist.id)} 
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
          
      </div>
      {/* Pagination Controls */}
      {/* Pagination section with page numbers */}
<div className="flex justify-between items-center mt-4 px-6">
  <div className="text-sm text-gray-700">
    Showing {filteredtherapists.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} to {Math.min(currentPage * itemsPerPage, filteredtherapists.length)} of {filteredtherapists.length} therapists
  </div>
  <div className="flex items-center space-x-1">
    <button 
      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      Previous
    </button>
    
    {Array.from({ length: Math.ceil(filteredtherapists.length / itemsPerPage) }, (_, i) => i + 1).map(
      (pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => paginate(pageNumber)}
          className={`px-3 py-1 border ${
            pageNumber === currentPage ? "bg-purple-600 text-white" : "bg-white text-purple-600"
          } mx-1 rounded hover:bg-purple-100`}
        >
          {pageNumber}
        </button>
      )
    )}
    
    <button 
      onClick={() => currentPage < Math.ceil(filteredtherapists.length / itemsPerPage) && paginate(currentPage + 1)}
      disabled={currentPage === Math.ceil(filteredtherapists.length / itemsPerPage)}
      className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>



      <Modal footer={null} open={isShowModal} onCancel={handleCancel}>
        {selectedTherapy ? (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {isEditable ? " Edit Therapy " : " Therapy Details "}
            </h2>

            <div className="grid grid-cols-2">
              <p className="text-black m-3">
                <span>Name:</span>
                <br />
                <input
                  type="text"
                  className="p-1 mt-2 border-2 rounded-md border-gray-300"
                  value={selectedTherapy?.user.firstName}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedTherapy({
                      ...selectedTherapy,
                      user:{
                        ...selectedTherapy.user,
                        firstName: e.target.value,
                      }
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span>Email Address:</span>
                <br />
                <input
                  type="text"
                  className="p-1 mt-2 w-full border-2 rounded-md border-gray-300"
                  value={selectedTherapy?.user.email}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedTherapy({
                      ...selectedTherapy,
                      user:{
                        ...selectedTherapy.user,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span>Phone Number:</span>
                <br />

                <input
                  type="number"
                  className="p-1 mt-2 rounded-md border-2 border-gray-300"
                  value={selectedTherapy?.user.phoneNumber||''}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedTherapy({
                      ...selectedTherapy,user:{
                        ...selectedTherapy.user,
                        phoneNumber: e.target.value,
                      }
                    })
                  }
                />
              </p>

              <p className="text-black m-3">
                <span>UserName:</span> <br />
                <input
                  type="text"
                  className="p-1 mt-2 rounded-md border-2 border-gray-300"
                  value={selectedTherapy?.user.username|| ''}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedTherapy({
                      ...selectedTherapy,user:{
                        ...selectedTherapy.user,
                        username: e.target.value,
                      }
                      }
                    )
                  }
                />
              </p>
              <p className="text-black m-3">
  <span>DateOfBirth:</span> <br />
  <Input
    type="date"
    value={
      selectedTherapy?.personalInformation?.dateOfBirth 
        ? formatDateForInput(selectedTherapy.personalInformation.dateOfBirth)
        : ''
    }
    onChange={(e) =>{
      if (selectedTherapy) {
        setSelectedTherapy({
          ...selectedTherapy,
          personalInformation: {
            ...selectedTherapy.personalInformation,
            dateOfBirth: e.target.value,
          },
        });
      }}
    }
  />
</p>
 </div>
 <div className="mt-3 border-2 w-full rounded-md">
          <span className="text-lg font-semibold ml-2 my-10">Therapist Available Slot</span>
          {slotStatus === 'loading' ? (
            <p>Loading...</p>
          ) : slotStatus === 'succeeded' && slots.length > 0 ? (
            <div>
              {slots.map((slot) => (
                <div key={slot.id}>
                  <div className="flex mt-2 justify-between mx-5 ">
                    <label>Available Day</label>
                    <p className="text-md">{slot.availableDay}</p>
                  </div>
                  
                  <div className="flex grid-cols-2 justify-between mx-5 mt-2">
                    <h2 className="flex gap-2">Start_Time: <p>{formatTime(slot.startTime)}</p></h2>
                    <h2 className="flex gap-2">End_Time: <p>{formatTime(slot.endTime)}</p></h2>
                  </div>
                  <div className="flex grid-cols-2 justify-between mx-5 mt-2">
                    <h2 className="flex gap-2">Date Available: <p>{slot.date}</p></h2>
                    <h2 className="flex gap-2">Time Zone: <p>{slot.timeZone}</p></h2>
                  </div>
                  <div className="flex grid-cols-2 justify-between mx-5 mt-2">
                    <h2 className="flex gap-2">Therapist Gender: <p>{slot.therapist?.personalInformation?.gender}</p></h2>
                    <h2 className="flex gap-2">Therapist Location: <p>{slot.therapist?.personalInformation?.address}</p></h2>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No available slots found.</p>
          )}
        </div>
            {isEditable && (
              <button
                onClick={() => handleUpdate(selectedTherapy)}
                className=" w-full border-2 p-2 ml-3 mt-8 rounded-md bg-red-600 text-white font-semibold"
              >
            {status === 'loading' ? 'Updating...' : 'Update'}
              </button>
            )}

            {/* <VideoCall/> */}
          </div>
        ) : (
          <Create_Therapy
            onSuccess={handleClodeModal}
            Add_Therapy={Add_Therapy}
            userId={userId}
          />
        )}
      </Modal>
      </>)}
    </div>
  );
}
