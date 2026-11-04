import { useState } from 'react';

import AdminPatientsList from './AdminPatientList';
import AdminTherapistList from './AdminTherapistList';
import AdminUserList from './AdminUsers';
import UserEngagement from './UserEngagement';
import Messages from './Patient_Messages';
import Roles from './Roles_Permissions';
import ContentManage from './Content_Management';
import Communication from './Communicaty_Management';
import Article_Management from './Article_Management';
import BillingReports from './Billing_Report';
import Data_Security from './Data_Security';
import Data_BackUp from './Data_BackUp';
import Financial_Management from './Financial_Management';
import Legal_Complaints from './Legal_Complaints';
import Course_Management from './Course_Management';
import Settings from '../settings';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Home from './DashboardContent';
import AllAppointments from './Appointment';

const AdminDashboard = () => {
  const admin = 'admin';
  const [activeComponent, setActiveComponent] = useState('home');
  const [selectedCourseId] = useState<string | null>(null);
  
  const setActiveButton = (buttonName: string) => {
    console.log("Active button set to:", buttonName);
  };
  
  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <Home userRole={admin} />;
      case 'therapiest':
        return <AdminTherapistList />;
      case 'Admin Users':
        return <AdminUserList />;
      case 'UserEngagement':
        return <UserEngagement />;
      case 'AdminPatientList':
        return <AdminPatientsList />;
      case 'Patient_Appointment':
        return <AllAppointments />;
      case 'Patient_Messages':
        return <Messages />;
      case 'Roles and Permissions':
        return <Roles />;
      case 'Content Management':
        return <ContentManage />;
      case 'Community Management':
        return <Communication />;
      case 'Artcicle_management':
        return (
          <Article_Management
            selectedCourseId={selectedCourseId}
            setActiveButton={setActiveButton}
          />
        );
      case 'BillingReports':
        return <BillingReports />;
      case 'Data Security':
        return <Data_Security />;
      case 'Data backup':
        return <Data_BackUp />;
      case 'Financial Management':
        return <Financial_Management />;
      case 'Legal and Complaints':
        return <Legal_Complaints />;
      case 'Courses Management':
        return <Course_Management />;
      case 'Settings':
        return <Settings />;
      default:
        return <div className="flex justify-center text-black text-3xl mt-10">Component Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      {/* Sidebar */}
      <div className="h-screen overflow-y-auto bg-white w-64 shadow-md">
        <Sidebar userRole={admin} setActiveComponent={setActiveComponent} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-10">
          <TopBar userRole={admin} />
        </div>
        
        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;