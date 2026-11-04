import { Button, Input,Modal,Select,Spin,Form,DatePicker } from "antd";
import { FaUser,FaMapMarkerAlt ,FaFile } from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import { Calendar } from 'lucide-react';
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { Appointment, getAllAppointmnets } from "../../Redux/Adminslice/AllAppointment";
import { Dayjs } from "dayjs";
const {Option}=Select;



export default function AllAppointments(){
  const [AppViewModal,setAppViewModal]=useState(false);
  const [loading,setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const {status,data:appointments}=useSelector((state:RootState)=>state.AllAppointment);


  // state for filter 

  const [searchItem,setSearchItem]=useState('');
  const [statusFilter,setStatusFilter]=useState('');
  const [appointmentDate, setAppointmentDate] = useState<Dayjs | null>(null);


useEffect(() => {
  const AllDataAppointment=async()=>{
try{
  setLoading(true);
 await dispatch(getAllAppointmnets());
}
catch(error){
  const errorMessage = (error as Error).message;
  console.error(`Failed to get update all appointments: ${errorMessage}`);
}
finally{
  setLoading(false);
}
}
AllDataAppointment();
},[dispatch]);

  const handleModal=(appointment:Appointment)=>{
    setSelectedApp(appointment);
    setAppViewModal(true);
  };
  const CancelAppModal=()=>{
    setAppViewModal(false);
    setSelectedApp(null);
  };
// this is for converting date inf proper form
const formatDate = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: '2-digit',
  });
};

const formatTime = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });
};
  // Function that will help us to filter

  const filteredAppointments = appointments?.filter(item => {
    const patientFirstName=item?.patient?.user?.firstName || '';
    const therapistName=item?.therapist?.personalInformation?.name || '';
    const patientLastName=item?.patient?.user?.lastName || '';
    const appointmentStatus=item?.status || '';
    const appointmentStartTime=item?.startTime? new Date(item?.startTime):null;

    const matchesSearch =
      !searchItem ||
      patientFirstName.toLowerCase().includes(searchItem.toLowerCase()) ||
      patientLastName.toLowerCase().includes(searchItem.toLowerCase()) ||
      therapistName.toLowerCase().includes(searchItem.toLowerCase()); 
  
    const matchesStatus =
      statusFilter ===''|| appointmentStatus.toLowerCase()=== statusFilter.toLowerCase();
  
      const matchesDate =
      !appointmentDate ||
      (appointmentStartTime && 
       appointmentDate && 
       appointmentStartTime.toDateString() === new Date(appointmentDate.format('YYYY-MM-DD')).toDateString());

    return matchesStatus && matchesDate && matchesSearch;
  }) || [];

  return(
      <div className="p-2 ml-4 bg-white rounded">
          <h4 className="text-black text-2xl mt-6 font-semibold p-3">
            Appointments Management Dashboard
          </h4>
          {loading|| status==='loading' ? (
        <div className="flex items-center justify-center text-red-600 min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
           <div className="flex gap-2 my-4 mx-2">
            <Input type="text" placeholder="Search Patient Or Therapist"
            className="focus:outline-none focus:ring-2 w-96 p-1"
            value={searchItem}
            onChange={(e)=>setSearchItem(e.target.value)}
            />
            <div className="relative">
            <DatePicker type="text" placeholder="Select Appointment Date"
            className="w-96 p-1"
            value={appointmentDate}
            onChange={(date)=>setAppointmentDate(date)}
            // format="yyyy-MM-dd"
            />
            </div>
            <Select defaultValue="Filter By Status" className="w-96 "
            value={statusFilter}
            onChange={(value)=>setStatusFilter(value)}
            >
              <Option value="">Filter By Status</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Scheduled">Scheduled</Option>
              <Option value="Canceled">Cancelled</Option>
            </Select>
           </div>
        <div className="overflow-x-auto">
        <table className="w-full border-collapse">
       <thead>
        <tr className="text-purple-600 text-sm mb-2  font-semibold text-left">
        <th>N0</th>
        <th>Patient Name</th>
        <th>Therapist Name</th>
        <th>Appointment Date</th>
        <th>Appointment Time</th>
        <th>Location</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
       </thead>
       <tbody>
       {filteredAppointments.map((item,index) => (
        <tr key={item.id} className="text-black my-2">
          <td className="my-5 py-2">{index+1}</td>
          <td className="my-5 py-2">{item.patient.user.firstName}</td>
          <td className="my-5 py-2">{item.therapist.personalInformation.name}</td>
          <td className="my-5 py-2">{formatDate(item.startTime)}</td>
          <td className="my-5 py-2">{formatTime(item.endTime)}</td>
          <td className="my-5 py-2">{item.location}</td>
          <td   className={`italic m-5 p-2 ${item?.status === "Scheduled"? "text-blue-600": item?.status === "Rescheduled"? "text-green-500": item?.status === "Canceled"? "text-red-700": ""}`}>{item.status}</td>
          <td className="my-5 py-2">
            <Button onClick={()=>handleModal(item)}>View Details</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</>)}
{selectedApp &&(
  <Modal 
  open={AppViewModal} 
  onCancel={CancelAppModal} 
  footer={null} 
  title={<h3 className="text-2xl font-semibold text-purple-600">APPOINTMENT DETAILS</h3>}
  width={700}
  className="appointment-detail-modal"
>
  <Form form={form} layout="vertical">
    <div className="border-b pb-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <FaUser size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Patient</p>
            <strong className="text-lg">
              {`${selectedApp.patient?.user?.firstName || ''} ${selectedApp.patient?.user?.lastName || ''}`}
            </strong>
          </div>
        </div>
        <span className={`px-4 py-1 rounded-full text-sm font-medium ${
          selectedApp?.status === "Scheduled" ? "bg-blue-100 text-blue-700" : 
          selectedApp?.status === "Rescheduled" ? "bg-green-100 text-green-600" : 
          selectedApp?.status === "Canceled" ? "bg-red-100 text-red-700" : ""
        }`}>
          {selectedApp.status}
        </span>
      </div>
    </div>
    
    <div className="border-b pb-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <FaUser size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Therapist</p>
          <strong className="text-md">{selectedApp.therapist?.personalInformation?.name}</strong>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4 border-b pb-4">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
          <Calendar size={20} className="text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Date</p>
          <strong className="text-md">{formatDate(selectedApp.startTime)}</strong>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
          <BiTime size={20} className="text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Time</p>
          <strong className="text-md">{formatTime(selectedApp.endTime)}</strong>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
          <FaMapMarkerAlt size={20} className="text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Location</p>
          <strong className="text-md">{selectedApp.location}</strong>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
          <FaFile size={20} className="text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Appointment Type</p>
          <strong className="text-md">{selectedApp.appointmentType}</strong>
        </div>
      </div>
    </div>
    
    <div className="mb-3">
      <p className="text-gray-500 text-sm mb-2">Notes</p>
      <div className="bg-gray-50 p-3 rounded-md border min-h-[100px]">
        {selectedApp.notes || "No notes available."}
      </div>
    </div>
    
    <div className="flex justify-end mt-4">
      <Button type="default" onClick={CancelAppModal} className="mr-2">Close</Button>
      {selectedApp.status !== "Canceled" && (
        <Button type="primary" className="bg-purple-600 text-white">
          Manage Appointment
        </Button>
      )}
    </div>
  </Form>
</Modal>
)}
</div>
  )
}