import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { FaSync, FaTrash } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { Button, Form, Input, message, Modal, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  createGoal,
  deleteGoals,
  getAllGoals,
  updateGoals,
} from "../../Redux/TherapistSlice/Goals";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import { FiClock } from "react-icons/fi";

interface Goal {
  id: string;
  description: string;
  targetDate: string;
  status: string;
}
interface TreatmentPlanPros{
  callMilestone?: ()=>void;
}
export default function TreatmentPlan_Goal({callMilestone}:TreatmentPlanPros) {
  const status = useSelector((state: RootState) => state.goalPlan.status);
  const [loading, setLoading] = useState(false);
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState(false);
  const [treatmentPlanId, setTreatmentPlanId] = useState<string | null>(null);
  const [Goaldata, setGoalData] = useState<Goal[]>([]);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  const showModal = (goal: Goal) => {
    setEditModalVisible(true);
    setCurrentGoalId(goal.id);
    form.setFieldsValue({
      description: goal.description,
      targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : "",
      status: goal.status,
    });
  };

  const handleCancelModal = () => {
    setEditModalVisible(false);
    form.resetFields();
    if(treatmentPlanId){
      form.setFieldsValue({
        treatmentPlanId: treatmentPlanId,
      });
      
    }
    // dispatch(resetStatus());
  };

  // useEffect for Getting Single treatmentPlan
  useEffect(() => {
    const storedPlanId = localStorage.getItem("treatmentPlanId");
    if (storedPlanId) {
      setTreatmentPlanId(storedPlanId);
      form.setFieldsValue({
        treatmentPlanId: storedPlanId,
      });
    }
  }, [form]);
  const formatDate = (dateString:any) => {
    const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  // useEffect for Getting All Goals

  useEffect(() => {
    const fetchGoals = async () => {
      if(status!=="loading"){
      try {
        setLoading(true);
        const result = await dispatch(getAllGoals());
        if (result && result.payload) {
          setGoalData(result.payload);
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to update Goal: ${errorMessage}`);
      } finally {
        setLoading(false);
      }}
    };
    fetchGoals();
}, [dispatch, status]);

  // function for creating Goals
  const handleCreateGoal = async (values: any) => {
    try {
      if (!values.treatmentPlanId) {
        message.error("Treatment Plan ID is required");
        return;
      }
      if (!values.description) {
        message.error("Description is required");
        return;
      }
      if (!values.status) {
        message.error("Status is required");
        return;
      }
      setCreatingGoal(true);
      const goalData = {
        treatmentPlanId: values.treatmentPlanId,
        description: values.description,
        status: values.status,
        targetDate: values.targetDate,
      };
      const result = await dispatch(createGoal(goalData));
      if (createGoal.fulfilled.match(result)) {
        message.success("Goal created successfully!");
        const currentTreatmentPlanId=form.getFieldValue('treatmentPlanId');
        form.resetFields();
        form.setFieldsValue({
          treatmentPlanId: currentTreatmentPlanId

        });
        dispatch(getAllGoals());
        if(callMilestone){
          callMilestone();
        }
      } else {
        message.error("Failed to create Goal.");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create Goal: ${errorMessage}`);
    } finally {
      setCreatingGoal(false);
    }
  };
  // Logics for Updating goals
  const handleUpdateGoal = async (values: any) => {
    if (!currentGoalId) {
      message.error("No goal selected for update");
      return;
    }
    try {
      setUpdatingGoal(true);
      const goalData = {
        treatmentPlanId: treatmentPlanId as string,
        description: values.description,
        status: values.status,
        targetDate: values.targetDate,
      };

      const result = await dispatch(
        updateGoals({
          id: currentGoalId as string,
          goalData: goalData,
        })
      );
      if (updateGoals.fulfilled.match(result)) {
        message.success("Goal updated successfully!");
        setEditModalVisible(false);
        form.resetFields();
        if(treatmentPlanId){
          form.setFieldsValue({
            treatmentPlanId: treatmentPlanId,
          });
        }
        dispatch(getAllGoals());
      } else {
        message.error("Failed to update treatment Goal."+ (result.error?.message || "Unknown error"));
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to update Goal: ${errorMessage}`);
    } finally {
    setUpdatingGoal(false);
    }
  };

  // Function for deleting goals
  const handleDeleteGoal = async (id: string) => {
    try {
      setLoading(true);
      await dispatch(deleteGoals(id));
      if(deleteGoals.fulfilled.match(id)) {
      message.success("Goal deleted successfully!");
      setGoalData(prev => prev.filter(goal => goal.id !== id));
    } 
    else {
      message.error("Failed to delete goal.");
    }}
    
    catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to delete goal: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded border p-6">
        <h1 className="text-black text-2xl font-semibold ml-6">Create Goals</h1>
        <Form
          form={form}
          className="p-6"
          layout="vertical"
          onFinish={handleCreateGoal}
        >
          <Form.Item
            name="treatmentPlanId"
            label="TreatmentPlanId:"
            initialValue={treatmentPlanId}
            hidden
          >
            <Input type="text" readOnly />
          </Form.Item>
          <Form.Item name="description" label="Description:"
          rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea placeholder="Enter Goal Description" />
          </Form.Item>
          {/* logic for date */}
          <div className="flex flex-row gap-2">
            <Form.Item className="w-1/2" name="targetDate" label="Target Date">
              <Input type="date" placeholder="Enter Goal Date" />
            </Form.Item>
            {/* logic for status */}

            <Form.Item className="w-1/2 rounded " name="status" label="status:">
              <Select id="status" className="w-full" defaultValue="">
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value="completed">completed</Select.Option>
                <Select.Option value="pending">pending</Select.Option>
                <Select.Option value="in-progress">in-progress</Select.Option>
              </Select>
            </Form.Item>
          </div>
          {/* logic for button */}

          <div className="flex gap-3">
            <Form.Item className="w-full">
              <Button
                className="w-2/3 bg-purple-600 text-white font-semibold"
                htmlType="submit"
                disabled={creatingGoal}
                loading={creatingGoal}
              >
                <AiOutlineSave size={20} />
                {status === "loading" ? " Loading..." : "Create Goal"}
              </Button>
              <Button
                className="bg-red-500 text-white w-1/3 "
                onClick={() => {form.resetFields();

                  if(treatmentPlanId){
                    form.setFieldsValue({
                      treatmentPlanId: treatmentPlanId,
                    });
                  }
                }}
                
              >
                <MdCancel size={20} /> Resert
              </Button>
            </Form.Item>
          </div>
        </Form>
      {/* </div> */}
      <div className="bg-white rounded-lg  border p-6 mt-4">
        <h1 className="text-black text-2xl font-semibold ">
          {" "}
          List Of All Goals
        </h1>
        {loading ? (
          <div className="flex items-center justify-center text-red-600 min-h-screen">
            <Spin size="large" />
          </div>
        ) : (
          <div className="bg-white rounded-lg  p-6">
            {Goaldata.map((Goal) => (
              <div
                key={Goal.id}
                className="bg-white rounded-lg border p-2 mt-2"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-black text-md my-3">
                      <strong>Description:</strong> {Goal.description}
                    </p>
                    <p className="text-black text-md flex my-3">
                      <FiClock size={20} className="mt-1"/><strong className="mx-2 italic">Target Date:</strong>
                      {formatDate(Goal.targetDate)}
                    </p>
                  </div>

                  <p
                    className={`italic m-5 p-2 text-sm  ${
                      Goal.status === "completed"
                        ? "text-purple-600"
                        : Goal.status === "in-progress"
                        ? "text-green-500"
                        : Goal.status === "pending"
                        ? "text-orange-400"
                        : Goal.status === "cancelled"
                        ? "text-red-700"
                        : ""
                    }`}
                  >
                    {Goal.status}
                  </p>
                  <div className="flex gap-2 my-3">
                    <Button
                      className="p-1 text-white bg-purple-600 font-semibold rounded flex gap-1 text-md"
                      onClick={() => showModal(Goal)}
                    >
                      <FaSync />
                      Update
                    </Button>
                    <Button
                      className="p-1 text-white bg-red-500 font-semibold rounded flex gap-1 text-md"
                      onClick={() => handleDeleteGoal(Goal.id)}
                    >
                      <FaTrash className="mt-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        open={editModalVisible}
        footer={null}
        onCancel={handleCancelModal}
        title="Update Goal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateGoal}
          className="bg-white rounded p-6"
        >
          <Form.Item name="description" label="Description:">
            <Input type="text" placeholder="Enter Goal Description" />
          </Form.Item>
          <Form.Item name="targetDate" label="Target Date:">
            <Input type="date" placeholder="Enter Goal Target" />
          </Form.Item>
          <Form.Item name="status" label="Goal Status">
            <Select>
              <Select.Option value="completed">completed</Select.Option>
              <Select.Option value="ongoing">ongoing</Select.Option>
              <Select.Option value="pending">pending</Select.Option>
              <Select.Option value="waiting">waiting</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item className="w-full">
              <Button
                className=" bg-purple-600 w-1/2 text-white font-semibold"
                htmlType="submit"
                disabled={status === "loading"}
                loading={status === "loading"}
              >
                <AiOutlineSave size={20} />{" "}
                {updatingGoal ? "Loading..." : "Update Treatment Goals"}
              </Button>
              <Button
                className="bg-red-500 text-white w-1/2 rounded   "
                onClick={() => form.resetFields()}
              >
                <MdCancel size={20} /> Cancel
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
