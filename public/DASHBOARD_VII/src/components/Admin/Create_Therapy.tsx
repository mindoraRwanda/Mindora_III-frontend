import { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Radio, DatePicker, message } from "antd";
import { MdFileUpload } from "react-icons/md";
import { LuFileUp } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import { createTherapy, getAllTherapists } from "../../Redux/Adminslice/ThearpySlice";
import { featchUserById } from "../../Redux/Adminslice/UserSlice";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface CreateTherapyProps {
  userId: any;
  onSuccess?: () => void;
  Add_Therapy: () => void;
}

export default function CreateTherapy({ userId, onSuccess, Add_Therapy }: CreateTherapyProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [diploma, setDiploma] = useState<File | null>(null);
  const [license, setLicense] = useState<File | null>(null);
  const [email, setEmail] = useState("");

  const [form] = Form.useForm();
  const fileDiplomaInputRef = useRef<HTMLInputElement>(null);
  const filelicenseInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.Therapy);

  // the Following is for getting User form users in table
  console.log("CreateTherapy received userId:", userId);
  useEffect(() => {
    if (userId) {
      const feactUserData = async () => {
        try {
          const result = await dispatch(featchUserById(userId));
          if (featchUserById.fulfilled.match(result)) {
            const userData = result.payload;
            form.setFieldsValue({
              name: `${userData.firstName || ""} ${userData.lastName || ""}`,
              email: userData.email || "",
              phoneNumber: userData.phoneNumber || "",
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

  // this is for Submitting form of creating Therapy
  const handleSubmit = async (values: any) => {
    const { phoneNumber, gender, name } = values;

    const formData = new FormData();
    formData.append("personalInformation[name]", name);
    formData.append("personalInformation[gender]", gender);
    formData.append("personalInformation[dateOfBirth]",
      dayjs(dateOfBirth).format("YYYY-MM-DD")
    );
    formData.append("personalInformation[address]", address);
    formData.append("personalInformation[phoneNumber]", phoneNumber);

    if (diploma) {
      formData.append("diploma", diploma);
    }
    if (license) {
      formData.append("license", license);
    }

    if (!dateOfBirth) {
      message.error("Please select a valid date of birth");
      return;
    }

    if (!diploma) {
      message.error("Please upload diploma");
      return;
    }

    if (!license) {
      message.error("Please upload license");
      return;
    }
    const userId = localStorage.getItem('UserId');
  if (userId) {
    formData.append("userId", userId);
  }
    try {
      const resultAction = await dispatch(createTherapy(formData));
      console.log("Server Therapy response:", resultAction);
      if (createTherapy.fulfilled.match(resultAction)) {
        message.success("New Therapies created successfully");
        dispatch(getAllTherapists());

        setName("");
        setGender("");
        setDateOfBirth(null);
        setAddress("");
        setPhoneNumber("");
        setDiploma(null);
        setLicense(null);

        form.resetFields();

        if (onSuccess) {
          onSuccess();
        }
        
        // Call Add_Therapy function passed via props
        if (Add_Therapy) {
          Add_Therapy();
        }
        
        navigate("/dashboard");
      } else {
        console.error("Error resultAction:", resultAction);
        message.error(
          `Therapy creation failed ${(resultAction.payload as { message?: string })?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create Therapy: ${errorMessage}`);
    }
  };

  // function to upload license information
  const handlelicense = () => {
    filelicenseInputRef.current?.click();
  };

  // function to upload diploma information
  const handleDiploma = () => {
    fileDiplomaInputRef.current?.click();
  };
  // function to open files for diploma

  const handleDiplomaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDiploma(file);
      form.setFieldsValue({ diploma: file.name });
      message.success(`Selected file: ${file.name}`);
    }
  };

  // function to open files for license
  const handlelicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicense(file);
      form.setFieldsValue({ license: file.name });
      message.success(`Selected file: ${file.name}`);
    }
  };

  return (
    <div className="flex justify-center">
      <Form form={form} className="bg-white rounded" onFinish={handleSubmit}>
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New Therapy
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Name"
            name="name"
            // rules={[{ required: true, message: "Please enter your Name" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="DateofBirth"
            name="dateOfBirth"
            rules={
              [
              ]
            }
          >
            <DatePicker
              value={dateOfBirth}
              onChange={(date) => setDateOfBirth(date)}
              className="w-full p-1 rounded border border-blue-600"
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            // rules={[{ required: true, message: "Please enter your Address" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Phone No"
            name="phoneNumber"
            rules={
              [
                // { required: true, message: "Please enter your Phone Number" },
              ]
            }
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Diploma"
            name="diploma"
            rules={[{ required: true, message: "Please enter your Diploma" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              placeholder="Select diploma"
              value={diploma ? diploma.name : ""}
              readOnly
              suffix={<MdFileUpload onClick={handleDiploma} size={23} />}
              autoComplete="off"
            />
            <input
              type="file"
              ref={fileDiplomaInputRef}
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleDiplomaFileChange}
            />
          </Form.Item>

          <Form.Item
            label="license"
            name="license"
            rules={[{ required: true, message: "Please enter your license" }]}
          >
            <Input
              placeholder="Select license"
              value={license ? license.name : ""}
              readOnly
              suffix={<LuFileUp onClick={handlelicense} size={23} />}
              autoComplete="off"
              className="w-full p-1 rounded border border-blue-600"
            />
            <input
              type="file"
              ref={filelicenseInputRef}
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handlelicenseFileChange}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select Gender" }]}
        >
          <Radio.Group value={gender} onChange={(e) => setGender(e.target.value)}>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="others">Others</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            disabled={status === "loading"}
            className="w-full"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
