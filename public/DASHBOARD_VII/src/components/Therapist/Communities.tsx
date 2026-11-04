import { Avatar, Card, Typography, Divider, Badge, Space, Button } from "antd";
import { BiComment, BiDislike, BiEdit, BiLike, BiTrash } from "react-icons/bi";
import {  FaUsers } from "react-icons/fa";

const { Title, Text, Paragraph } = Typography;

export default function Communities() {
  const communitiesList = [
    {
      id: 1,
      name: "Mental Health Professionals",
      memberCount: 124,
      avatar: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Therapy Techniques",
      memberCount: 89,
      avatar: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Clinical Practice",
      memberCount: 56,
      avatar: "https://via.placeholder.com/100",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <Title level={2} className="text-purple-700 m-0 font-bold">
          Community Management
        </Title>
        <Button type="primary" className="bg-purple-600">
          Join New Community
        </Button>
      </div>

      {/* Communities Section */}
      <Text className="text-gray-700 font-semibold text-lg mb-2 block">
        Your Communities
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {communitiesList.map((community) => (
          <Card
            key={community.id}
            className="shadow-sm hover:shadow-md transition-all border border-gray-200"
            hoverable
          >
            <div className="flex items-center">
              <Avatar src={community.avatar} size={64} className="mr-4" />
              <div>
                <Text className="text-purple-700 font-medium text-lg block">
                  {community.name}
                </Text>
                <Text className="text-gray-500 flex items-center">
                  <FaUsers className="mr-1" size={14} />
                  {community.memberCount} members
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Divider className="my-6" />

      {/* Discussion Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <div className="lg:col-span-1 rounded">
          <Card
            title={
              <div className="flex justify-between items-center">
                <span className="text-purple-700">Discussion Topic</span>
              </div>
            }
            className="shadow-sm rounded-lg"
          >
            <ol className="space-y-8 border border-gray-200 p-4 rounded ">
              <li className="flex items-center justify-between border-b p-5 hover:cursor-pointer hover:bg-gray-100">
                
                <Text className="text-gray-700">CBT Techniques</Text>
                <Badge count={12} />
                </li>
             <li className="flex items-center justify-between border-b p-5 hover:cursor-pointer hover:bg-gray-100">     
                <Text className="text-gray-700">Mindfulness in Therapy</Text>
                <Badge count={8} />
                </li>
             <li className="flex items-center justify-between border-b p-5 hover:cursor-pointer hover:bg-gray-100">     

                <Text className="text-gray-700">Therapeutic Alliance</Text>
                <Badge count={5} />
                </li>
                </ol>
          </Card>
        </div>

        {/* Comments Section */}
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex justify-between items-center">
                <span className="text-purple-700">
                  Discussion: Latest research on CBT
                </span>
                <Space>
                  <Button size="small" icon={<BiEdit />} type="text" />
                  <Button size="small" icon={<BiTrash />} type="text" danger />
                </Space>
              </div>
            }
            className="shadow-sm"
          >
            {/* Existing comments */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <Avatar src="https://via.placeholder.com/40" className="mr-3" />
                <div>
                  <div className="flex items-baseline">
                    <Text strong className="text-gray-800 mr-2">
                      Dr. Johnson
                    </Text>
                    <Text className="text-xs text-gray-500">3 days ago</Text>
                  </div>
                  <Paragraph className="text-gray-700 mt-1">
                    I've found the recent paper by Coleman et al. very
                    insightful regarding exposure techniques in CBT. Has anyone
                    implemented these methods in their practice?
                  </Paragraph>
                    <Space className="text-gray-500 gap-3">
                    <BiLike size={14} className="mr-1" />
                        <BiDislike size={14} className="mr-1" />
                        <BiComment size={14} className="mr-1"/>
                        <Button size="small" className="bg-purple-600 text-white"  type="text" > Report</Button>
                        </Space>
                </div>
              </div>
            </div>

            {/* Add comment section */}
            <Card className="border border-gray-200 mt-4">
              <Title level={5} className="text-gray-700 mb-3">
                Add Your Comment
              </Title>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-32"
                placeholder="Share your professional insights..."
              />
              <div className="flex justify-end mt-4">
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  Post Comment
                </Button>
              </div>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
}
