import { useState } from 'react';


import { useNavigate } from 'react-router-dom';


import Home from './DasboardContentTherapist';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import TreatmentPlanContent from './TreatmentPlanupdate';
import Medication from './Medication';
import ManageAppointMents from './Appointment AvaillableSlot';
import PatientsList from './PatientsList';
import Prescription from './Prescrition';
import Appointments from './Appointmets';
import Communities from './Communities';
import Settings from '../settings';
import Reports from './Reports';
import VideoCall from '../VideoCall';

const UserRole = {
  THERAPIST: "therapist",
};

export default function DashboardPage() {
  const [userRole, setUserRole] = useState(UserRole.THERAPIST);
  const [activeComponent, setActiveComponent] = useState("Home");
  const navigate = useNavigate();
  const goToPlan = () => {
    navigate("/treatment-plan"); 
  };
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return <Home />
        case 'videoCall':
          return <VideoCall />
      case 'TreatmentPlan':
      return <TreatmentPlanContent />;
      case 'Medication':
      return <Medication />;
      case 'AvaillableSlots':
       return <ManageAppointMents />;
      case 'Patients':
       return <PatientsList goToPlan={goToPlan} />;
       case "PatientsList":
        return <PatientsList goToPlan={goToPlan} />
      case 'reports':
        return <Reports />;
          case 'Appointmets':
            return <Appointments/>;
              case'Prescription':
              return <Prescription/>
              case 'communities':
                return <Communities/>
              case 'Settings':
                return <Settings/>
      default:
       return (
        <div><h1 className='text-black text-2xl flex justify-center mt-10'>No Content</h1></div>
       );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
     <div className="h-screen overflow-y-auto bg-white w-64 shadow-md">
      <Sidebar 
        userRole={userRole} 
        setActiveComponent={setActiveComponent} 
        setUserRole={setUserRole}
      />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
      <div className="sticky top-0 z-10">
        <TopBar userRole={userRole} /> 
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}
