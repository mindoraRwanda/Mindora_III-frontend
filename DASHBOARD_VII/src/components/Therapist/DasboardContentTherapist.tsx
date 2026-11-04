import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { Appointment, getAppointmentById, summation_Appointment } from "../../Redux/TherapistSlice/Appointment";
import { Chart, registerables } from "chart.js";
import { getAllPatientOfTherapy } from "../../Redux/Adminslice/PatientSlice";

// Register all Chart.js components
Chart.register(...registerables);


interface UpcomingAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
}

// Mock data for upcoming appointments
const upcomingAppointments: UpcomingAppointment[] = [
  { id: "1", patientName: "John Doe", date: "2025-04-19", time: "10:00 AM", status: "Confirmed" },
  { id: "2", patientName: "Sarah Johnson", date: "2025-04-19", time: "2:30 PM", status: "Pending" },
  { id: "3", patientName: "Michael Smith", date: "2025-04-20", time: "9:15 AM", status: "Confirmed" }
] ;



export default function Home  ()  {
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const appointmentChartRef = useRef<HTMLCanvasElement | null>(null);
  const patientsChartRef = useRef<HTMLCanvasElement | null>(null);
  const treatmentGrowthChartRef = useRef<HTMLCanvasElement | null>(null);
  const sessionsChartRef = useRef<HTMLCanvasElement | null>(null);
  const appointmentChartInstance = useRef<Chart | null>(null);
  const patientsChartInstance = useRef<Chart | null>(null);
  const treatmentGrowthChartInstance = useRef<Chart | null>(null);
  const sessionsChartInstance = useRef<Chart | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const therapistId = localStorage.getItem('TherapistId');
  
  useEffect(() => {
    if(therapistId) {
      dispatch(getAppointmentById(therapistId));
    }
  }, [dispatch, therapistId]);

  useEffect(()=>{
    dispatch(getAllPatientOfTherapy(therapistId as string));
  },[dispatch, therapistId])
  
  const appointmentStatus = useSelector((state: RootState) => state.appointment.status);
  const appointments = useSelector((state: RootState) => state.appointment.appointments) as Appointment[];
  const totalAppointments = useSelector(summation_Appointment);
  
  // Function to analyze gender data from appointments
  const analyzeGenderData = (appointmentData: Appointment[]) => {
    const female = appointmentData?.filter(appt => 
      appt.patient?.personalInformation?.gender?.toLowerCase() === 'female').length || 0;
    const male = appointmentData?.filter(appt => 
      appt.patient?.personalInformation?.gender?.toLowerCase() === 'male').length || 0;
    return { female, male };
  };

  // Initialize appointment chart
  useEffect(() => {
    if (appointmentChartRef.current) {
      const ctx = appointmentChartRef.current.getContext("2d");
      if (ctx && appointmentChartInstance.current) {
        appointmentChartInstance.current.destroy();
      }

      const { female, male } = analyzeGenderData(appointments);

      appointmentChartInstance.current = new Chart(ctx!, {
        type: "doughnut",
        data: {
          labels: [`Female [${female}]`, `Male [${male}]`],
          datasets: [{
            data: [female, male],
            backgroundColor: ["#FBA834", "#387ADF"],
          }]
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          cutout: '65%',
        }
      });
    }
  }, [appointments]);

  // Initialize patients chart
  useEffect(() => {
    if (patientsChartRef.current) {
      const ctx = patientsChartRef.current.getContext("2d");
      if (ctx && patientsChartInstance.current) {
        patientsChartInstance.current.destroy();
      }

      patientsChartInstance.current = new Chart(ctx!, {
        type: "doughnut",
        data: {
          labels: ["Female [6]", "Male [4]"],
          datasets: [{
            data: [6, 4],
            backgroundColor: ["#41B06E", "#F7C04A"],
          }]
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }, []);

  // Initialize treatment growth chart
  useEffect(() => {
    if (treatmentGrowthChartRef.current) {
      const ctx = treatmentGrowthChartRef.current.getContext("2d");
      if (ctx && treatmentGrowthChartInstance.current) {
        treatmentGrowthChartInstance.current.destroy();
      }

      treatmentGrowthChartInstance.current = new Chart(ctx!, {
        type: "bar",
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{
            label: "Treatment Growth",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "#387ADF",
          }]
        },
        options: {
          responsive: true,
          animation: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    }
  }, []);

  // Initialize therapy sessions chart
  useEffect(() => {
    if (sessionsChartRef.current) {
      const ctx = sessionsChartRef.current.getContext("2d");
      if (ctx && sessionsChartInstance.current) {
        sessionsChartInstance.current.destroy();
      }

      sessionsChartInstance.current = new Chart(ctx!, {
        type: "line",
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{
            label: "Therapy Sessions",
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: "#36A2EB",
            tension: 0.1,
          }]
        },
        options: {
          responsive: true,
          animation: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, []);
  // Clear all notifications
  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-5 mt-10">
        <h1 className="text-2xl font-semibold text-gray-700">Welcome back to <strong>Dashboard</strong></h1>    
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-xl p-3 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-xl font-semibold text-gray-700">6</h4>
              <div className="text-gray-500">All Patients</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-3 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-xl font-semibold text-gray-700">
                {appointmentStatus === "loading" ? "..." : totalAppointments}
              </h4>
              <div className="text-gray-500">Total Appointments</div>
            </div>
          </div>
        </div>

        {/* Reports Card */}
        <div className="bg-white rounded-lg shadow-xl p-3 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-xl font-semibold text-gray-700">5</h4>
              <div className="text-gray-500">New Reports</div>
            </div>
          </div>
        </div>

        {/* Emergency Notifications Card */}
        <div className="bg-white rounded-lg shadow-xl p-3 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-xl font-semibold text-gray-700">{notificationCount}</h4>
              <div className="text-gray-500">Emergency Notifications</div>
            </div>
          </div>
        </div>

        {/* Active Patients Card */}
   
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Appointed Chart */}
         <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Appointed</h3>
          <div className="h-56">
          <canvas ref={appointmentChartRef} className="flex justify-center ml-10" />
          </div>
        </div>

        {/* Patients Chart */}
         <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Patients</h3>
          <div className="h-56">
          <canvas ref={patientsChartRef}  className="ml-10"/>
          </div>
        </div>

        {/* Treatment Growth Chart */}
         <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Treatment Growth</h3>
          <div className="h-56">
          <canvas ref={treatmentGrowthChartRef} />
          </div>
        </div>
      </div>
      
      {/* Middle Row - Today's Schedule & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-gray-700 font-semibold">Today's Schedule</h3>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-gray-700 font-semibold">Notifications</h3>
            {notificationCount > 0 && (
              <button 
                onClick={clearNotifications}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          {notificationCount > 0 ? (
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-red-50 rounded-lg">
                <div className="flex-shrink-0 p-2 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Emergency Alert</h4>
                  <p className="mt-1 text-sm text-red-700">Patient John Doe reported severe anxiety symptoms.</p>
                  <p className="mt-1 text-xs text-red-600">30 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Appointment Reminder</h4>
                  <p className="mt-1 text-sm text-yellow-700">You have a session with Sarah Johnson in 1 hour.</p>
                  <p className="mt-1 text-xs text-yellow-600">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">New Message</h4>
                  <p className="mt-1 text-sm text-blue-700">Dr. Rodriguez left a comment on Michael's treatment plan.</p>
                  <p className="mt-1 text-xs text-blue-600">3 hours ago</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No new notifications</p>
            </div>
          )}
        </div>
      </div>

    
    
      </div>
)}