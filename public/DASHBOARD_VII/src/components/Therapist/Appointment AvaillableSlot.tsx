/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Input, Button, Select, message, Switch,Spin } from "antd";
import { RootState } from "../../Redux/store";
import { AppDispatch } from "../../Redux/store";

import {
  AvaillableSlot,
  deleteAvailableSlot,
  getAllAvailableSlot,
  updateAvailableSlot,
} from "../../Redux/TherapistSlice/Appointment_Slot";
import { createAvailableSlot } from "../../Redux/TherapistSlice/Appointment_Slot";
import { CalendarIcon, ClockIcon, Edit2, GlobeIcon, PlusCircle, Trash2 } from "lucide-react";

interface SlotData {
  id: string;
  availableDay: string;
  startTime: string;
  endTime: string;
  date: string;
  timeZone: string;
  recurring: boolean;
}
export default function ManageAppointMents() {
  const [activeButton, setActiveButton] = useState("Availlable Slots");
  const [modalVisible, setModalVisible] = useState(false);
  const [editMOdal, setEditMOdal] = useState(false);
  const [slotData, setSlotData] = useState<SlotData[]>([]);
  const [currentSlot, setCurrentSlot] = useState<SlotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const dispatch = useDispatch<AppDispatch>(); 
  const [form] = Form.useForm();

  const [availableDay, setavailableDay] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [timeZone, setTimezone] = useState("");
  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [formData, setFormData] = useState({ recurring: false });

  const {status } = useSelector((state: RootState) => ({status: state.availableSlot.status}));
  

  //  useEffect to get TherapistId from localStorage when component mounts
    useEffect(() => {
    const storedTherapistId = localStorage.getItem("TherapistId");
    if (storedTherapistId) {
      console.log("Retrieved Therapist LoggedIn ID:", storedTherapistId);
      setTherapistId(storedTherapistId);
      form.setFieldsValue({
        TherapistId: storedTherapistId,
      });
      dispatch(getAllAvailableSlot(storedTherapistId));
    }
  }, [dispatch, form]);

  // This useEffect will help us to get all availableslot of Therapist
  useEffect(() => {
    const fetchAllSlots = async () => {
      try{
        setLoading(true);
      const result = await dispatch(getAllAvailableSlot(therapistId));
      if (getAllAvailableSlot.fulfilled.match(result)) {
        setSlotData(result.payload);
      }
    }
    catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to load users: ${errorMessage}`);
    }
    finally {
      setLoading(false);
    }
    };

    
    fetchAllSlots();
  }, [dispatch, therapistId]);

  
  // This is modal for create Available Slot
  const showModal = () => {
    setModalVisible(true);
  };
  const handleCancelModal = () => {
    setModalVisible(false);
  };

  // The Modal For Update Available Slot
  const ShowEditModal = (SlotData:SlotData) => {
    setEditMOdal(true);
    setCurrentSlot(SlotData);

    const startTimeFormatted = new Date(SlotData.startTime).toLocaleTimeString("en-US",{hour12: false,hour: "2-digit",minute: "2-digit"});
    const endTimeFormatted = new Date(SlotData.endTime).toLocaleTimeString("en-US",{hour12: false,hour: "2-digit",minute: "2-digit"});
    form.setFieldsValue({
      availableDay: SlotData.availableDay,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      date: SlotData.date,
      timeZone: SlotData.timeZone,
      recurring: SlotData.recurring,
    });
  };
  const handleCancelEditModal = () => {
    setEditMOdal(false);
    form.resetFields();
  };
  // function to Reset Form
  const handleResetForm = () => {
    form.resetFields();
  };
  // delete Slot
  const handleDeleteSlot = async (id:string) => {
    const confirmed = window.confirm("Do you want to delete Slot?");
    if (confirmed) {
      try {
      const result= await dispatch(deleteAvailableSlot(id));
       if(deleteAvailableSlot.fulfilled.match(result)){
        message.success("Slot deleted successfully");
        dispatch(getAllAvailableSlot(therapistId));
       }
       else{
        message.error("Failed to delete Slot");
        dispatch(getAllAvailableSlot(therapistId));
       }
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      }

    }
  };


  // function to handle form submission
  const handleSubmit = async (values:any) => {
    try {
      
      setIsCreating(true);
      const FormData = {
        id:'',
        therapistId,
        startTime: new Date(`${values.date}T${values.startTime}`).toISOString(),
        endTime: new Date(`${values.date}T${values.endTime}`).toISOString(),
        recurring: values.recurring || formData.recurring,
        date: values.date,
        availableDay: values.availableDay,
        timeZone: values.timeZone,
        location: '',
        appointmentType: '',
        status: '',
        notes: '',
      };

  const result= await dispatch(createAvailableSlot(FormData as AvaillableSlot));
 if(createAvailableSlot.fulfilled.match(result)) {
  message.success("Appointment Slot created successfully!");
  setModalVisible(false);
  form.resetFields();
  dispatch(getAllAvailableSlot(therapistId));;
 }
    } catch (error) {
      const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
    }
    finally{
      setIsCreating(false);
    }
  };

// function to handle form submission for update
const handleUpdate = async (values:any) => {
  const confirmed = window.confirm('Are you sure you want to update this appointment slot?');
  if (confirmed && currentSlot?.id) {
    try {
      setIsUpdating (true);
      const updateFormData = {
        id: currentSlot.id, 
        // therapistId,
        startTime: new Date(`${values.date}T${values.startTime}`).toISOString(),
        endTime: new Date(`${values.date}T${values.endTime}`).toISOString(),
        recurring: values.recurring || formData.recurring,
        date: values.date,
        availableDay: values.availableDay,
        timeZone: values.timeZone,
      };
    const result= await dispatch(updateAvailableSlot(updateFormData ));
    if(updateAvailableSlot.fulfilled.match(result)){
      message.success("Appointment Slot updated successfully!");
      form.resetFields();
      setEditMOdal(false);
      dispatch(getAllAvailableSlot(therapistId));
    }
    else{
      message.error("Failed to update appointment slot.");
      dispatch(getAllAvailableSlot(therapistId));
    }
   
    } catch (error) {
      const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
    }
    finally{
      setIsUpdating(false);
    }
  }
};

const handleActive = (buttonName:string) => {
  setActiveButton(buttonName);
};

const formatTime = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });
};

  const renderScheduleContent = () => (
    loading? (
      <div className="flex items-center justify-center text-red-600 min-h-screen">
      <Spin size="large" />
    </div>
             ):(
    <div className="bg-white rounded-lg shadow-xl p-6 mt-1">
    <div className="bg-white rounded-lg shadow-sm px-6 mt-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Available Appointment Slots
          </h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            onClick={showModal}
          >
            <PlusCircle size={18} />
            <span>Add New Slot</span>
          </button>
        </div>
        </div>

      {/* All Availlable Slot for the specific Therapist */}
      {slotData.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="mb-3">
              <CalendarIcon size={40} className="mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">No Appointment Slots</h3>
            <p className="text-gray-400">Click "Add New Slot" to create your first appointment slot</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {slotData.map((slot, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white ${slot.availableDay}`}>
                    {slot.availableDay}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      onClick={() =>ShowEditModal (slot)}
                      aria-label="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      onClick={() => handleDeleteSlot(slot.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <CalendarIcon size={18} className="text-indigo-500" />
                    <div>
                      <span className="text-gray-500 text-sm">Date:</span> 
                      <span className="ml-1 font-medium">{slot.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <ClockIcon size={18} className="text-indigo-500" />
                    <div>
                      <span className="text-gray-500 text-sm">Time:</span> 
                      <span className="ml-1 font-medium">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <GlobeIcon size={18} className="text-indigo-500" />
                    <div>
                      <span className="text-gray-500 text-sm">Timezone:</span> 
                      <span className="ml-1 font-medium">{slot.timeZone}</span>
                    </div>
                  </div>
                  
                  {slot.recurring && (
                    <div className="mt-2 flex items-center">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                        Recurring
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  ));

  return (
    <div className="bg-white rounded-lg shadow-xl p-3 mt-9">
      {/* Button selection */}
      <h1 className="text-black text-2xl p-2 bg-gray-100 flex justify-center font-semibold">
         Availlable Slot
        </h1>
      <div className="inline-flex p-1 mt-2 rounded-lg bg-gray-100 mb-4">
        {["Availlable Slots", "Notifications"].map(
          (buttonName) => (
            <button
              key={buttonName}
              className={`text-xl font-semibold p-2 rounded-md ${
                activeButton === buttonName
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => handleActive(buttonName)}
            >
              {buttonName}
            </button>
          )
        )}
      </div>
      {activeButton === "Availlable Slots" && renderScheduleContent()}

      <Modal
        open={modalVisible}
        footer={null}
        onCancel={handleCancelModal}
      >
        <Form
          form={form}
          className="bg-white rounded p-6"
          layout="vertical"
          onFinish={handleSubmit}
        >
          <h1 className="text-black text-lg font-semibold my-2 text-center">
            Create New Appointment Slot
          </h1>
          <Form.Item
            label="Availlable Day"
            name="availableDay"
            // rules={[{ required: true, message: "Please select a day" }]}
          >
            <Select
              value={availableDay}
              onChange={(value) => setavailableDay(value)}
              className="w-full p-1  rounded"
            >
              <Select.Option value="Monday">Monday</Select.Option>
              <Select.Option value="Tuesday">Tuesday</Select.Option>
              <Select.Option value="Wednesday">Wednesday</Select.Option>
              <Select.Option value="Thursday">Thursday</Select.Option>
              <Select.Option value="Friday">Friday</Select.Option>
              <Select.Option value="Saturday">Saturday</Select.Option>
              <Select.Option value="Sunday">Sunday</Select.Option>
            </Select>
            </Form.Item>
             <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Start Time"
              name="startTime"
              // rules={[{ required: true, message: "Please select a start time" }]}
            >
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-1  border rounded"
              />
            </Form.Item>

            <Form.Item
              label="End Time"
              name="endTime"
              // rules={[{ required: true, message: "Please select an end time" }]}
            >
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-1 border rounded"
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Date"
            name="date"
            // rules={[{ required: true, message: "Please select a date" }]}
          >
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </Form.Item>
          <Form.Item
            label="Time Zone"
            name="timeZone"
            // rules={[{ required: true, message: "Please select a timeZone" }]}
          >
            <Select
              value={timeZone}
              onChange={(value) => setTimezone(value)}
              className="w-full p-1  rounded"
            >
              <Select.Option value="Africa/Khartoum">
                Africa/Khartoum
              </Select.Option>
              <Select.Option value="America/New_York">
                America/New_York
              </Select.Option>
              <Select.Option value="Asia/Kolkata">Asia/Kolkata</Select.Option>
              <Select.Option value="Europe/London">Europe/London</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="recurring" valuePropName="checked">
            <Switch
              checked={formData.recurring}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, recurring: checked }))
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="w-full bg-purple-600 text-white font-semibold"
              htmlType="submit"
              loading={isCreating}
              disabled={isCreating}
            >
              {status === "loading" ? "Create Slot" : "Create Slot"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Edit Availlable Slot */}

      <Modal open={editMOdal} footer={null} onCancel={handleCancelEditModal}>
        <Form form={form} className="bg-white rounded p-6" layout="vertical" onFinish={handleUpdate}>
          <h1 className="text-black text-xl font-semibold my-2 text-center">
            Edit Appointment Slot
          </h1>
          <Form.Item label="Available Day:" name="availableDay">
            <Select>
              <Select.Option value="Monday">Monday</Select.Option>
              <Select.Option value="Tuesday">Tuesday</Select.Option>
              <Select.Option value="Wednesday">Wednesday</Select.Option>
              <Select.Option value="Thursday">Thursday</Select.Option>
              <Select.Option value="Friday">Friday</Select.Option>
              <Select.Option value="Saturday">Saturday</Select.Option>
              <Select.Option value="Sunday">Sunday</Select.Option>
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Start Time:" name="startTime">
         <Input type="time" className="w-full p-1 border text-black rounded" />
         </Form.Item>

            <Form.Item label="End Time:" name="endTime">
              <Input
                type="time"
                className="w-full p-1 border rounded "
              />
            </Form.Item>
          </div>
          <Form.Item label="Date:" name="date">
            <Input
              type="date"
              className="w-full p-1 border rounded"
            />
          </Form.Item>

          <Form.Item label="Time Zone:" name="timeZone">
            <Select>
              <Select.Option value="Africa/Khartoum">
                Africa/Khartoum 
              </Select.Option>
              <Select.Option value="America/New_York">
                America/New_York
              </Select.Option>
              <Select.Option value="Asia/Kolkata">Asia/Kolkata</Select.Option>
              <Select.Option value="Europe/London">Europe/London</Select.Option>
            </Select>
          </Form.Item>
          {/* Logic for Edit recurring */}

          <Form.Item name="recurring" valuePropName="checked">
  <Switch
    checked={formData.recurring}
    onChange={(checked) => setFormData((prev) => ({ ...prev, recurring: checked }))}
  />
</Form.Item>

          <Form.Item>
          <Button
  className="w-3/4 bg-purple-600 text-white font-semibold"
  htmlType="submit"
  loading={isUpdating}
  disabled={isUpdating}
>
  {status === "loading" ? "Update..." : "Update Slot"}
</Button>

            <Button
              className="w-1/4 bg-red-500 text-white font-semibold"
              onClick={handleResetForm}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {activeButton === "Notifications" && (
        <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
          <h1 className="text-black text-lg font-semibold">Notifications</h1>
          <p>No notifications at the moment.</p>
        </div>
      )}
    </div>
  );
}
