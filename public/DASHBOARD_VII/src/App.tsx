import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import ForgotPassword from './Pages/forgot-password';
import { ResetPassword } from './Pages/resertPassword';
import ViewAppointment from './components/Therapist/Appointment AvaillableSlot';
import AdminDashboard from './components/Admin/Home';
import DashboardPage from './components/Therapist/Home';

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path="/dashboard" element={<AdminDashboard/>} />
      <Route path="/therapy" element={<DashboardPage/>} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />
      <Route path="/src/components/Therapist/ViewAppointment.tsx" element={<ViewAppointment/>} />
    </Routes>
  );
}

export default App;