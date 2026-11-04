import { useState,SetStateAction,Dispatch, useEffect } from "react";
// import { BiClinic } from "react-icons/bi";

import {
  FaChartBar,
  FaUserMd,
  FaBars,
  FaHome,
  FaTimes,
  FaCog,
  
  FaList,

  FaCalendarCheck,
  FaComment,
} from "react-icons/fa";

import { Button, Image, message, Modal, Upload,Form } from "antd";
import {  FaNotesMedical, FaUpload } from "react-icons/fa6";
import { GoChevronDown } from "react-icons/go";
import { IoPeople } from "react-icons/io5";
import {  MdOutlineSettings } from "react-icons/md";
import { SiArkecosystem } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { changeProfilePicture } from "../Redux/Adminslice/UserSlice";
import { AppDispatch, RootState } from "../Redux/store";
import { BiCircle, BiUser } from "react-icons/bi";
import { BookAIcon, ClipboardList } from "lucide-react";
import { BsMegaphone } from "react-icons/bs";



interface SidebarProps {
  userRole: string;
  setActiveComponent: Dispatch<SetStateAction<string>>;
  setUserRole?: Dispatch<SetStateAction<string>>;
}



export default function Sidebar(props: SidebarProps) {
const status=useSelector((state:RootState)=>state.users.status);
  const { userRole, setActiveComponent } = props;
  const [profilePhoto, setProfilePhoto] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const [changeProfile,setChangeProfile] = useState(false);
  const [selectedFile,setSelectedFile] = useState<File| null> (null);
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [form]=Form.useForm();

  const toggleDropdown = (dropdown:any) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
// function to preview Image
const previewImage = (file: File) => {
  if (file) {
    setSelectedFile(file);
    message.success(`Selected file: ${file.name}`);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfilePhoto(result);
    }
    reader.readAsDataURL(file);
  }
}

  // function to change profile Image
  const handleProfile=async()=>{
    try{
      if(!selectedFile){
        message.error('Please select an image');
        return;
      }
      const formData=new FormData();
      formData.append('profile',selectedFile);
      const userId=localStorage.getItem('UserId');
      if(!userId){
        message.error('User ID not found');
        return;
      }
      const result = await dispatch(changeProfilePicture({id:userId,formData:formData})) as unknown as any;
     if (result) {
      message.success('Profile changed successfully');
      if (result.profileImage) {
          localStorage.setItem('profileImage', result.profileImage as string);
      }
      setChangeProfile(false);
      form.resetFields();
  }
    }
    catch(error:any){
     message.error(`Failed to get update  : ${error.message}`);

  }}

  const toggleOpenBar = () => {
    setSidebarOpen(!SidebarOpen);
  };
   // function to get name of logedIn user stored at local storage
    useEffect(()=>{
      const storedName = localStorage.getItem("fullName");
      const storedProfileImage = localStorage.getItem("profileImage");
      if(storedName){
        setName(storedName);
      }
      if(storedProfileImage){
       setProfilePhoto(storedProfileImage);
      }
    }, []);

  return (
    <>
    <>
      <button className="md:hidden fixed top-0 left-0 p-4 z-20" onClick={toggleOpenBar}>
        {SidebarOpen ? (
          <FaTimes className="text-3xl text-red-700" />
        ) : (
          <FaBars className="text-2xl text-gray-700" />
        )}
      </button>
    <div className={` overflow-auto top-0 h-screen    transform ${SidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-62 bg-white bg-opacity-90 transition duration-200 ease-in-out z-10 `}>
    <div className="flex flex-col h-screen">
      <div className="px-6 py-2">
        <h2 className="text-xl font-bold text-purple-600">Dashboard</h2>
      </div>
      <nav className="mt-8">
     
        {userRole === "therapist" ? (
          
           <>
           <div className="bg-gray-100 ml-5 w-52 rounded-md border border-purple-500">
            <div className="rounded-full flex justify-center mx-5 p-2 ">
             <Image  src={profilePhoto || "https://via.placeholder.com/40"} 
            alt="Friend" className="my-1 rounded-full " width={100} height={100} />
            </div>
            <div className="flex justify-center">
              <strong className="text-lg text-gray-500 my-2">{name}</strong>
            </div>
           <div className="flex justify-center mb-2">
             <Button className="bg-purple-600 text-white flex justify-center mt-1 " onClick={()=>setChangeProfile(true)}><FaUpload size={15}/>Upload new image</Button>
             </div>
          </div>
              <a onClick={() => setActiveComponent("Home")} className="cursor-pointer flex items-center text-xl font-semibold ml-4 my-5 text-gray-700 hover:bg-gray-50 rounded-sm  p-2 transition duration-200">
             <FaHome className="mr-3" /> Home
           </a>
           <div className="relative">
             <a
               onClick={() => toggleDropdown("appointments")}
               className="flex items-center text-xl ml-4 font-semibold  text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
             >
               <FaNotesMedical className="mr-3" /> Appointments Management <GoChevronDown className="ml-1" />
             </a>
             {openDropdown === "appointments" && (
               <div className="ml-6">
                 <a
                   onClick={() => setActiveComponent("AvaillableSlots")}
                   className="block text-lg ml-4 my-3  text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
                 >
                   <p className="flex "><BiCircle className="m-1" /> Availlable slots</p>
                 </a>
                 <a
                   onClick={() => setActiveComponent("Appointmets")}
                   className="block text-lg ml-4 my-3 text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
                 >
                   <p className="flex"><BiCircle className="m-1" /> Appointments</p>
                 </a>
               
               </div>
             )}
           </div>
           <a onClick={() => setActiveComponent("TreatmentPlan")} className="cursor-pointer flex items-center text-xl ml-4 my-3 font-semibold text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200">
             <FaCalendarCheck className="mr-3" /> Treatment Plan Management 
           </a>
           <div className="relative">
             <a
               onClick={() => toggleDropdown("MedicationManagement")}
               className="flex items-center text-xl ml-4 my-3 font-semibold text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
             >
               <FaNotesMedical className="mr-3" /> Medication Management <GoChevronDown className="ml-1" />
             </a>
             {openDropdown === "MedicationManagement" && (
               <div className="ml-6">
                 <a
                   onClick={() => setActiveComponent("Medication")}
                   className="block text-lg text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
                 >
                   <p className="flex"><BiCircle className="m-1" />Medication management</p>
                 </a>
                 <a
                   onClick={() => setActiveComponent("Prescription")}
                   className="block text-lg text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
                 >
                   <p className="flex"><BiCircle className="m-1 " />Medication Prescrition</p>
                 </a>
               </div>
             )}
           </div>
           <a
             onClick={() => setActiveComponent('PatientsList')}
             className="flex items-center text-xl my-3 ml-4 font-semibold text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
           >
             <FaList className="mr-3" /> Patients List
           </a>
           <a
             onClick={() => setActiveComponent('reports')}
             className="flex items-center font-semibold text-xl ml-4 my-3 text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer"
           >
             <FaChartBar className="mr-3" /> View Reports
           </a>
         
           <a onClick={() => setActiveComponent("communities")} className="cursor-pointer flex items-center text-xl ml-4 my-3 font-semibold text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200">
             <FaComment className="mr-3" /> Communities 
           </a>
          
           <a onClick={() => setActiveComponent('Settings')} className="flex items-center font-semibold text-xl my-2 ml-4 text-gray-700 hover:bg-white p-2 rounded-sm transition duration-200 cursor-pointer">
             <MdOutlineSettings className="mr-3" /> Setting
           </a>
         </>
          
        ) : (
          <>
          <div className="bg-gray-100 ml-5 w-52 rounded-md border border-purple-500">
            <div className="rounded-full flex justify-center mx-5 p-2 ">
          <Image  src={profilePhoto || "https://via.placeholder.com/40"} 
            alt="Friend" className="my-1 rounded-full " width={100} height={100} />
            </div>
            <div className="flex justify-center">
              <strong className="text-sm text-gray-500 my-2">{name}</strong>
            </div>
           <div className="flex justify-center my-1 rounded-md">
             <Button className="bg-purple-600  text-white rounded-md  " onClick={()=>setChangeProfile(true)}><FaUpload size={15}/>Upload new image</Button>
             </div>
          </div>
             <a onClick={() => setActiveComponent('home')} className="cursor-pointer flex items-center text-xl font-semibold ml-4 my-5 text-gray-700 hover:bg-gray-50  p-2 transition duration-200">
          <FaHome className="mr-3 text-3xl" /> Home
          </a>
            <a onClick={() => setActiveComponent('therapiest')} className="flex items-center text-xl font-semibold ml-4 my-5 text-gray-700 hover:bg-gray-50 transition p-2 duration-200 cursor-pointer">
              <FaUserMd className="mr-3 text-3xl" />  Therapists
            </a>
       
           
            <div className="relative">
              <a onClick={() => toggleDropdown("userManagement")} className="flex items-center text-xl font-semibold ml-4 my-5 text-gray-700 hover:bg-gray-50  p-2 transition duration-200 cursor-pointer">
                <BiUser className="mr-3 text-3xl" /> Users<GoChevronDown className="m-1"/>
              </a>
              {openDropdown === "userManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("Admin Users")} className="block text-lg ml-4 my-5 text-gray-700 hover:bg-gray-50  p-2 transition duration-200 cursor-pointer">
                    <p className="flex"><BiCircle className="m-1" /> User details</p>
                  </a>
                </div>
              )}
            </div>
            <div className="relative">
              <a onClick={() => toggleDropdown("patientManagement")} className="flex items-center text-xl font-semibold ml-4 my-5 text-gray-700 hover:bg-gray-50  p-2 transition duration-200 cursor-pointer">
                <IoPeople className="mr-3 text-3xl" /> Patients <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "patientManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("AdminPatientList")} className="block text-lg ml-4 my-5 text-gray-700 hover:bg-gray-50 p-2  transition duration-200 cursor-pointer">
                    <p className="flex "><BiCircle className="m-1" /> Patient List</p>
                  </a>
                  <a onClick={() => setActiveComponent("Patient_Appointment")} className="block text-lg ml-4 my-5 text-gray-700 hover:bg-gray-50 p-2 transition duration-200 cursor-pointer">
                    <p className="flex"><BiCircle className="m-1" /> Appointments</p>
                  </a>
                </div>
              )}
            </div>
      
            <a onClick={() => setActiveComponent("Community Management")} className="flex items-center text-xl font-semibold ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2  transition duration-200 cursor-pointer">
              <BsMegaphone className="mr-3 text-3xl" /> Communities
            </a>

            <div className="relative">
              <a onClick={() => toggleDropdown("CourseManagement")} className="flex items-center text-xl font-semibold ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2 transition duration-200 cursor-pointer">
                <BookAIcon className="mr-3 text-3xl" />Courses <GoChevronDown className="ml-1" />
              </a>
            {
              openDropdown ==='CourseManagement' &&(
                <div className="ml-6">
                <a onClick={() => setActiveComponent("Courses Management")} className="block text-lg ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2 transition duration-200 cursor-pointer">
                  <p className="flex text-xl"><BiCircle className="m-1 " />Courses </p>
                </a>
                </div>
              )
            }
            </div>
            <div className="relative">
              <a onClick={() => toggleDropdown("systemManagement")} className="flex items-center text-xl font-semibold ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2  transition duration-200 cursor-pointer">
                <SiArkecosystem className="mr-3" /> Contents <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "systemManagement" && (
                <div className="ml-6">
                 <a onClick={() => setActiveComponent("Roles and Permissions")} className="block text-lg ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2  transition duration-200 cursor-pointer">
                    <p className="flex"><BiCircle className="m-1 " /> Role and Permissions</p>
                  </a>
                 
             
                  {/* <a onClick={() => setActiveComponent("Content Management")} className="block text-lg ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2  transition duration-200 cursor-pointer">
                    <p className="flex"><BiCircle className="m-1 " /> Content Management</p>
                  </a> */}
                </div>
              )}
            </div>
            <div className="relative">
              <a onClick={() => toggleDropdown("dataManagement")} className="flex items-center text-xl font-semibold ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2 transition duration-200 cursor-pointer">
                <ClipboardList className="mr-3 text-3xl" /> Report <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "dataManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("BillingReports")} className="block text-lg ml-4 my-6 text-gray-700 hover:bg-gray-50 p-2 transition duration-200 cursor-pointer">
                    <p className="flex text-xl"><BiCircle className="m-1" /> Billing Reports</p>
                  </a>
                </div>
              )}
            </div>
            <a onClick={() => setActiveComponent("Settings")} className="flex items-center text-xl font-semibold ml-4 my-5 text-gray-700 hover:bg-gray-50 p-2 transition duration-200 cursor-pointer">
              <FaCog className="mr-3" /> Settings
            </a>
         
          </>
        )}
      </nav>
    </div>
    </div>
    </>
      <Modal open={changeProfile} footer={null} onCancel={()=>{setChangeProfile(false);form.resetFields()}} title='Upload new Image'>
      <div className="rounded-full flex justify-center mx-5 p-2">
     <Image  src={profilePhoto || "https://via.placeholder.com/40"} 
       alt="Friend" className="my-1 rounded-full " width={120} height={120} />
       </div>
      <div className="p-4">
       <Form form={form} layout="vertical">
       <Form.Item
       name="profile"
       label="New Profile Image"
         rules={[{ required: true, message: 'Please select an image' }]}>
           <Upload maxCount={1} 
           
           beforeUpload={(file)=>{
            previewImage(file);
             return false;
           }}
           accept="image/*"
           
           >
             <Button><FaUpload/>Select Image</Button>
           </Upload>
         </Form.Item>
     </Form>
     <Button 
     className="w-full my-2 p-4 bg-purple-600 text-white" 
     htmlType="submit" 
    onClick={handleProfile}
     loading={status === 'loading'} 
     disabled={status === 'loading'}
   >
     Save as profile Picture
   </Button>
   </div>
      </Modal>
      </>
  );
}
