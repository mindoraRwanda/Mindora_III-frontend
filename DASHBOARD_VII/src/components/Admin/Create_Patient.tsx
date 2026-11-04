import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allPatients, createPatient } from "../../Redux/Adminslice/PatientSlice";
import { featchUserById } from "../../Redux/Adminslice/UserSlice";
import { RootState,AppDispatch } from "../../Redux/store";
import dayjs from "dayjs";

interface CreatePatientProps {
  userId: any;
  onSuccess: any;
  addPatient: (newPatient:any) => void; 
}
export default function CreatePatient({ userId, onSuccess,addPatient }:CreatePatientProps) {
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [condition, setCondition] = useState("");
  const [lastVisit, setlastVisit] = useState(null);
  const [age, setAge] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [EmergencyEmail, setEmergencyEmail] = useState("");
  const [EmergencyName, setEmergencyName]=useState("");
  const [EmergencyPhoneNumber, setEmergencyPhoneNumber]=useState("");


  const  status  = useSelector((state: RootState) => state.users.status);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("User Identification received userId:", userId);
    if (userId) {
      const feactUserData = async () => {
        try {
          const result = await dispatch(featchUserById(userId));
          if (featchUserById.fulfilled.match(result)) {
            console.log("User data:", result.payload);
            const userData = result.payload;

            form.setFieldsValue({
              name: `${userData.firstName || ""} ${userData.lastName || ""}`,
              email: userData.email || "",
              // phoneNumber: userData.phoneNumber || "",
            });
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          message.error(`Failed to get user data: ${errorMessage}`);
        }
      };
      feactUserData();
    }
  }, [dispatch, userId, form]);

  const handleSubmit = async (values:any) => {
    const { age, lastVisit, gender, condition, } = values;

    const patientData = {
      userId: userId,
      medicalProfile: {
        lastVisit: dayjs(lastVisit).format("YYYY-MM-DD"),
        condition: condition,
      },
      personalInformation: {
        age: age,
        gender: gender,
      },
      emergencyContact: {
        name:EmergencyName,
        email:EmergencyEmail,
        phoneNumber:EmergencyPhoneNumber
      },
    };
    console.log("Submitting patient data:", patientData);
    try {
      const result = await dispatch(createPatient(patientData));

      console.log("Server Patient response:", result);
      if (createPatient.fulfilled.match(result)) {
        message.success("Patient created successfully");
        addPatient(result.payload);
        onSuccess();
        form.resetFields();
        await dispatch(allPatients());
      } else {
        console.log("Error details:", result.payload);
        const errorMessage = result.payload && typeof result.payload === 'object' && 'message' in result.payload
        ? String(result.payload.message)
        : "Unknown error";
      message.error(`Patient creation failed: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create patient: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center">
      <Form
        form={form}
        layout="vertical"
        className="bg-white rounded p-6 shadow-lg"
        onFinish={handleSubmit}
      >
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New Patient
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Patient Name"
            name="name"
            // rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input
              type="text"
              value={name}
              readOnly
              className="w-full p-1 rounded border border-blue-600"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Patient Email"
            name="email"
            // rules={[
            //   { required: true, message: "Please input the email" },
            //   { type: "email", message: "Please enter a valid email" },
            // ]}
          >
            <Input
              type="email"
              value={email}
              readOnly
              className="w-full p-1 rounded border border-blue-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="EmergencyContact Name"
            name="EmergencyName"
            // rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input
              type="text"
              value={EmergencyName}
              className="w-full p-1 rounded border border-blue-600"
              onChange={(e) => setEmergencyName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="EmergencyContact Email"
            name="EmergencyEmail"
            // rules={[
            //   { required: true, message: "Please input the email" },
            //   { type: "email", message: "Please enter a valid email" },
            // ]}
          >
            <Input
              type="email"
              value={EmergencyEmail}
              className="w-full p-1 rounded border border-blue-600"
              onChange={(e) => setEmergencyEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="last Visit"
            className="w-full"
            name="lastVisit"
            // rules={[
            //   { required: true, message: "Please select the last Visit" },
            // ]}
          >
            <DatePicker
              value={lastVisit}
              onChange={(date) => setlastVisit(date)}
              className="border border-blue-600 w-full"
            />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            // rules={[{ required: true, message: "Please input the age" }]}
          >
            <Input
              type="number"
              value={age}
              className="w-full  rounded border border-blue-600"
              onChange={(e) => setAge(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Emergency PhoneNumber"
            name="EmergencyNumber"
            rules={[
              // { required: true, message: "Please input the phone number" },
            ]}
          >
            <Input
              type="number"
              value={EmergencyPhoneNumber}
              className="w-full  rounded border border-blue-600"
              onChange={(e) => setEmergencyPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            name="condition"
            // rules={[{ required: true, message: "Please input the condition" }]}
          >
            <Input
              type="text"
              value={condition}
              className="w-full  rounded border border-blue-600"
              onChange={(e) => setCondition(e.target.value)}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Gender"
          name="gender"
          // rules={[
          //   { required: true, message: "Please select the gender" },
          // ]}
        >
          <Radio.Group
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="others">Others</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 text-white p-2 rounded  w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? "creating..." : "Add new"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
