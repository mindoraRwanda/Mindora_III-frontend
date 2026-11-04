import { useState, useEffect, useRef } from "react";
import { Button, Form, Input, Modal } from "antd";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip,
  ChartItem,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { getAllTherapists } from "../../Redux/Adminslice/ThearpySlice";
import {
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

// Register Chart.js components
Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

// Types
type ChartRefType = Chart<"doughnut", number[], string>;

type Meeting = {
  name: string;
  phoneNumber?: string;
  time: string;
  link: string;
};

interface HomeProps {
  userRole: string;
}

interface Therapist {
  personalInformation?: {
    gender?: string;
  };
}

interface Patient {
  personalInformation?: {
    gender?: string;
  };
}

// Sample conversation data
const conversationsList = [
  {
    id: 1,
    name: "Alice",
    role: "Cognitive Behavioral Therapy",
    phone: "+250 789897235",
    amount: "$20",
    lastmeet: "2024.08.12",
  },
  {
    id: 3,
    name: "Muvunyi",
    role: "Child Psychology",
    phone: "+250 789262736",
    amount: "$30",
    lastmeet: "2024.08.12",
  },
];

const Home = ({ userRole }: HomeProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    time: "",
    link: "",
    role: "",
  });
  
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([
    {
      name: "Ptrick",
      phoneNumber: "0789897235",
      time: "2:00 - 3:00",
      link: "https://meet.google.com",
    },
  ]);

  // Chart references
  const chartRefUser = useRef<HTMLCanvasElement>(null);
  const chartRefTherapist = useRef<HTMLCanvasElement>(null);
  const chartRefPatient = useRef<HTMLCanvasElement>(null);
  
  const chartInstanceUser = useRef<ChartRefType | null>(null);
  const chartInstanceTherapist = useRef<ChartRefType | null>(null); 
  const chartInstancePatient = useRef<ChartRefType | null>(null);

  const dispatch = useDispatch<any>();

  // Selectors
  const therapyStatus = useSelector((state: any) => state.Therapy.status);
  
  const therapists = useSelector((state: RootState) => state.Therapy.therapists);
  const patients = useSelector((state: RootState) => state.patients.patients);

  // Load therapists data
  useEffect(() => {
    if (therapyStatus === 'idle') {
      dispatch(getAllTherapists());
    }
  }, [therapyStatus, dispatch]);

  // User gender chart initialization
  useEffect(() => {
    if (chartRefUser.current) {
      const ctx = chartRefUser.current.getContext("2d");
      if (ctx) {
        if (chartInstanceUser.current) {
          chartInstanceUser.current.destroy();
        }
        
        chartInstanceUser.current = new Chart(ctx as ChartItem, {
          type: "doughnut",
          data: {
            labels: ["Female [16]", "Male [13]"],
            datasets: [
              {
                data: [16, 13],
                backgroundColor: ["#9333ea", "#3b82f6"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              }
            },
            cutout: '65%',
          }
        });
      }
    }
  }, []);

  // Function to get gender counts for therapists
  const countTherapistGenders = (therapists: Therapist[]) => {
    const female = therapists?.filter(t => t.personalInformation?.gender?.toLowerCase() === 'female').length || 0;
    const male = therapists?.filter(t => t.personalInformation?.gender?.toLowerCase() === 'male').length || 0;
    return { female, male };
  };

  // Therapist gender chart initialization
  useEffect(() => {
    if (chartRefTherapist.current) {
      const ctx = chartRefTherapist.current.getContext("2d");
      if (ctx) {
        if (chartInstanceTherapist.current) {
          chartInstanceTherapist.current.destroy();
        }
        
        const { female, male } = countTherapistGenders(therapists);
        
        chartInstanceTherapist.current = new Chart(ctx as ChartItem, {
          type: "doughnut",
          data: {
            labels: [`Female [${female}]`, `Male [${male}]`],
            datasets: [
              {
                data: [female, male],
                backgroundColor: ["#10b981", "#f59e0b"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              }
            },
            cutout: '65%',
          }
        });
      }
    }
  }, [therapists]);

  // Function to get gender counts for patients
  const countPatientGenders = (patients: Patient[]) => {
    const female = patients?.filter(p => p.personalInformation?.gender?.toLowerCase() === 'female').length || 0;
    const male = patients?.filter(p => p.personalInformation?.gender?.toLowerCase() === 'male').length || 0;
    return { female, male };
  };

  // Patient gender chart initialization
  useEffect(() => {
    if (chartRefPatient.current) {
      const ctx = chartRefPatient.current.getContext("2d");
      if (ctx) {
        if (chartInstancePatient.current) {
          chartInstancePatient.current.destroy();
        }
        
        const { female, male } = countPatientGenders(patients);
        
        chartInstancePatient.current = new Chart(ctx as ChartItem, {
          type: "doughnut",
          data: {
            labels: [`Female [${female}]`, `Male [${male}]`],
            datasets: [
              {
                data: [female, male],
                backgroundColor: ["#10b981", "#3b82f6"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              }
            },
            cutout: '65%',
          }
        });
      }
    }
  }, [patients]);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMeeting = () => {
    if (formData.name && formData.time && formData.link) {
      const newMeeting = {
        name: `${formData.name}${formData.role ? `: ${formData.role}` : ''}`,
        phoneNumber: formData.phone,
        time: formData.time,
        link: formData.link,
      };
      setUpcomingMeetings([...upcomingMeetings, newMeeting]);
      setFormData({ name: "", phone: "", time: "", link: "", role: "" });
      setModalVisible(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 mt-10">
        <h2 className="text-xl font-bold ml-1 text-gray-800 mb-8">
          Welcome back, {userRole === "therapist" ? "Dr. Smith" : "Admin"}!
        </h2>
        {/* Gender Breakdown Charts (Admin only) */}
        {userRole === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow  transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                User's Gender Breakdown
              </h3>
              <div className="h-48">
                <canvas ref={chartRefUser}/>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow  transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Therapist's Gender Breakdown
              </h3>
              <div className="h-48">
                <canvas ref={chartRefTherapist}></canvas>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow  transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Patient's Gender Breakdown
              </h3>
              <div className="h-48">
                <canvas ref={chartRefPatient}></canvas>
              </div>
            </div>
          </div>
        )}

        {/* Conversations and Meetings (Admin) */}
        {userRole === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">
                Recent Conversations
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">
                        Role
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">
                        Phone
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">
                        Last Meet
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversationsList.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">
                          {user.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">
                          {user.role}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">
                          {user.phone}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">
                          {user.lastmeet}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-purple-600 mb-4 flex justify-between items-center">
                Upcoming Meetings
                <Button 
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => setModalVisible(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add
                </Button>
              </h3>
              
              <div className="space-y-4">
                {upcomingMeetings.map((meeting, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div className="flex items-start mb-2 md:mb-0">
                        <UserOutlined className="text-gray-500 mr-2 mt-1" />
                        <div>
                          <p className="font-medium text-gray-800">{meeting.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start mb-2 md:mb-0">
                        <PhoneOutlined className="text-gray-500 mr-2 mt-1" />
                        <div>
                          <p className="text-gray-600">{meeting.phoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CalendarOutlined className="text-gray-500 mr-2 mt-1" />
                        <div>
                          <p className="text-gray-600">{meeting.time}</p>
                          <a href={meeting.link} className="text-blue-600 hover:underline text-sm">
                            Join Meeting
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Modal
                title="Add New Meeting"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                  <Button key="cancel" onClick={() => setModalVisible(false)}>
                    Cancel
                  </Button>,
                  <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleAddMeeting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Add Meeting
                  </Button>
                ]}
              >
                <Form layout="vertical" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Name" rules={[{ required: true }]}>
                      <Input
                        placeholder="Enter name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Role">
                      <Input
                        placeholder="Enter role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Phone Number">
                      <Input
                        placeholder="Enter phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Meeting Time" rules={[{ required: true }]}>
                      <Input
                        placeholder="e.g. 2:00 - 3:00"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Meeting Link" rules={[{ required: true }]} className="md:col-span-2">
                      <Input
                        placeholder="https://meet.example.com"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </div>
                </Form>
              </Modal>
            </div>
          </div>
        )}

        {/* Payment Section (Admin) */}
        {userRole === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">
                Payment Management
              </h3>
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                Recent Payroll
              </h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">
                        Patient Name
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">
                        Payment Date
                      </th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-600 border-b">
                        Amount Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversationsList.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">
                          {item.lastmeet}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-b text-right">
                          {item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">
                Payment System
              </h3>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-md flex items-center justify-center text-white font-bold">
                      MTN
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Mobile Money</h4>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>+250 0789897235</p>
                    <p className="font-medium mt-2">Total Amount: $100</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                      PP
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">PayPal</h4>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>1122363674674376</p>
                    <p className="font-medium mt-2">Total Amount: $50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;