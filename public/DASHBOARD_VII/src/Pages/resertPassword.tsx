import { useState } from "react";
import { Image, Input, Button, Typography, message } from "antd";
import Mindora from "../assets/Logo/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate for redirection
import { AiOutlineArrowLeft } from "react-icons/ai";
import { resetPass } from "../Redux/Adminslice/authSlice";
import { RootState, AppDispatch } from "../Redux/store";

const { Text } = Typography;
  
export const ResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // For redirection if token is missing
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams<{ token: string }>();
  const { status } = useSelector((state: RootState) => state.auth);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      message.error("Reset token is missing");
      navigate('/login'); // Redirect to login if token is missing
      return;
    }

    if (!password) {
      message.warning("Please enter a password before!");
      return;
    }

    if (!confirmPassword) {
      message.warning("Please confirm your password before!");
      return;
    }
    
    if (password !== confirmPassword) {
      return message.warning("Passwords do not match!");
    }
    
    const resultAction = await dispatch(resetPass({ password, confirmPassword, token }));
    
    if (resetPass.fulfilled.match(resultAction)) {
      message.success("Password reset successful");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
    } else {
      message.error("Failed to reset password: " + resultAction.payload);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white flex flex-col items-center rounded-md p-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Reset Password
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
              Enter a new password to reset your account.
            </h2>
            <Text className="text-md text-black font-semibold">
              Enter Password:
            </Text>
            <Input
              type="password"
              className="my-2 py-2"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Text className="text-md text-black font-semibold">
              Confirm Password:
            </Text>
            <Input
              type="password"
              className="my-2 py-2"
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="justify-between">
              <Button 
                type="primary" 
                className="w-full" 
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Processing..." : "Reset Password"}
              </Button>
              <p className="text-black mt-2 flex flex-row gap-2 items-center">
                <AiOutlineArrowLeft size={24}/>
                Back to{" "}
                <a href="/login" className="text-purple-600 font-bold">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};