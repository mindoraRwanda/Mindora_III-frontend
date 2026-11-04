import { Input, Modal, Form, Select, Button, message,Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import  { useEffect, useState } from "react";
import { BiEdit, BiPlus } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { AppDispatch } from "../../Redux/store";
import TextArea from "antd/es/input/TextArea";
import { MilestoneData } from "../../Redux/TherapistSlice/Milestones";
import {
  createMilestone,
  deleteMilestone,
  getAllMilestones,
  updateMilestone,
} from "../../Redux/TherapistSlice/Milestones";

export default function SetMilestones() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [milestoneData, setMilestoneData] = useState<MilestoneData[]>([]);

  const milestones = useSelector((state: RootState) => state.milestone.data);
  const [form] = useForm();
  const dispatch: AppDispatch = useDispatch();

  const handleShowModal = (milestone:any) => {
    setShowModal(true);
    setCurrentMilestone(milestone.id);
    form.setFieldsValue({
      description: milestone.description,
      targetDate: milestone.targetDate ? milestone.targetDate.slice(0, 10) : "",
      status: milestone.status,
    });
  };
  const handleCancelModal = () => {
    setShowModal(false);
    form.resetFields();
  };

  // efect to get Stored goalId
  useEffect(() => {
    const storedGoalId = localStorage.getItem("goalId");
    console.log("storeGoalId", storedGoalId);
    if (storedGoalId) {
      setGoalId(storedGoalId);
      form.setFieldsValue({ goalId: storedGoalId });
    }
  }, [form]);

  // To get all milestones
  useEffect(() => {
    const fetchAllMilestones = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getAllMilestones());
        if (result && result.payload) {
          setMilestoneData(milestones);
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      }
      finally{
        setLoading(false);
      }
    };

    fetchAllMilestones();
  }, [dispatch, milestones]);

  // function to create milestones
  const handleCreateMilestones = async (values:any) => {
    try {
      setLoading(true);
      const Data = {
        goalId: values.goalId,
        targetDate: values.targetDate,
        description: values.description,
        status: values.status,
      };
      await dispatch(createMilestone(Data));
      message.success("Milestone created successfully");
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create milestones: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // function to update milestones
  const handleUpdateMilestone = async (values: any) => {
    try {
      setLoading(true);
  
      if (currentMilestone !== null) {
        await dispatch(
          updateMilestone({
            id: currentMilestone,
            milestoneData: {
              targetDate: values.targetDate,
              description: values.description,
              status: values.status,
            },
          })
        );
        message.success("Milestone updated successfully");
        form.resetFields();
        setShowModal(false);
      } else {
        message.error("Failed to update milestone: currentMilestone is null");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to update milestone: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // function to delete milestones
  const handleDeleteGoal = async (id:any) => {
    try {
      setLoading(true);
      await dispatch(deleteMilestone(id));
      message.success("Milestone deleted successfully");
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to delete milestone: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-white rounded  border p-6">
      {/* <h1 className="text-white font-semibold rounded-sm text-3xl bg-purple-600 p-2 w-full">
        Treatment Plan Management - Milestones
      </h1> */}
      <div className="bg-white rounded  p-2 my-1">
        <div className="bg-slate-100 p-2 flex justify-between">
          <h2 className="text-purple-600 text-3xl font-semibold">
             Milestones
          </h2>
          <button
            className="text-white mr-4 p-2 bg-purple-600 rounded-md flex font-semibold"
            onClick={handleShowModal}
          >
            {" "}
            <BiPlus size={23} />
            Add new
          </button>
        </div>
         
          {loading? (
   <div className="flex items-center justify-center text-red-600 min-h-screen">
   <Spin size="large" />
 </div>
          ):(
            <div className="bg-white   p-6 my-3 ">
            {milestoneData.map((milestone) => (
              <div key={milestone.id} className="flex justify-between">
                <div>
                  <h2 className="text-black  text-xl my-2">
                    <strong>Description:</strong>
                    <br />
                    {milestone.description}
                  </h2>
                  <p className="text-black text-md my-2">
                    <strong>TargetDate: </strong> {milestone.targetDate}
                  </p>
                </div>
                <div className="bg-transparent  p-2">
                  <p
                    className={`italic  text-sm  ${
                      milestone.status === "completed"
                        ? "text-purple-600"
                        : milestone.status === "in-progress"
                        ? "text-green-500"
                        : milestone.status === "pending"
                        ? "text-orange-400"
                        : milestone.status === "cancelled"
                        ? "text-red-700"
                        : ""
                    }`}
                  >
                    {milestone.status}
                  </p>
                </div>
                <div className="">
                  <Button className="mr-3 p-2 bg-purple-600 text-white font-semibold"
                    onClick={()=>handleShowModal(milestone)}>
                    <BiEdit size={20} /> update
                  </Button>
                  <Button
                    className="mr-3 p-2 bg-red-500 text-white font-semibold"
                    onClick={() => handleDeleteGoal(milestone.id)}
                  >
                    <FaTrash size={20} /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )};
        </div>
    
      <Modal footer={null} visible={showModal} onCancel={handleCancelModal}>
        {/* Add your modal content here */}
        <Form
          form={form}
          layout="vertical"
          onFinish={currentMilestone ? handleUpdateMilestone : handleCreateMilestones}
          initialValues={{ goalId }}
        >
          <h1 className="text-black text-2xl font-semibold my-3">
          {currentMilestone ? "Update Milestone" : "Create Milestone"}
          </h1>
          {!currentMilestone && (
            <Form.Item name="goalId" label="Enter GoalId:" hidden>
             <Input
  className="p-2 text-black"
  type="text"
  readOnly
  value={goalId || ""} 
  hidden
/>
            </Form.Item>
          )}
          <Form.Item name="description" label="Description:">
            <TextArea
              className="w-full rounded-md p-2 "
              placeholder="Enter milestone description"
            />
          </Form.Item>
          <Form.Item name="targetDate" label="Targetdate:">
            <Input
              type="date"
              className="p-2"
              placeholder="Enter target date"
            />
          </Form.Item>
          <Form.Item name="status" label="Status:">
            <Select  defaultValue="">
              <Select.Option value="">Select Status</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="not Started">Not Started</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex">
          <Button className="w-3/4 p-2 bg-purple-600 text-white font-semibold" htmlType="submit" loading={loading} disabled={loading}>
              <BiPlus size={23} />
              {status === "loading" ? "Loading..." : currentMilestone ? "Update Milestone" : "Create Milestone"}
            </Button>
            <Button
              className="w-1/4 p-2 bg-red-500 text-white"
              onClick={() => form.resetFields()}
            >
              <MdCancel size={20} /> Resert
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
