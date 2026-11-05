import  { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Pagination, Select,Spin, Steps } from "antd";
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { FaSync, FaTrash, FaUser,FaPhone, FaMapMarkerAlt, FaFirstAid, FaExclamationTriangle, FaPills, FaPlus } from "react-icons/fa";
import PatientsList from "./PatientsList";
import { useDispatch, useSelector } from "react-redux";



import {
  createPlan,
  deleteTreatmentPlan,
  getAllTreatmentPlan,
  resetStatus,
  updateTreatmentPlan,
} from "../../Redux/TherapistSlice/TreatmentPlan";
import { RootState,AppDispatch } from "../../Redux/store";
import TextArea from "antd/es/input/TextArea";
import { getPatientById } from "../../Redux/Adminslice/PatientSlice";
import TreatmentPlan_Goal from "./SetGoal";
import SetMilestones from "./SetMilestones";
import { FiClock } from "react-icons/fi";



interface Patient {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    address: string;
  };
  medicalProfile: {
    conditions: string;
    allergies: string;
    medications: string;
  };
}

// Update TreatmentPlan to include the patient property
export interface TreatmentPlan {
  id: string;
  therapistId: string;
  patientId: string;
  startDate: string;
  endTime?: string;
  endDate: string;
  title: string;
  description: string;
  status: string;
  patient: Patient;
}
const{Step}=Steps;

