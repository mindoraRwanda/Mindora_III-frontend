import { Form, Input, Button, Radio, message } from "antd";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TiUploadOutline } from "react-icons/ti";
import { NewUser, GetAllUsers } from "../../Redux/Adminslice/UserSlice";
import { RootState } from "../../Redux/store";
import { AppDispatch } from "../../Redux/store";


export default function CreateUser() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const { status } = useSelector((state: RootState) => state.users);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPicture(file);
      message.success(`Selected file: ${file.name}`);
    }
  };
  

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFetch = async () => {
    if (!picture) {
      message.error("Please select a profile picture");
      return;
    }

    const formData = new FormData();

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phoneNumber", phone);
    formData.append("password", password);
    formData.append("gender", gender);

    if (picture) {
      formData.append("profile", picture);
    }

    try {
      const result = await dispatch(NewUser(formData));
      console.log("Redux result: ", result);

      if (NewUser.fulfilled.match(result)) {
        console.log('result: ', result);
        message.success("User created successfully");
        dispatch(GetAllUsers());
        
     

        // Reset form values
        setFirstName("");
        setLastName("");
        setUserName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setGender("");
        setPicture(null);
        navigate("/dashboard");
      } else {
        const errorMessage = result.payload && typeof result.payload === 'object' && 'message' in result.payload
        ? String(result.payload.message)
        : "Failed to create user";
      message.error(errorMessage);
      }
    } catch (error) {
      message.error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex justify-center">
      <Form
        form={form}
        layout="vertical"
        className="bg-white rounded"
        onFinish={handleFetch}
        initialValues={{
          firstName,
          lastName,
          username,
          email,
          phone,
          password,
          gender,
        }}
      >
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New User
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="FirstName:"
            name="FirstName"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="Last Name:"
            name="LastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="UserName:"
            name="Username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="Email:"
            name="userEmail"
            rules={[
              { required: true, message: "Please enter an email address" },
            ]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="Phone No:"
            name="userPhone"
            rules={[{ required: true, message: "Please enter a phone number" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="Password:"
            name="userPassword"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Gender:"
            name="userGender"
            rules={[{ required: true, message: "Please select a gender" }]}
          >
            <Radio.Group
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              className="flex flex-row"
            >
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="others">Others</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Profile Picture:" name="userPicture">
            <Input
              placeholder="Select profile picture"
              value={picture ? picture.name : ""}
              readOnly
              suffix={<TiUploadOutline onClick={handleIconClick} />}
              autoComplete="off"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Form.Item>
        </div>

        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" className="w-full" disabled={status === 'loading'}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
