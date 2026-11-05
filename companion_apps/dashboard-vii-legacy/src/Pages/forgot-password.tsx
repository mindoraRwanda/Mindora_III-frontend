import { Input, Button, Image, Typography, message } from "antd";
import { useDispatch,useSelector } from "react-redux";
import Mindora from "../assets/Logo/logo.png";
import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { forgotPass } from "../Redux/Adminslice/authSlice";
import { RootState,AppDispatch } from "../Redux/store";

const Text = Typography;
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const {status}=useSelector((state:RootState)=>state.auth);


  const handleSubmit = async () => {
    if (!email) {
      return message.warning("Please enter your email address.");
    }
    try {
      const result = await dispatch(forgotPass({ email }));

      if (forgotPass.fulfilled.match(result)) {
        message.success("Password reset link has been sent to your email");
        setEmail("");
      } else {
        message.error("Failed to reset password: " + result);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to resert password: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white flex flex-col items-center rounded-md p-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Forgot Password ?
        </h1>
        <div className="flex space-x-8">
          <div className="rounded-lg w-96 h-96 flex items-center justify-center">
            <Image
              src={Mindora}
              alt="logo"
              style={{ objectFit: "cover", height: "384px", width: "384px" }}
            />
          </div>
          <div className="rounded-lg w-96 justify-center">
            <h2 className="text-md text-gray-700 my-3">
              Enter your email address to reset your password.
            </h2>
            <Text className="text-md text-black font-semibold">
              Enter Your Email:
            </Text>
            <Input
            type="email"
              className="my-2 py-2"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
           
            />
            <div className=" justify-between">
              <Button type="primary" className="w-full" onClick={handleSubmit}
              disabled={status==="loading"}
              >
                Forgot Password
              </Button>
              <p className="text-black mt-2 flex flex-row gap-2">
                <AiOutlineArrowLeft size={24}/>
                Back to{" "}
                <a href="/" className="text-purple-600 font-bold">
                  Login ?
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
