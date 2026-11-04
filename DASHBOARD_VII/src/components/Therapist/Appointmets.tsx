import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiTime } from "react-icons/bi";
import { FaRegCalendarAlt, FaUser,FaPhone,FaEnvelope,FaMapMarkerAlt,FaFirstAid } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import {
  deleteAppointment,
  getAppointmentById,
  updateAppointments,
} from "../../Redux/TherapistSlice/Appointment";
import { RootState, AppDispatch } from "../../Redux/store";
import { Button, Input, Modal, Select, Spin, Form, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Appointment } from "../../Redux/TherapistSlice/Appointment";
import {getAllAppointmentChanges,Reschedule } from "../../Redux/TherapistSlice/AppointmentChange";
import { createReschedule } from "../../Redux/TherapistSlice/AppointmentChange";
import AppointmentChange from "./Appointment Change";
import { BriefcaseMedicalIcon, CalendarIcon, ClockIcon, EditIcon, TrashIcon, UserIcon } from "lucide-react";
interface AppointmentFormValues {
  id?: string;
  startTime: string;
  endTime: string;
  location: string;
  appointmentType: string;
  status: string;
  notes: string;
}

function Appointments() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeView, setActiveView] = useState("all");
  const [activeButton, setActiveButton] = useState("Personal Information");
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const [selectedPatient,setSelectedPatient]=useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [RescheduleLoading, setRescheduleLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [ProfileModal,setProfileModal] = useState(false);
  const [changedAppointments, setChangedAppointments] = useState<Reschedule[]>([]);
  const [selectedAppointment, setSelectedAppointment] =useState<Appointment | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  useEffect(() => {
    const therapistId = localStorage.getItem("TherapistId");
    if (therapistId) {
      const getAllApp = async () => {
        try {
          setLoading(true);
          await dispatch(getAppointmentById(therapistId));
          const changedResult=await dispatch(getAllAppointmentChanges());
          console.log("Appointment changes data:", changedResult);
          setChangedAppointments(changedResult.payload || []);
          setLoading(false);
        } catch (error: any) {
          message.error(`Failed to load appointments: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };
      getAllApp();
    }
  }, [dispatch]);

  const getUniquePatients = () => {
    const uniquePatients = new Set(appointments.map((apt) => apt.patientId));
    return Array.from(uniquePatients);
  };


  const getAppointmentRequests = () => {
    return appointments.filter((apt) => apt.status === "Cancelled");
  };
  
  const getDisplayedAppointments = () => {
    switch (activeView) {
         case "requests":
            return getAppointmentRequests();
            case "changed":
              return [{
                id: 'appointment-change',
                component: <AppointmentChange />
              }];
         case "patients":
            { const uniquePatients = getUniquePatients();
            return uniquePatients.map((patientId) => {
                const patientAppointments = appointments.filter(
                    (apt) => apt.patientId === patientId
                );
                return patientAppointments[0];
            }); }
         default:
            return filteredAppointments; 
    }
};
  const handleStatsCardClick = (view: string) => {
    setActiveView(view);
  };
  const filteredAppointments =
    filterStatus === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
  };

  const showEditModal = (appointment: any) => {
    const formatTime = (time: string) =>
      new Date(time).toISOString().substr(11, 5);
    const formattedAppointment = {
      ...appointment,
      startTime: formatTime(appointment.startTime),
      endTime: formatTime(appointment.endTime),
    };
    setSelectedAppointment(appointment);
    form.setFieldsValue(formattedAppointment);
    setModal(true);
  };

  const handleProfileModal= (appointment: any) => {
    console.log("Selected appointment:", appointment);
    setSelectedPatient(appointment);
    setProfileModal(true);
  };

  const handleCancelModal = () => {
    setModal(false);
    form.resetFields();
  };
const handleCanceProfileModal=()=>{
  setProfileModal(false);
};
const handleActiveButton= (buttonName:any) => {
setActiveButton(buttonName);
};

// this is for time format
const formatTime = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });
};

const renderContent=()=>{
  if (!selectedPatient) return <p>No data available</p>;
  switch(activeButton){
    case "Personal Information":
    return(
    <div className="my-2 p-2 rounded-sm border grid grid-cols-2">
      <div>
         <h2 className="flex text-black gap-1 my-2"><FaUser size={20}/> Emergency Name</h2>
         <strong>{selectedPatient.patient?.emergencyContact?.name|| "no emergency name"}</strong>
         </div><div>
      <h2 className="flex text-black gap-1 my-2"><FaPhone size={20}/>  Emergency Contact </h2>
       <strong> {selectedPatient.patient?.emergencyContact?.contact|| "no emergency contact"}</strong></div>
       <div>
      <h2 className="flex text-black gap-1 my-2"><FaEnvelope size={20}/> Emergency Email</h2>
      <strong> {selectedPatient.patient?.emergencyContact?.email|| "no emergency Email"}</strong></div>
      <div>
      <h2 className="flex text-black gap-1 my-2"><FaMapMarkerAlt size={20}/> Address:</h2>
      <strong> {selectedPatient.location|| "no address"}</strong></div>
    </div>);
    case "Medical Informaton":
    return (
      <div className=" my-2 p-2 rounded-sm border">
          <h2 className="flex text-black gap-1 my-2"><FaFirstAid size={20}/> Condition</h2>
          <strong>{selectedPatient.patient?.medicalProfile?.condition || "no medical condition"}</strong>
      </div>
    );
    case "Appointment History":
      return(
        <div className="my-2 p-2 rounded-sm border">
             <h2 className="flex text-black gap-1 my-2"><FaFirstAid size={20}/> Last Visit</h2>
             <strong>{selectedPatient.patient?.medicalProfile?.lastVist || "no Last visit Appear"}</strong>

        </div>
      )
    default:
    return <p>Default View</p>;
  }
};
const handleUpdateApp = async (values: AppointmentFormValues) => {
  try {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const startTimeISO = `${today}T${values.startTime}:00.000Z`;
    const endTimeISO = `${today}T${values.endTime}:00.000Z`;
    const appointmentData = {
      id: selectedAppointment?.id,
      startTime: startTimeISO,
      endTime: endTimeISO,
      location: values.location,
      appointmentType: values.appointmentType,
      status: values.status,
      notes: values.notes,
    } as Appointment;
    await dispatch(updateAppointments(appointmentData));
    message.success("Appointment updated successfully");
    setModal(false);
    form.resetFields();
  } catch (error:any) {
    message.error("Failed to update appointment",error);
  } finally {
    setLoading(false);
  }
};

  // function to delete appointment
  const handleDelete = async (id:string) => {
    if (!id) {
      message.error('Invalid appointment ID');
      return;
    }
    console.log("selected id to be deleted",id);
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      setLoading(true);
 
       await dispatch(deleteAppointment(id)).unwrap();
      
      message.success("Appointment deleted successfully");
      setModal(false);
      form.resetFields();
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to delete appointment change: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
// codes for Open Appointment changes

const handleChangeModal=(appointment:Appointment)=>{
  console.log("Selected appointment:", appointment);
  setSelectedAppointment(appointment);
  setRescheduleModal(true);
  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.endTime);
  
  form.setFieldsValue({
    appointmentId: appointment.id,
    newStartTime: startDate.toTimeString().substring(0, 5),
    newEndTime: endDate.toTimeString().substring(0, 5),
    actionTime: new Date().toISOString().substring(0, 16),
    actionBy: localStorage.getItem('UserId'),
    reason: '',
  });
};


const handleReschedule=async(values:any)=>{
  try{
    setRescheduleLoading(true);
    if (!selectedAppointment?.id) {
      message.error('No appointment selected for rescheduling');
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const data:Reschedule={
      appointmentId: selectedAppointment.id,
      newStartTime: `${today}T${values.newStartTime}:00.000Z`,
      newEndTime: `${today}T${values.newEndTime}:00.000Z`,
      actionTime: new Date().toISOString(),
      action:values.action,
      reason:values.reason,
      actionBy:localStorage.getItem('UserId'),
    };
   const result=await dispatch(createReschedule(data));

    if(createReschedule.fulfilled.match(result)){
      message.success("Appointment rescheduled successfully");
      setRescheduleModal(false);
      form.resetFields();
    }
    else{
      const errorMessage = result.payload instanceof Error 
    ? result.payload.message 
    : 'Failed to reschedule';
  throw new Error(errorMessage);
    }
  }
    catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to reschedule appointment: ${errorMessage}`);
    
  }
  finally{
    setRescheduleLoading(false);
  }
};
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-3">
      <div className="w-full bg-gray-100 text-black font-semibold text-2xl p-3 mt-3 rounded flex justify-between">
        <h1>Appointments Management - My Appointments</h1>
        <Select
          className="mr-7 rounded-lg bg-white"
          value={filterStatus}
          onChange={handleStatusChange}
        >
          <Select.Option value="all">All Appointment</Select.Option>
          <Select.Option value="Rescheduled">Rescheduled</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
          <Select.Option value="Scheduled">Scheduled</Select.Option>
        </Select>
      </div>


      <div className="grid grid-cols-4 gap-4">
        <Button
          className={`w-full border p-10 rounded my-5 ${
            activeView === "all" ? "border-purple-600" : ""
          }`}
          onClick={() => handleStatsCardClick("all")}
        >
          <h1 className="font-bold text-black text-xl">
            {appointments.length}
          </h1>
          <div className="flex justify-center gap-2">
            <FaRegCalendarAlt size={24} color="black" />
            <h1 className="text-black text-md font-semibold">
              All Appointments
            </h1>
          </div>
        </Button>

        <Button
          className={`w-full border p-10 rounded my-5 ${
            activeView === "requests" ? "border-purple-600" : ""
          }`}
          onClick={() => handleStatsCardClick("requests")}
        >
          <h1 className="font-bold text-black text-xl">
            {getAppointmentRequests().length}
          </h1>
          <div className="flex justify-center gap-2">
            <FaRegCalendarAlt size={24} color="black" />
            <h1 className="text-black text-md font-semibold">
              Appointment Request
            </h1>
          </div>
        </Button>

  
        <Button 
        className={`w-full border p-10 rounded my-5 ${activeView === 'changed' ? 'border-purple-600' : ''}`}
          onClick={() => handleStatsCardClick('changed')}
        >
          <div className="text-2xl font-bold text-black">
          {changedAppointments.length}
          </div>
          <div className="flex justify-center gap-2">
            <BiTime size={24} color="black" />
            <h1 className="text-md text-black font-semibold">
               Appointment Changed
            </h1>
          </div>
        </Button>

        <Button 
        className={`w-full border p-10 rounded my-5 ${activeView === 'patients' ? 'border-purple-600' : ''}`}
          onClick={() => handleStatsCardClick('patients')}
        >
          <div className="text-2xl font-bold text-black">
            {getUniquePatients().length}
          </div>
          <div className="flex justify-center gap-2">
            <FaUser size={24} color="black" />
            <h1 className="text-md font-semibold text-black">Total Patient</h1>
          </div>
        </Button>
      </div>

      {loading ? (
  <div className="flex items-center justify-center h-64">
    <Spin size="large" className="text-indigo-600" />
  </div>
) : (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
      {activeView === 'all' && 'All Appointments'}
      {activeView === 'requests' && 'Appointment Requests'}
      {activeView === 'changed' && 'Modified Appointments'}
      {activeView === 'patients' && 'Patient List'}
    </h2>
    
    {getDisplayedAppointments().length === 0 ? (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <CalendarIcon size={40} className="mx-auto text-gray-400 mb-3" />
    <h3 className="text-lg font-medium text-gray-500 mb-2">No Appointments Found</h3>
    <p className="text-gray-400">There are no appointments matching your current view</p>
  </div>
) : (
  <div className="space-y-4">
    {getDisplayedAppointments().map((appointment) => {
      if ('component' in appointment) {
        return (
          <div key={appointment.id} className="w-full">
            {appointment.component}
          </div>
        );
      } else {
        return (
          <div
            key={appointment.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Header with status badge */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <img
                    src={appointment.therapist?.user.profileImage || '/default-profile.png'}
                    alt="Patient"
                    className="object-cover w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {`${appointment.patient?.user.firstName || 'Unknown'} ${appointment.patient?.user.lastName || ''}`}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {appointment.patient?.personalInformation.gender || 'Unknown'}
                  </p>
                </div>
              </div>
              <div 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment?.status === "Scheduled" 
                    ? "bg-blue-100 text-blue-700" 
                    : appointment?.status === "Rescheduled" 
                    ? "bg-green-100 text-green-700" 
                    : appointment?.status === "canceled" 
                    ? "bg-red-100 text-red-700" 
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {appointment?.status}
              </div>
            </div>
            
            {/* Appointment details */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BriefcaseMedicalIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium text-gray-800">{appointment.appointmentType}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MdLocationOn className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-800">{appointment.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium text-gray-800">{formatTime(appointment.startTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="font-medium text-gray-800">{formatTime(appointment.endTime)}</p>
                  </div>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  className="px-4 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md font-medium text-sm flex items-center gap-1"
                  onClick={() => showEditModal(appointment)}
                  disabled={loading}
                >
                  <EditIcon className="w-4 h-4" />
                  {loading ? "Updating..." : "Update"}
                </Button>
                
                <Button
                  className="px-4 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md font-medium text-sm flex items-center gap-1"
                  onClick={() => 'component' in appointment ? null : handleChangeModal(appointment)}
                  disabled={loading || 'component' in appointment}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {loading ? "Reschedule..." : "Reschedule"}
                </Button>
                
                <Button
                  className="px-4 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-md font-medium text-sm flex items-center gap-1"
                  onClick={() => handleDelete(appointment.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </Button>
                
                <Button
                  className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-sm flex items-center gap-1"
                  onClick={() => handleProfileModal(appointment)}
                  disabled={loading}
                >
                  <UserIcon className="w-4 h-4" />
                  {loading ? "Loading..." : "View Profile"}
                </Button>
              </div>
            </div>
          </div>
        );
      }
    })}
  </div>
)}
  </div>
)}
      <Modal
        open={modal}
        onCancel={handleCancelModal}
        footer={null}
        title="Update Appointment"
        >
        <Form
          form={form}
          className="bg-white rounded-lg shadow-xl p-6"
          layout="vertical"
          onFinish={handleUpdateApp}
         >
          <div className="grid grid-cols-2 gap-1">
            <Form.Item name="location" label="Location">
              <Input className="p-2" />
            </Form.Item>
            <Form.Item name="appointmentType" label="Appointment Type">
              <Input className="p-2" />
            </Form.Item>
            <Form.Item name="startTime" label="Start Time">
              <Input className="p-2" type="time" />
            </Form.Item>
            <Form.Item name="endTime" label="End Time">
              <Input className="p-2" type="time" />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Notes">
            <TextArea className="p-2 rounded-md" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
              <Select.Option value="Scheduled">Scheduled</Select.Option>
              <Select.Option value="Rescheduled">Rescheduled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-purple-600 text-white w-full"
              loading={loading}
            >
              Update Appointment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    {/* Modal for appointment change */}
    <Modal
      open={rescheduleModal}
      onCancel={()=>{setRescheduleModal(false);form.resetFields()}}
      footer={null}
      title="Reschedule Appointment">
      <Form
        form={form}
        className="bg-white rounded-lg shadow-xl p-6"
        layout="vertical"
        onFinish={handleReschedule}
      >
        <Form.Item name="appointmentId" label="Appointment ID" hidden>
          <Input className="p-1 rounded" disabled />
        </Form.Item>
     

        <div className="grid grid-cols-2 gap-2">
          <Form.Item name="newStartTime" label="New Start Time">
            <Input className="p-1" type="time" />
          </Form.Item>
          
          <Form.Item name="newEndTime" label="New End Time">
            <Input className="p-1" type="time" />
          </Form.Item>
         
          <Form.Item name="action" label="Action" initialValue="Rescheduled">
            <Select>
              <Select.Option value="Rescheduled">Rescheduled</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="actionBy" label="Action By" hidden>
            <Input className="p-1 rounded-md text-black" disabled />
          </Form.Item>
        </div>
        <Form.Item name="reason" label="Reason">
          <TextArea className="p-2 rounded-md" />
        </Form.Item>
        
        <Button
          type="primary"
          htmlType="submit"
          className="bg-purple-600 text-white w-full"
          disabled={RescheduleLoading}
        >
          {RescheduleLoading ? "Rescheduling..." : "Reschedule appointment"}
        </Button>
      </Form>
    </Modal>

  {/* Modal to display medical profile of patient */}
  <Modal
  open={ProfileModal}
  footer={null}
  onCancel={handleCanceProfileModal}
  >
 {selectedPatient && selectedPatient.patient && (
    <div>
      <div  className=" flex justify-center  ">
        <div  className=" p-6 flex justify-center border rounded-full">
        <img src={selectedPatient.therapist.user.profileImage}
                  alt="UserProfile"
                  className="object-cover w-12 h-12 rounded-full" 
                  width={120}
                  height={120} 
                  />
      </div>
      </div>
      <strong className="text-black text-xl flex justify-center">
        {`${selectedPatient.patient.user.firstName} ${selectedPatient.patient.user.lastName}`}
      </strong>
      <div className="flex flex-row gap-9 bg-gray-200 rounded-sm p-1 mt-2">
        {['Personal Information','Medical Informaton','Appointment History'].map((buttonName)=>(
          <button
            key={buttonName}
            className={`flex  text-md text-white m-1 bg-purple-500 rounded ${activeButton === buttonName? 'text-black' : ''}`}
            onClick={()=>handleActiveButton(buttonName)}
          >
            {buttonName}
          </button>
        ))}

      </div>
      {renderContent()}
    </div>
   
  )}

  </Modal>
    </div>
  );
}

export default Appointments;