export default function TreatmentPlanContent() {
  const [activeButton, setActiveButton] = useState("All Patients");
  const [TreatmentData, setTreatmentData] = useState<TreatmentPlan[]>([]);
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan|null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewAdjustments, setViewAdjustments] = useState<boolean | null>(null);
  const [ActiveAjustButton, setActiveAjustButton] = useState<string>("progress");
  const [newAjustment, setNewAdjestment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep,setCurrentStep]=useState(0);
  const [currentPage,setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => ({
    status: state.treatmentPlan?.status,
    error: state.treatmentPlan?.error,
  }));
  const steps=[
    {
      title:"Create Plan",
      content:(
         <Form
              form={form}
              className="bg-white rounded p-6"
              layout="vertical"
              onFinish={(values)=>{handleCreatePlan(values);
                setCurrentStep(currentStep+1);}}
            >
              <h1 className="text-black text-2xl font-semibold mb-5 ">
                Create Patient Plan
              </h1>
              <Form.Item label="PatientId:" name="patientId" hidden>
                <Input type="text" placeholder="Enter patientId ..." readOnly />
              </Form.Item>

              <Form.Item
                label="TherapistId:"
                name="TherapistId"
                initialValue={therapistId}
                hidden
              >
                <Input
                  type="text"
                  placeholder="Enter therapistId... "
                  readOnly
                />
              </Form.Item>
              <Form.Item label="Treatment Title:" name="treatmentTitle">
                <Input type="text" placeholder="Enter treatmentTitle..." />
              </Form.Item>
              <Form.Item label="Description:" name="description">
                <TextArea  placeholder="Enter description..." />
              </Form.Item>
              <div className="flex gap-2">
                <Form.Item
                  label="Start Date:"
                  name="startDate"
                  className="w-1/2"
                >
                  <Input type="date" placeholder="Enter startDate..." />
                </Form.Item>
                <Form.Item label="End Date:" name="endDate" className="w-1/2">
                  <Input type="date" placeholder="Enter endDate..." />
                </Form.Item>
              </div>
              <Form.Item label="Status:"name="status">
                <Select id="status" className="w-full">
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value="Active">Pending</Select.Option>
                  <Select.Option value="Ongoing">Ongoing</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                  <Select.Option value="Cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>

              <div className="flex gap-2">
                <Form.Item className="w-full">
                  <Button
                    className="w-2/3 bg-purple-600 text-white font-semibold"
                    htmlType="submit"
                    loading={status === "loading"}
                    disabled={status === "loading"}
                  >
                    <AiOutlineSave size={20} />{" "}
                    {status === "loading"
                      ? "Creating..."
                      : "Create Treatment Plan"}
                  </Button>
                  <Button
                    className="bg-red-500 text-white w-1/3 "
                    onClick={() => form.resetFields()}
                  >
                    <MdCancel size={20} /> Cancel
                  </Button>
                </Form.Item>
              </div>
            </Form>
      ),
    },
    {
      title:"Create Goal",
      content:(
        <div>
          <TreatmentPlan_Goal callMilestone={()=>setCurrentStep(currentStep+1)}/>
          <div className="flex justify-between">
          <Button type="primary" onClick={()=>setCurrentStep(currentStep-1)}>Previous</Button>
          <Button type="primary" onClick={()=>setCurrentStep(currentStep+1)} className="mr-5">Next</Button>
          </div>
        </div>
      )
    },
    {
      title:"Create Milestone",
      content:(
        <div>
           <SetMilestones/>
           <div className="flex justify-between my-2">
          <Button type="primary" onClick={()=>setCurrentStep(currentStep-1)} >Previous</Button>
          <Button type="primary"onClick={()=>setCurrentStep(0)}className="mr-5">Done</Button>
          </div>
        </div>
      ),
    },
  ];

  // This is used for getting Therapist It Logged In
  useEffect(() => {
    const storedTherapistId = localStorage.getItem("TherapistId");
    if (storedTherapistId) {
      setTherapistId(storedTherapistId);
      console.log("Retrieved Therapist LoggedIn id:", storedTherapistId);
      form.setFieldsValue({
        TherapistId: storedTherapistId,
      });
    }
  }, [form]);

  // This used for status
  useEffect(() => {
    try {
      if (status === "succeeded") {
        form.resetFields();
        dispatch(resetStatus());
        setActiveButton("All Patients");
      } else if (status === "rejected" && error) {
        message.error(error || "Failed to create treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create treatment plan: ${errorMessage}`);
    } 
  }, [status, dispatch, form, error]);

  // Logic for getting all TreatmentPlan
  useEffect(() => {
    const getTreatmentData = async () => {
      try{
        setLoading(true);
      const result = await dispatch(getAllTreatmentPlan());
      if (getAllTreatmentPlan.fulfilled.match(result)) {
        const treatData = result.payload;
        setTreatmentData(treatData);
      }}
      catch (error) {
        const errorMessage = (error as Error).message;
      message.error(`Failed to fetch treatment Plan: ${errorMessage}`);
      }
      finally{
        setLoading(false);
      }
    };
    getTreatmentData();
  }, [dispatch, setLoading]);

  useEffect(() => {
    if (status === "succeeded") {
      setEditModalVisible(false);
      form.resetFields();
    }
  }, [status, form]);
  
  const showModal=(plan:TreatmentPlan)=>{
    setSelectedPlan(plan);
    form.setFieldsValue({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate ? plan.startDate.split("T")[0] : "",
      endDate: plan.endDate ? plan.endDate.split("T")[0] : "",
      status: plan.status,
    });
    setEditModalVisible(true);
  };

  const handleCancelModal = () => {
    form.resetFields();
    setEditModalVisible(false);
  };
  const handleProfile =(patient:any) => {
    console.log("selected Plan to patient:",patient);
    setSelectedPatient(patient);
    setProfileModal(true);
  };
const handleCancelProfile=()=>{
  setProfileModal(false);
  };

  // Function to get selected Patient Information form database
  const handlePatientSelected = (patientId:string) => {
    console.log("selected Patient Id",patientId);
    if (patientId) {
      const getPatientData = async () => {
        try {
          setLoading(true);
          const result = await dispatch(getPatientById(patientId));
          if (getPatientById.fulfilled.match(result)) {
            message.success("Patient Selected successfully");
            const patientData = result.payload;
            console.log("SELECTED Patients Data:", patientData);
            form.setFieldsValue({
              patientId: patientData.id,
              TherapistId: therapistId,
            });
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          message.error(`Failed to get patient data: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      };
      getPatientData();
      setActiveButton("Create Plan");
    }
  };

  // Logics for Treatment Plan
  const handleCreatePlan = async (values:any) => {
    try {
      setLoading(true);
      const formData = {
        therapistId: values.TherapistId,
        patientId: values.patientId,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        title: values.treatmentTitle,
        description: values.description,
        status: values.status,
      };
      const result = await dispatch(createPlan(formData));
      if (createPlan.fulfilled.match(result)) {
        message.success("Treatment plan created successfully!");
        form.resetFields();
        dispatch(resetStatus());
        setActiveButton("Create Plan");
      } else if (createPlan.rejected.match(result)) {
        message.error("Failed to create treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create Treatment Plan: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Function To update TreatmentPlan

  const handleUpdatePlan = async (values:any) => {
    if (!selectedPlan || !selectedPlan.id) {
      message.error("No valid plan selected for update");
      return;
  }
    try {
      setLoading(true);
      const formData = {
        id:selectedPlan.id,
        updateTreatmentData:{
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        id: selectedPlan.id,           
        patientId: selectedPlan.patientId, 
        therapistId: selectedPlan.therapistId,
        title: values.title,
        description: values.description,
        status: values.status,
        }
      };
      const result = await dispatch(updateTreatmentPlan(formData));
      if (updateTreatmentPlan.fulfilled.match(result)) {
        message.success("Treatment plan updated successfully!");
        setEditModalVisible(false);
        form.resetFields();
        dispatch(resetStatus());
        setActiveButton("View Plans");
      
      } else if (updateTreatmentPlan.rejected.match(result)) {
        message.error("Failed to update treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to Update Treatment Plan: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fucntion to delete Plan
  const handleDeletePlan = async (id:string) => {
    if (!id) {
      message.error("Invalid plan ID");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete");
    if (confirmed) {
      try {
        setLoading(true);
        const result = await dispatch(deleteTreatmentPlan(id));
        if (deleteTreatmentPlan.fulfilled.match(result)) {
          message.success("Treatment plan deleted successfully!");
          setEditModalVisible(false);
          setActiveButton("View Plans");
          dispatch(resetStatus());
        
        } else if (deleteTreatmentPlan.rejected.match(result)) {
         message.error("Failed to delete treatment Plan");
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
          message.error(`Failed to delete treatment Plan: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Part of Treatment Adjutsment 
  const handleAdjustment=(plan: TreatmentPlan)=>{
    if(!plan ||!plan.id){
      message.error("No valid plan selected for adjustment");
      return;
    }
    setSelectedPlan(plan);
    setViewAdjustments(true);
  };
  const formatTime = (isoString:string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleActive = (buttonName:any) => {
    setActiveButton(buttonName);
  };
  const renderContent = () => {
    switch (activeButton) {
      case "All Patients":
        return <PatientsList goToPlan={handlePatientSelected} />;
      case "Create Plan":
        return (
          <div className="bg-white rounded-lg  border p-6 mt-3">
            <Steps current={currentStep}>
              {steps.map((step,index)=>(
                <Step key={index} title={step.title}/>
              ))}
            </Steps>
            <div className="mt-6">{steps[currentStep].content}</div>
          </div>
        );
      case "View Plans":{
        const startIndex=(currentPage-1)*itemsPerPage;
        const endIndex=startIndex+itemsPerPage;
        const PlanToDisplay=TreatmentData.slice(startIndex, endIndex);
      
        return loading? (
            <div className="flex items-center justify-center text-red-600 min-h-screen">
            <Spin size="large" />
          </div>
                   ):(
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                    {PlanToDisplay.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 mt-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between">
                          <div className="flex-1">
                            {/* Header with patient name and status */}
                            <div className="flex justify-between items-center mb-3">

                               <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {item.patient?.user?.profileImage ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={item.patient?.user?.profileImage}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">{item.patient?.user?.firstName?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-xl font-medium text-gray-900">
                        {item.patient?.user?.firstName} {item.patient?.user?.lastName}
                      </div>
                    </div>
                  </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  item.status === "Completed"
                                    ? "bg-purple-100 text-purple-700"
                                    : item.status === "Ongoing"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : item.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : ""
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                  
                            {/* Problem and description */}
                            <div className="mb-4">
                              <div className="flex items-baseline mb-2">
                                <span className="text-gray-600 font-semibold w-24">Problem:</span>
                                <h2 className="text-lg font-medium text-gray-900">{item.title}</h2>
                              </div>
                              <div className="flex mb-2">
                                <span className="text-gray-600 font-semibold w-24">Description:</span>
                                <p className="text-gray-700">{item.description}</p>
                              </div>
                            </div>
                  
                            {/* Time and condition */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center">
                                <span className="text-gray-600 font-semibold w-24">Time:</span>
                                <div className="flex gap-2 items-center">
                                  <FiClock size={16} className="text-purple-600" />
                                  <span className="text-gray-600">{formatTime(item.startDate)} - {formatTime(item.endDate)}</span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 font-semibold w-24">Condition:</span>
                                <span className="text-gray-700">
                                  {item.patient?.medicalProfile?.conditions || 'No condition specified'}
                                </span>
                              </div>
                            </div>
                  
                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Button
                                className="px-3 py-1.5 text-white bg-purple-600 hover:bg-purple-700 font-semibold rounded-md flex items-center gap-1 text-md transition-colors"
                                onClick={() => showModal(item)}
                              >
                                <FaSync size={14} />
                                <span>Update</span>
                              </Button>
                              <Button
                                className="px-3 py-1.5 text-white bg-red-500 hover:bg-red-600 font-semibold rounded-md flex items-center gap-1 text-md transition-colors"
                                onClick={() => item.id && handleDeletePlan(item.id)}
                              >
                                <FaTrash size={14} />
                                <span>Delete</span>
                              </Button>
                              <Button 
                                onClick={() => handleProfile(item.patient)} 
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center gap-1 transition-colors"
                              >
                                <span>View Profile</span>
                              </Button>
                              <Button 
                                className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md flex items-center gap-1 transition-colors" 
                                onClick={() => handleAdjustment(item)}
                              >
                                <span>Adjust Plan</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                    {/* Pagination */}
                    <div className="flex justify-end mt-6">
                      <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={TreatmentData.length}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                      />
                    </div>
                  
                    {/* Adjustment Section */}
                    {viewAdjustments && selectedPlan && (
                      <div className="mt-6 p-6 bg-purple-50 rounded-lg shadow-md border border-purple-100">
                        <h3 className="text-xl font-semibold mb-4 text-purple-800">
                          Adjustment Options for: {selectedPlan.title || "Selected Plan"}
                        </h3>
                        
                        <div className="flex items-center mb-6 gap-3">
                          <Button 
                            className={`px-4 py-2 rounded-md transition-colors ${
                              ActiveAjustButton === "progress" 
                                ? "bg-purple-600 text-white shadow-md" 
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveAjustButton("progress")}
                          >
                            Progress
                          </Button>
                          <Button 
                            className={`px-4 py-2 rounded-md transition-colors ${
                              ActiveAjustButton === "feedback" 
                                ? "bg-purple-600 text-white shadow-md" 
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveAjustButton("feedback")}
                          >
                            Feedback
                          </Button> 
                          <Button 
                            className={`px-4 py-2 rounded-md transition-colors ${
                              ActiveAjustButton === "tasks" 
                                ? "bg-purple-600 text-white shadow-md" 
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveAjustButton("tasks")}
                          >
                            Follow-up Tasks
                          </Button>
                        </div>
                        
                        <div className="mt-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                          {ActiveAjustButton === "progress" && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                                Progress Adjustment for: {selectedPlan?.title || "Selected Plan"}
                              </h3>
                              <Button 
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors" 
                                onClick={() => setNewAdjestment(true)}
                              >
                                <FaPlus size={14} />
                                <span>Add Progress Adjustment</span>
                              </Button>
                            </div>
                          )}
                          
                          {ActiveAjustButton === "feedback" && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                                Feedback Adjustment for: {selectedPlan?.title || "Selected Plan"}
                              </h3>
                              {/* Feedback Adjustment Components */}
                            </div>
                          )}
                          
                          {ActiveAjustButton === "tasks" && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                                Follow-up Tasks for: {selectedPlan?.title || "Selected Plan"}
                              </h3>
                              {/* Follow-up Task Adjustment Components */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
          )}
          
      default:
        return null;
    }
    
  };
  return (
    <div className="bg-white rounded border p-6">
     
        <h1 className="text-black flex justify-center  bg-gray-100   w-full p-1 mt-5 text-3xl font-semibold">
           Treatment Plan
        </h1>
    
      <div className="flex flex-row gap-1 mt-2 ">
        {["All Patients", "Create Plan", "View Plans"].map((buttonName) => (
          <button
            key={buttonName}
            className={`text-lg font-semibold p-1 rounded  ${
              activeButton === buttonName
                ? "bg-purple-600 text-white hover:bg-purple-800"
                : "bg-gray-200 text-black hover:bg-gray-400"
            }`}
            onClick={() => handleActive(buttonName)}
          >
            {buttonName}
          </button>
        ))}
        ;
      </div>

      {renderContent()}

      <Modal open={editModalVisible} footer={null} onCancel={handleCancelModal}>
        <Form
          form={form}
          className="bg-white rounded p-6"
          layout="vertical"
          onFinish={handleUpdatePlan}
        >
          <Form.Item name="title" label="Title">
            <Input
              type="text"
              placeholder="Enter title... "
              className="text-black"
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea  placeholder="Enter description..." />
          </Form.Item>

          <Form.Item name="startDate" label="Start Date">
            <Input type="date" placeholder="Enter startDate..." />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <Input type="date" placeholder="Enter endDate..." />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select  id="status" className="w-full">
              <Select.Option value="Active">Pending</Select.Option>
              <Select.Option value="Ongoing">Ongoing</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex gap-2">
            <Form.Item className="w-full">
              <Button
                className="w-2/3 bg-purple-600 text-white font-semibold"
                htmlType="submit"
                loading={status === "loading"}
                disabled={status === "loading"}
              >
                <AiOutlineSave size={20} />{" "}
                {status === "loading" ? "Updating..." : "Update Treatment Plan"}
              </Button>
              <Button
                className="bg-red-500 text-white w-1/3 "
                onClick={() => form.resetFields()}
              >
                <MdCancel size={20} /> Cancel
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      {/* The following is Modal for Profile */}
      <Modal
      footer={null}
      open={profileModal} onCancel={handleCancelProfile}>
      <div className="flex justify-center p-1">
          <div className="flex rounded-full p-3 border-2">
          <FaUser size={35}/>
          </div>  
      </div>
        {selectedPatient && (
          <>
          <div className="flex justify-center">
            <h2 className="text-xl text-black font-semibold">
              {selectedPatient.user?.firstName} {selectedPatient.user?.lastName}
            </h2>
          </div>
        <div className="border p-1">
        <h2 className="flex font-semibold text-lg">EmergencyContact: </h2>
        <h2 className="flex gap-1 my-2"><FaUser size={17}/> Name:   {selectedPatient.emergencyContact.name}</h2>
        <h2 className="flex gap-1 my-2"><FaPhone size={17}/> Phone number:   {selectedPatient.emergencyContact.phone}</h2>
        <h2 className="flex gap-1 my-2"><FaMapMarkerAlt size={17}/> Address:   {selectedPatient.emergencyContact.address}</h2>
        <h2 className="flex font-semibold text-lg">Medical Profile: </h2>
        <h2 className="flex gap-1 my-2"><FaExclamationTriangle size={17}/> allergies:   {selectedPatient.medicalProfile.allergies}</h2>
        <h2 className="flex gap-1 my-2"><FaFirstAid size={17}/> Condition:   {selectedPatient.medicalProfile.conditions}</h2>
        <h2 className="flex gap-1 my-2"><FaPills size={17}/> Medication:   {selectedPatient.medicalProfile.medications}</h2>
          </div>
          </>
        )}
      </Modal>
      <Modal open={newAjustment} onCancel={()=>{setNewAdjestment(false);form.resetFields()}} footer={null} title="Create New Adjustment">
        <Form form={form} className="bg-white rounded p-6" layout="vertical">
          <Form.Item name="title" label="Title">
            <Input
              type="text"
              placeholder="Enter title... "
              className="text-black"
            />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <TextArea  placeholder="Enter Reason...." />
          </Form.Item>
          <Form.Item name="modifiedBy" label="Modified By">
            <Input placeholder="Modified By..." />
          </Form.Item>
          <Button className="w-full bg-purple-600 p-3 text-white">New Adjestment</Button>
          </Form>
      </Modal>
    </div>
  );
}
