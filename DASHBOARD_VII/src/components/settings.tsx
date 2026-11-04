import  { useEffect, useState } from 'react'
import { Button, Input, Card, Spin, message, Image } from "antd";
import {
  LogoutOutlined, 
  SaveOutlined, 
  LoadingOutlined 
} from '@ant-design/icons';
import { Typography, Divider } from "antd";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../Redux/store'; 
import { useNavigate } from 'react-router-dom';
import { updateProfile,changePass } from '../Redux/Adminslice/authSlice';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false);
   const[oldPassword,setOldPassword]=useState('');
    const[newPassword,setNewPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate= useNavigate();
    

   
       useEffect(()=>{
          const storedFirstName = localStorage.getItem("firstName");
          const storedLastName = localStorage.getItem("lastName");
          const storedProfileImage = localStorage.getItem("profileImage");
          const storedEmail = localStorage.getItem("email");
          if(storedFirstName){
            setFirstName(storedFirstName);
          };
          if(storedLastName){
            setLastName(storedLastName);
          };
          if(storedProfileImage){
           setProfilePhoto(storedProfileImage);
          };
          if(storedEmail){
            setEmail(storedEmail);
          };
        }, []);
  const handleSave =async() => {
    setIsLoading(true);
    const UserId = localStorage.getItem('UserId');
    if(!UserId){
      message.error('User ID not found. Please login again');
      return;
    }
    setIsLoading(true);
    try{
      const response= await dispatch(updateProfile({UserId,firstName,lastName,email}));
      console.log('Response from the backend', response);
      if(updateProfile.fulfilled.match(response)){
        message.success('Profile updated successfully');
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', email);
      } else{
        const errorMessage = (response.payload as { message?: string })?.message || 'Failed to update profile';
        message.error(errorMessage);
      }
    }
    catch(error:any){
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      message.error(`Failed to update profile: ${errorMessage}`);
    }
    finally{
      setIsLoading(false);
    }
  };
    const validatePasswords = () => {
      if (!oldPassword || !newPassword||!confirmPassword) {
        message.error('All password change Fields are required');
        return false;
      }
      if (oldPassword === newPassword) {
        message.error('New password must be different from old password');
        return false;
      }
      if (newPassword.length < 5) {
        message.error('New password must be at least 5 characters long');
        return false;
      }
      if (newPassword !== confirmPassword) {
        message.error('New password and confirm password do not match');
        return false;
      }
      return true;
    };

     const handleChangePass= async () => {
        if (!validatePasswords()) return;
        const UserId = localStorage.getItem('UserId');
        console.log('Logged In UserId', UserId);
        if (!UserId) {
          message.error('User ID not found. Please login again');
          return;
        };
        setChangePassLoading(true);
        try{
      const response= await dispatch(changePass({UserId,oldPassword,newPassword}));
     if(changePass.fulfilled.match(response)){
       message.success('Changed password successfully');
       setOldPassword('');
       setNewPassword('');
       setConfirmPassword('');
     } else{
      const errorMessage = (response.payload as { message?: string })?.message || 'Failed to change password';
       message.error(errorMessage);
     }}
        catch(error:any){
          const errorMessage = error.response?.data?.message || 'Something went wrong';
          message.error(`Failed to change password: ${errorMessage}`);
        }
        finally{
          setChangePassLoading(false);
        }
      };

      const handleLogout = () => {
        setIsLogoutLoading(true);
        localStorage.clear();
        navigate("/");
        message.success('Logged out successfully');
      };

  return (
    <div className="space-x-6 mt-8 flex gap-3 flex-col md:flex-row justify-center items-center">
      <Card className='flex justify-center items-center '>
        <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-10 rounded-md' >
        <Typography.Title level={4}>Profile Information</Typography.Title>
        <Typography.Text type="secondary">Update your account profile information and settings</Typography.Text>
        
        <Divider />
        
        <div className="flex flex-col md:flex-row gap-6  items-start">
          
          <div className="flex flex-col items-center gap-2">
          <Image  src={profilePhoto || "https://via.placeholder.com/40"} 
            alt="profile" className="my-1 rounded-full " width={150} height={150} />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Typography.Text>FirstName</Typography.Text>
              <Input id="name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <Typography.Text>LastName</Typography.Text>
              <Input id="name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <Typography.Text> User Email</Typography.Text>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
          </div>

        </div>
        
        <Divider />
        
        <div className="flex justify-between">
          <Button 
            onClick={handleLogout} 
            danger 
            disabled={isLogoutLoading}
            icon={isLogoutLoading ? <Spin indicator={<LoadingOutlined />} /> : <LogoutOutlined />}
          >
            Logout
          </Button>
          <Button 
            onClick={handleSave} 
            type="primary" 
            disabled={isLoading}
            icon={isLoading ? <Spin indicator={<LoadingOutlined />} /> : <SaveOutlined />}
          >
            Save Changes
          </Button>
        </div>
        </div>
      </Card>

      <Card className='flex justify-center items-center '>
        <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-10 rounded-md'>
        <Typography.Title level={4}>Security & Privacy</Typography.Title>
        <Typography.Text type="secondary">Manage your password and security settings</Typography.Text>
        
        <Divider />
        
        <div className="space-y-4">
          <div>
            <Typography.Text>Current Password</Typography.Text>
            <Input id="current-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div>
            <Typography.Text>New Password</Typography.Text>
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <Typography.Text>Confirm New Password</Typography.Text>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>
        </div>
        
        <Divider />
        
        <div>
          <Button type="primary" disabled={changePassLoading} loading={changePassLoading} onClick={handleChangePass}>Update Password</Button>
        </div>
        </div>
      </Card>
    </div>
  )
}

