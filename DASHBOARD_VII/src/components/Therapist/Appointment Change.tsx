import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import {
  deleteAppointmentChange,
  getAllAppointmentChanges,
  Reschedule,
  updateAppointmentChange,
} from "../../Redux/TherapistSlice/AppointmentChange";
import { AppDispatch,RootState   } from "../../Redux/store";
import { message, Spin, Button, Modal, Form, Input } from "antd";
import { BiTime } from "react-icons/bi";
import TextArea from "antd/es/input/TextArea";
function AppointmentChange() {
  const [selectedChangedAppointment, setSelectedChangedAppointment] = useState<Reschedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [EditModal, setEditModal] = useState(false);
  const changedAppointments = useSelector((state: RootState) => state.reschedule.data);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchChangedAppointments = async () => {
      try {
        setLoading(true);
       await dispatch(getAllAppointmentChanges()).unwrap();

      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(
          `Failed to fetch All appointment changes: ${errorMessage}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchChangedAppointments();
  }, [dispatch]);

  // function for updating appointment change.
  const showEditModal = (changedAppointment:Reschedule) => {
    setSelectedChangedAppointment(changedAppointment);
    setEditModal(true);
    form.setFieldsValue({
      ...changedAppointment,
      newStartTime: changedAppointment.newStartTime,
      newEndTime: changedAppointment.newEndTime,
      reason: changedAppointment.reason,
    });
  };
  // function to cancel modal
  const handleCancelModal = () => {
    setEditModal(false);
  };
// function to update AppointmentChange
const handleAppointmentChange = async (value:any) => {
  try{
    setLoading(true);
    if (!selectedChangedAppointment || !selectedChangedAppointment.appointmentId) {
      message.error("Appointment ID is missing");
      return;
    }
    const data={
    ...selectedChangedAppointment,
    newStartTime: value.newStartTime,
    newEndTime: value.newEndTime,
    reason: value.reason,
  }
  await dispatch(updateAppointmentChange(data)).unwrap();
  await dispatch(getAllAppointmentChanges()).unwrap();
  message.success("Appointment change updated successfully!");
  setEditModal(false);
  form.resetFields();
}
catch (err) {
  const errorMessage = (err as Error).message;
  message.error(`Failed to update appointment change: ${errorMessage}`);
}
finally{
  setLoading(false);
}

};
const handleDelete=async(id:string|number) => {
  if (!window.confirm("Are you sure you want to delete this appointment change?")) {
    return;
  }
  try{
    setLoading(true);
    await dispatch(deleteAppointmentChange(id)).unwrap();
    message.success("Appointment change deleted successfully!");
  }
  catch (err) {
    const errorMessage = (err as Error).message;
    message.error(`Failed to delete appointment change: ${errorMessage}`);
  }
  finally{
    setLoading(false);
  }
};
  return (
    <div className="bg-white rounded-lg shadow-xl ">
      {loading ? (
        <div className="flex items-center justify-center text-red-600 min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {changedAppointments.map((changedAppointment) => (
            <div
              key={changedAppointment.id}
              className="bg-white rounded border p-4 my-2"
            >
              <div>
              <strong className="text-black mb-2">
                  { changedAppointment.otherParticipants ?
                  
                  `${changedAppointment.otherParticipant?.firstName} ${changedAppointment.otherParticipant?.lastName}`:
                  "Partient name not exist"}
                </strong>
                <h3 className="text-black mb-2 italic flex justify-end">
                  {changedAppointment.action}
                </h3>
                <div className="space-x-2 mt-1">
                  <span className="flex gap-1 text-sm my-3 text-gray-500">
                    <BiTime size={20} color="black" />
                    {changedAppointment.newEndTime}
                  </span>
                  <span className="flex gap-1 text-sm text-gray-500">
                    <BiTime size={20} color="black" />
                    {changedAppointment.newStartTime}
                  </span>
                </div>
                <p className="text-md mt-3 capitalize text-gray-500">
                  Notes: {changedAppointment.reason}
                </p>
                <Button
                  className="p-3 bg-purple-600 my-2 text-white hover:bg-purple-800 text-lg"
                  onClick={()=>showEditModal(changedAppointment)}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
                <Button
                  className="p-3 bg-red-600 text-white hover:bg-red-800 text-lg "
                  onClick={()=>handleDelete(changedAppointment.id!)}
                  disabled={loading}
                >
                 {loading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        open={EditModal}
        onCancel={handleCancelModal}
        footer={null}
        title="Update Appointmnet Change"
      >
        <Form form={form} layout="vertical" onFinish={handleAppointmentChange} >
          <Form.Item name="newStartTime" label="new Start Time">
            <Input type="time" placeholder="new Start Time" />
          </Form.Item>
          <Form.Item name="newEndTime" label="new End Time">
            <Input type="time" placeholder="new End Time" />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <TextArea  placeholder="reason" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Loading..." : "Update Change"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default AppointmentChange;
