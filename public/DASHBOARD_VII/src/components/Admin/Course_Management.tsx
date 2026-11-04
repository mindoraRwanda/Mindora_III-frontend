import { Button, Input, message, Modal, Select, Form, Spin, Card, Tag, Badge } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { Search, Plus, Edit3, Trash2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { BiBook, BiTime, BiGridAlt, BiListUl } from "react-icons/bi";
import { FaUser, FaGraduationCap } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createCourses, deleteCourse, editCourse, getCourses } from "../../Redux/Adminslice/CourseSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import Article_Management from "./Article_Management";
import { Course } from "../../Redux/Adminslice/CourseSlice";

function Course_Management() {
  const allCourses = useSelector((state: RootState) => state.courses.coursesData || []);
  const status = useSelector((state: RootState) => state.courses.status);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeButton, setActiveButton] = useState("Courses");
  const [viewMode, setViewMode] = useState("card"); // card or list
  const [searchText, setSearchText] = useState("");

  const [form] = useForm();
  const Dispatch = useDispatch<AppDispatch>();

  const showCreateModal = () => {
    setOpenCreateModal(true);
    form.resetFields();
    setOpenEditModal(false);
  };

  const showEditModal = (course:any) => {
    setOpenEditModal(true);
    form.setFieldsValue(course);
    setSelectedCourse(course);
    setOpenCreateModal(false);
  };


  const handleClose = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
    // setOpenCreateModal(false);
    setSelectedCourse(null);
    form.resetFields();
  };

  const handleActiveButton = (buttonName:any) => {
    setActiveButton(buttonName);
  };

  // Code to create the course
  const handleCreateCourse = async () => {
    try {
      const courseData = await form.getFieldsValue();
      if (openEditModal) {
        if (selectedCourse) {
          await Dispatch(editCourse({ id: selectedCourse.id, ...courseData })).unwrap();
          message.success("Course updated successfully");
        } else {
          message.error("No course selected for editing");
        }
      } else {
        await Dispatch(createCourses(courseData)).unwrap();
        message.success("Course created successfully");
      }
      handleClose();
      Dispatch(getCourses());
    } catch (error) {
      message.error(`Failed to ${openEditModal ? "update" : "create"} course: ${error}`);
    }
  };

  // Function to handle selected course
  const handleSelectedCourse = (course:any) => {
    setSelectedCourse(course);
    setActiveButton("Course Articles");
  };

  // Function to display all courses
  useEffect(() => {
    Dispatch(getCourses());
  }, [Dispatch]);

  // Function to delete course
  const handleDeleteCourse = async (id:any) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }
    try {
      await Dispatch(deleteCourse(id));
      message.success("Course deleted successfully");
      Dispatch(getCourses());
    } catch (error:any) {
      message.error(`Error deleting course: ${error.message}`);
    }
  };

  // Function to get category color
  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      "Mental Problems": "red",
      "Immunity issues": "green",
      "Family categories": "cyan",
      "Relationship": "blue"
    };
    return categoryColors[category] || "default";
  };

  // Function to get level badge
  const getLevelBadge = (level: string) => {
    const levelColors: { [key: string]: string } = {
      "Beginner": "#52c41a",
      "Intermediate": "#1890ff",
      "Advanced": "#722ed1",
      "Beginner to Advanced": "#fa8c16"
    };
    return levelColors[level] || "#d9d9d9";
  };


  // Filter courses based on search
  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchText.toLowerCase()) ||
    course.instructors.toLowerCase().includes(searchText.toLowerCase()) ||
    course.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderContent = () => {
    switch (activeButton) {
      case "Courses":
        return (
          <div className="text-2xl text-black m-4 bg-white">
            <Card className="mb-2  shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex">
                  <Input
                    prefix={<Search className="mr-2" />}
                    placeholder="Search courses, instructors, or categories"
                    className="w-full"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <div>
                  <Select className="w-full" defaultValue="" placeholder="Filter by Status">
                    <Select.Option value="">All Courses</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="draft">Draft</Select.Option>
                    <Select.Option value="archived">Archived</Select.Option>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    icon={viewMode === "card" ? <BiListUl size={18} /> : <BiGridAlt size={18} />}
                    onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
                    className="flex items-center"
                  >
                    {viewMode === "card" ? "List View" : "Card View"}
                  </Button>
                  <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center"
                    onClick={() => showCreateModal()}
                  >
                    New Course
                  </Button>
                </div>
              </div>
            </Card>

            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All Courses</h2>
              <div className="p-2 border rounded-lg bg-gray-50">
                Total Courses: <span className="text-purple-600 font-semibold">{filteredCourses.length}</span>
              </div>
            </div>

            {status === "loading" ? (
              <div className="flex items-center justify-center text-purple-600 py-12">
                <Spin size="large" />
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className={`${viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : ""}`}>
                {filteredCourses.map((course, index) => (
                  viewMode === "card" ? (
                    <Card 
                      key={index} 
                      className="mb-4 hover:shadow-md transition-shadow"
                      actions={[
                        <Button type="text" icon={<Edit3 size={16} />} onClick={() => showEditModal(course)}>Edit</Button>,
                        <Button type="text" icon={<Trash2 size={16} />} danger onClick={() => handleDeleteCourse(course.id)}>Delete</Button>,
                        <Button type="text" icon={<FileText size={16} />} onClick={() => handleSelectedCourse(course)}>Articles</Button>
                      ]}
                    >
                      <div className="flex items-start">
                        <div className="mr-3">
                        <FaGraduationCap size={25}/>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            <Badge color={getLevelBadge(course.level)} text={course.level} />
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {course.description || "No description available"}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Tag color={getCategoryColor(course.category)}>{course.category}</Tag>
                            {course.price && <Tag color="green">${course.price}</Tag>}
                          </div>
                          <div className="flex gap-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FaUser size={14} className="mr-1" />
                              {course.instructors}
                            </span>
                            <span className="flex items-center">
                              <BiTime size={14} className="mr-1" />
                              {course.duration} hours
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card key={index} className="mb-3 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between">
                        <div className="flex">
                          <div className="mr-4">
                          <FaGraduationCap size={25}/>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <div className="flex gap-3 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FaUser size={14} className="mr-1" />
                                {course.instructors}
                              </span>
                              <span className="flex items-center">
                                <BiBook size={14} className="mr-1" />
                                {course.level}
                              </span>
                              <span className="flex items-center">
                                <BiTime size={14} className="mr-1" />
                                {course.duration} hours
                              </span>
                              <Tag color={getCategoryColor(course.category)}>{course.category}</Tag>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            icon={<Edit3 size={16} />}
                            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => showEditModal(course)}
                          >
                            Edit
                          </Button>
                          <Button
                            icon={<Trash2 size={16} />}
                            className="flex items-center bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            icon={<FileText size={16} />}
                            className="flex items-center bg-black hover:bg-gray-800 text-white"
                            onClick={() => handleSelectedCourse(course)}
                          >
                            Articles
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <BiBook size={64} className="mb-4" />
                  <h3 className="text-xl font-medium mb-2">No courses found</h3>
                  <p className="mb-4">Get started by creating your first course</p>
                  <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => showCreateModal()}
                  >
                    Create Course
                  </Button>
                </div>
              </Card>
            )}
          </div>
        );
      case "Course Articles":
        return <Article_Management selectedCourseId={selectedCourse?.id} setActiveButton={setActiveButton} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="mb-2">
          <div className="flex flex-row gap-4 mx-4 mt-7">
            {["Courses", "Course Articles"].map((buttonName) => (
              <button
                key={buttonName}
                className={`text-lg font-semibold px-6 py-1 rounded-md transition-colors ${
                  activeButton === buttonName
                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleActiveButton(buttonName)}
              >
                {buttonName}
              </button>
            ))}
          </div>
        </div>
        {renderContent()}
        <Modal
          open={openCreateModal || openEditModal}
          onCancel={handleClose}
          footer={null}
          title={
            <div className="text-xl font-semibold">
              {openEditModal ? "Edit Course" : "Create New Course"}
            </div>
          }
          width={700}
        >
          <div className="my-6">
            <Form form={form} layout="vertical">
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: "Please input Course Title!" }]}
              >
                <Input placeholder="Enter course title" size="large" />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="level"
                  label="Course Level"
                  rules={[{ required: true, message: "Please select Course Level!" }]}
                >
                  <Select placeholder="Select level" size="large">
                    <Select.Option value="Beginner">Beginner</Select.Option>
                    <Select.Option value="Intermediate">Intermediate</Select.Option>
                    <Select.Option value="Advanced">Advanced</Select.Option>
                    <Select.Option value="Beginner to Advanced">Beginner to Advanced</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Course Category"
                  rules={[{ required: true, message: "Please select Course Category!" }]}
                >
                  <Select placeholder="Select category" size="large">
                    <Select.Option value="Mental Problems">Mental Problems</Select.Option>
                    <Select.Option value="Immunity issues">Immunity Issues</Select.Option>
                    <Select.Option value="Family categories">Family Categories</Select.Option>
                    <Select.Option value="Relationship">Relationship</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="instructor"
                  label="Course Instructor"
                  rules={[{ required: true, message: "Please input Course Instructor!" }]}
                >
                  <Input placeholder="Enter instructor name" size="large" />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="Course Price ($)"
                  rules={[{ required: true, message: "Please input Course Price!" }]}
                >
                  <Input placeholder="Enter price" size="large" prefix="$" type="number" />
                </Form.Item>
              </div>

              <Form.Item
                name="duration"
                label="Course Duration (hours)"
                rules={[{ required: true, message: "Please input Course Duration!" }]}
              >
                <Input placeholder="Enter duration in hours" size="large" type="number" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Course Description"
                rules={[{ required: true, message: "Please input Course Description!" }]}
              >
                <TextArea placeholder="Enter course description" rows={4} />
              </Form.Item>
            </Form>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 w-full h-12 text-lg rounded-md"
              onClick={handleCreateCourse}
              htmlType="submit"
              loading={status === "loading"}
              // disabled={status === "disabled"}
            >
              {openEditModal ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Course_Management;