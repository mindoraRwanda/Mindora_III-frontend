import { MdDelete, MdEdit } from "react-icons/md";
import { BiDislike, BiLike } from "react-icons/bi";
import { BiTrash, BiEdit } from "react-icons/bi";
import { FaEllipsisV } from "react-icons/fa";
import { useState, useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Input, Modal, Checkbox, Form, message, Spin, Upload, Card, Badge, Avatar, Tooltip, Divider, Typography } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useDispatch, useSelector } from "react-redux";
import {
  CommunityFormValues,
  createCommunity,
  deleteCommunity,
  getAllcommunity,
  UpdateCommunity,
} from "../../Redux/Adminslice/CommunitySlice";
import { AppDispatch, RootState } from "../../Redux/store";
import CommunityDetails from "./CommunityDetails";
import { deletePots, getAllCommunityPost, UpdatePost } from "../../Redux/Adminslice/CommunityPost";
import { deleteComment, fetchPostCommnet, updateComment } from "../../Redux/Adminslice/Comment";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { getPostReport } from "../../Redux/Adminslice/report_Slice";


const { Title, Text, Paragraph } = Typography;
interface Community {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  profile?: string;
  posts?: Post[];
}
interface CommentFormValues {
  content: string;
  isFlagged: boolean;
  attachments?: File[];
}
interface Post {
  id: string;
  title?: string;
  content?: string;
  user?: User;
  community?: Community;
  createdAt?: string;
}

interface User {
  id: string | number;
  firstName?: string;
  lastName?: string;
}

interface Report {
  id: string | number;
  reason: string;
  createdAt: string;
}

interface CommentItem {
  id: string | number;
  content: string;
  createdAt: string;
  user: User;
  isFlagged?: boolean;
  attachments?: any[];
}
export default function Communication() {
  const communities = useSelector((state: RootState) => state.Community.communities);
  const PostStatus = useSelector((state: RootState) => state.Postcomment.status);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [Posts, setPosts] = useState<Post[]>([]);
const [repots, setReports] = useState<Report[]>([]);
const [AllPost, setAllPost] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdatePostModal, setShowUpdatePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCommDetails, setShowCommDetails] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [UserId, setUserId] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Post | null>(null);
  const [commentsValue, setCommentsValue] = useState<CommentItem[]>([]);
  const [showCommentEdit, setShowCommentEdit] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentItem | null>(null);
  const [showReport,setShowReported]=useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // This is for getting User id stored on Local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("UserId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // fetch all communities on component mount
  useEffect(() => {
    dispatch(getAllcommunity());
  }, [dispatch]);

  // function to create a new community Groupe
  const handleSubmit = async (values: CommunityFormValues) => {
    const formData = new FormData();
    formData.append("moderatorId", UserId);
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("isPrivate", String(values.isPrivate || false));
    if (selectedFile) {
      formData.append("profile", selectedFile);
    }
    setLoading(true);
    try {
      const result = await dispatch(createCommunity(formData));
      if (createCommunity.fulfilled.match(result)) {
        message.success("Community created successfully!");
        setShowModal(false);
        form.resetFields();
        setSelectedFile(null);
        dispatch(getAllcommunity());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create community: ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // To delete community
  const handleDeleteCommunity = async (id?: number | string) => {
    if(!id) return;
    if (!window.confirm("Are you sure you want to delete this community?")) {
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(deleteCommunity(String(id)));
      if (deleteCommunity.fulfilled.match(result)) {
        message.success("Community deleted successfully!");
        dispatch(getAllcommunity());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to delete community: ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Modal show Community Details
  const VisibleDetailsModal = (id: number | string , e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering community selection
    setShowCommDetails(true);
    setSelectedCommunityId(id);
    const community = communities.find((c) => c.id === id);
     setSelectedCommunity(community as Community || null);

    
  };

  // Modal update community
  const ShowUpdateModal = (community: Community & { id: string | number }, e: React.MouseEvent) => {
    e.stopPropagation();
    if(!community.id) return;
    const communityInputed:Community = {
      id: community.id || "",
      name: community.name || "",
      description: community.description || "",
      isPrivate: !!community.isPrivate,
      profile: community.profile,
      posts: community.posts
    }
    setSelectedCommunity(communityInputed);
    setUpdateModal(true);
    form.setFieldsValue({
      name: community.name,
      description: community.description,
      isPrivate: community.isPrivate,
    });
  };

  // update Community information
  const handleUpdateCommunity = async (values:CommunityFormValues) => {
    if (!selectedCommunity?.id) return;
    setLoading(true);
    try {
      const UpdateData = {
        id: String(selectedCommunity.id),
        CommunityData: {
          name: values.name,
          description: values.description,
          isPrivate: values.isPrivate,
        },
      };
      const result = await dispatch(UpdateCommunity(UpdateData));
      if (UpdateCommunity.fulfilled.match(result)) {
        message.success("Community created successfully!");
        setUpdateModal(false);
        form.resetFields();
        dispatch(getAllcommunity());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to update community: ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // This Will help us to display the community members list
  const handleCommunityMembers = (community: Community) => {
    setSelectedCommunity(community);
    setPosts(community.posts || []);
  };

  // To get all Post which are in system
  const getAppPost = async () => {
    try {
      setLoading(true);
      const result = await dispatch(getAllCommunityPost() as any);
      if (result && result.payload) {
        setAllPost(result.payload as Post[]);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to load users: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppPost();
  }, [dispatch]);

  // Codes for showing Data in Form Modal 
  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setShowUpdatePostModal(true);
    form.setFieldsValue({
      title: post?.title,
      content: post?.content,
    });
  };

  //Here is the for update Post
  const handleUpdatePost = async (values: any) => {
    if (!selectedPost) return;
    try {
      setLoading(true);
      
      const postData: Partial<Post> = {
        content: values.content,
        title: values.title
      };
      
      const result = await dispatch(UpdatePost({
        id: String(selectedPost.id),
        postData: postData
      }) as any);
      
      if (result) {
        setShowUpdatePostModal(false);
        message.success("Post updated successfully!");
        getAppPost();
      }
    } catch (error) {
      message.error(`Error updating post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // To delete Post
  const handleDeletePost = async (id:string|number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    };
    try {
      setLoading(true);
      const result = await dispatch(deletePots(String(id))as any);
      if (deletePots.fulfilled.match(result)) {
        message.success("Post deleted successfully!");
        getAppPost();
      };
    }
    catch (error) {
      message.error(`Error deleting post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // function to display comment on specific task
  const handlePostCommnent = async (post: Post|null) => {
    if(!post || !post.id)return;
    setSelectedTopic(post);
    try {
      // Cast id to string if it might be a number
      const result = await dispatch(fetchPostCommnet(String(post.id)) as any);
      if (result && result.payload) {
        setCommentsValue(result.payload as CommentItem[]);
      }
    }
    catch (error:any) {
      message.error(`Error fetching comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // function to handle edit comment modal
  const handleEditComment = (comment: CommentItem) => {
    setSelectedComment(comment);
    setShowCommentEdit(true);
    setShowUpdatePostModal(true);
    form.setFieldsValue({
      content: comment?.content,
      isFlagged: comment.isFlagged || false,
      attachments: comment.attachments || []
    });
  }

  // function to update comments
  const handleUpdateComment = async (values:CommentFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", values.content);
      formData.append("isFlagged", values.isFlagged ? "true" : "false");
      if (values.attachments) {
        values.attachments.forEach((file: File) => {
          formData.append("attachments", file);
        });
      }
      if (!selectedComment) return;
const result = await dispatch(updateComment({ 
  id: String(selectedComment.id), 
  commentData: formData 
}) as any);
      if (updateComment.fulfilled.match(result)) {
        setShowCommentEdit(false);
        setShowUpdatePostModal(false);
        form.resetFields();
        message.success("Comment updated successfully!");
        getAppPost();
        if(selectedTopic){
        handlePostCommnent(selectedTopic);
        }
      };
    }
    catch (error: any) {
      message.error(`Error updating comment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // function to delete comment
  const handleDeleteComment = async (commentId: string|number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    };
    try {
      setLoading(true);
      const IdAsString=String(commentId);
      const result = await dispatch(deleteComment(IdAsString) as any);
      if (deleteComment.fulfilled.match(result)) {
        message.success("Comment deleted successfully!");
        getAppPost();
        if(selectedTopic){
          handlePostCommnent(selectedTopic);
        }
       
      };
    }
    catch (error:any) {
      message.error(`Error deleting comment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

// the Following is for Community Post Reports
useEffect(() => {
  const fetchPosts = async () => {
    if(!selectedTopic?.id) return;
    setLoading(true);
    try {
      const result=await dispatch(getPostReport() as any);
    if (getPostReport.fulfilled.match(result)) {
      setReports(result.payload);
    }
    else{
      setReports([]);
    }
  }
  catch (error: any) {
    message.error(`Error message: ${error instanceof Error ? error.message : 'Unknown error'}`);

      setReports([]);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, [dispatch, selectedTopic?.id]);

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-3 mt-5">
        <Title className="text-purple-600" level={2}>
          Community Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
          size="large"
        >
          Add Community
        </Button>
      </div>

      {isloading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {communities.map((community) => (
            <Card
              key={community.id}
              className={`shadow-md transition-all cursor-pointer hover:shadow-lg ${selectedCommunity?.id === community.id ? 'border-purple-500 border-2' : ''}`}
              onClick={() => handleCommunityMembers(community as any)}
              cover={
                <div className="flex justify-center p-4 bg-gray-50">
                  <Avatar
                    src={community.profile? String(community.profile): "https://via.placeholder.com/100"}
                    alt={`${community.name} profile`}
                    size={100}
                    className="shadow"
                  />
                </div>
              }
              actions={[
                <Tooltip title="Edit">
                  <Button type="text" icon={<BiEdit size={20} />} 
                  onClick={(event) => {
                    // Ensure community.id exists before calling ShowUpdateModal
                    if (community && community.id) {
                      ShowUpdateModal(community as Community & { id: string | number }, event);
                    }
                  }}
                    />
                </Tooltip>,
                <Tooltip title="Delete">
                  <Button type="text" icon={<BiTrash size={20} className="text-red-500" />} onClick={() => handleDeleteCommunity(community.id)} />
                </Tooltip>,
                <Tooltip title="More Details">
                <Button 
  type="text" 
  icon={<FaEllipsisV size={14} />} 
  onClick={(e) => community.id ? VisibleDetailsModal(community.id, e) : null} 
/>
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={community.name}
                description={community.isPrivate ? "Private Community" : "Public Community"}
              />
            </Card>
          ))}
        </div>
      )}

      <CommunityDetails
        visible={showCommDetails}
        onClose={() => { setShowCommDetails(false); setSelectedCommunityId(null) }}
        communityId={selectedCommunityId||""}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <Title level={4} className="text-purple-600 mb-4">
            Therapist Community Topics
          </Title>
          <Divider />

          {isloading ? (
            <div className="flex justify-center py-4">
              <Spin size="large" />
            </div>
          ) : (
            <div className="space-y-4">
              {selectedCommunity ? (
                <div className="text-center mb-4">
                  <Text strong className="text-lg">Selected Community: {selectedCommunity.name}</Text>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <Text type="secondary">Select a community to view topics</Text>
                </div>
              )}

              {Posts.length > 0 ? (
                Posts.map((post) => (
                  <Card 
                    key={post.id}
                    className={`mb-4 cursor-pointer hover:shadow ${selectedTopic?.id === post.id ? 'border-purple-500 border-2' : ''}`}
                    onClick={() => handlePostCommnent(post)}
                  >
                    <Title level={5}>{post?.title || "No Title"}</Title>
                    <Paragraph ellipsis={{ rows: 2 }}>{post?.content || "No Content"}</Paragraph>
                    <Badge 
                      count="Reported" 
                      style={{ backgroundColor: '#ff4d4f' }}
                      className="mt-2"
                    />
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Text type="secondary">No topics found in this community</Text>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <Title level={4} className="text-purple-600 mb-4">
            Topic
          </Title>
          <Divider />

          {selectedTopic ? (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-4">
                  <Avatar size="large" src="https://via.placeholder.com/40" />
                  <div className="ml-3">
                    <Text strong className="text-lg">
                      {selectedTopic.user?.firstName || "No Name"} {selectedTopic.user?.lastName}
                    </Text>
                  </div>
                </div>
                
                <Title level={4}>{selectedTopic.title}</Title>
                <Paragraph className="text-lg">{selectedTopic.content}</Paragraph>
                
                <div className="mt-4">
                  <Button 
                    onClick={()=>setShowReported(true)}
                    style={{ backgroundColor: '#52c41a' , color: '#fff' }}
                    className="mr-2"
                  >
                   {repots.length} Reports
                  
                    </Button>
                </div>
              </div>

              <Title level={4} className="text-purple-600 mb-4">
                Topic Comments
              </Title>
              <Divider />

              {PostStatus === 'loading' ? (
                <div className="flex justify-center py-4">
                  <Spin size="large" />
                </div>
              ) : commentsValue.length > 0 ? (
                <div className="space-y-4">
                  {commentsValue.map((comment) => (
                    <Card key={comment.id} className="shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <Text strong>
                              {comment.user?.firstName || "No Name"} {comment.user?.lastName}
                            </Text>
                            <Text type="secondary" className="ml-3">
                              {comment.createdAt?.substring(0, 10)}
                            </Text>
                          </div>
                          <Paragraph>{comment.content}</Paragraph>
                          <div className="flex gap-2 mt-2">
                            <Button icon={<BiLike size={16} />}>Like</Button>
                            <Button icon={<BiDislike size={16} />}>Dislike</Button>
                          </div>
                        </div>
                        <div>
                          <div className="flex gap-2 mb-2">
                            <Button 
                              icon={<MdEdit size={18} className="text-blue-500" />} 
                              onClick={() => handleEditComment(comment)}
                            />
                            <Button 
                              icon={<MdDelete size={18} className="text-red-500" />} 
                              onClick={() => handleDeleteComment(comment.id)}
                            />
                          </div>
                          <Badge 
                            count="Reported" 
                            style={{ backgroundColor: '#ff4d4f' }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Text type="secondary">No comments yet</Text>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Text type="secondary">Select a topic to view details</Text>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 shadow-md">
        <Title level={4} className="text-purple-600 mb-4">
          ALL POSTS WITHIN SYSTEM
        </Title>
        <Divider />

        {isloading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-6">
            {AllPost.length > 0 ? (
              AllPost.map((post:Post) => (
                <Card key={post.id} className="shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                      <Text strong className="block text-lg">{post.community?.name}</Text>
                      <Text type="secondary">{post.user?.firstName}</Text>
                    </div>
                    
                    <div className="md:col-span-8">
                      <Title level={4}>{post?.title || "No Title"}</Title>
                      <Paragraph>{post?.content || "No Content"}</Paragraph>
                      <div className="flex gap-2 mt-2">
                        <Button icon={<BiLike size={16} />}>Like</Button>
                        <Button icon={<BiDislike size={16} />}>Dislike</Button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-1 flex md:flex-col gap-2 justify-end">
                      <Button 
                        icon={<MdEdit size={20} className="text-blue-500" />} 
                        onClick={() => handleEdit(post)}
                      />
                      <Button 
                        danger
                        icon={<MdDelete size={20} />} 
                        onClick={() => handleDeletePost(post.id)}
                        disabled={isloading}
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Text type="secondary">No posts found</Text>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Create Community Modal */}
    {/* Create Community Modal */}
<Modal
  open={showModal}
  footer={null}
  onCancel={() => {
    setShowModal(false);
    form.resetFields();
  }}
  title={<Title level={4}>CREATE COMMUNITY GROUP</Title>}
>
  <Form form={form} layout="vertical" onFinish={handleSubmit}>
    <FormItem
      name="UserId"
      label="ModeratorId"
      initialValue={UserId}
      hidden
    >
      <Input disabled />
    </FormItem>
    
    <FormItem 
      name="name" 
      label="Name" 
      rules={[{ required: true, message: 'Please enter community name' }]}
    >
      <Input placeholder="Enter community name" />
    </FormItem>
    
    <FormItem 
      name="description" 
      label="Description"
      rules={[{ required: true, message: 'Please enter community description' }]}
    >
      <TextArea placeholder="Type description" rows={4} />
    </FormItem>
    
    <FormItem label="Community Profile">
      <Upload
        maxCount={1}
        beforeUpload={(file) => {
          setSelectedFile(file);
          return false;
        }}
        onRemove={() => setSelectedFile(null)}
        listType="picture"
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Select Image</Button>
      </Upload>
    </FormItem>
    
    <FormItem name="isPrivate" valuePropName="checked">
      <Checkbox>Is Private</Checkbox>
    </FormItem>
    
    <FormItem>
      <Button
        type="primary"
        loading={isloading}
        disabled={isloading}
        htmlType="submit"
        block
        size="large"
      >
        Add Community
      </Button>
    </FormItem>
  </Form>
</Modal>

      {/* Update Community Modal */}
      <Modal
        open={updateModal}
        onCancel={() => {setUpdateModal(false); form.resetFields()}}
        footer={null}
        title={<Title level={4}>UPDATE COMMUNITY</Title>}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateCommunity}>
          <FormItem 
            name="name" 
            label="Name"
            rules={[{ required: true, message: 'Please enter community name' }]}
          >
            <Input placeholder="Enter community name" />
          </FormItem>
          
          <FormItem 
            name="description" 
            label="Description"
            rules={[{ required: true, message: 'Please enter community description' }]}
          >
            <TextArea placeholder="Type description" rows={4} />
          </FormItem>
          
          <FormItem name="isPrivate" valuePropName="checked">
            <Checkbox>Is Private</Checkbox>
          </FormItem>
          
          <FormItem>
            <Button
              type="primary"
              loading={isloading}
              disabled={isloading}
              htmlType="submit"
              block
              size="large"
            >
              Update Community
            </Button>
          </FormItem>
        </Form>
      </Modal>

      {/* Update Post/Comment Modal */}
      <Modal 
        footer={null} 
        onCancel={() => {
          setShowUpdatePostModal(false);
          setShowCommentEdit(false);
          setSelectedComment(null);
          form.resetFields();
        }} 
        open={showUpdatePostModal} 
        title={<Title level={4}>{showCommentEdit ? "Update Comment" : "Update Post"}</Title>}
      >
       <Form 
  form={form} 
  layout="vertical" 
  onFinish={showCommentEdit ? 
    (values) => handleUpdateComment(values as CommentFormValues) : 
    (values) => handleUpdatePost(values as any)
  }
>
          {!showCommentEdit && (
            <FormItem 
              name="title" 
              label="Title:"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter title" />
            </FormItem>
          )}
          
          <FormItem 
            name="content" 
            label={showCommentEdit ? "Comment:" : "Content"}
            rules={[{ required: true, message: `Please enter ${showCommentEdit ? 'comment' : 'content'}` }]}
          >
            <TextArea 
              placeholder={`Type ${showCommentEdit ? 'comment' : 'content'}`} 
              rows={4}
            />
          </FormItem>
          
          {showCommentEdit && (
            <>
              <FormItem name="isFlagged" valuePropName="checked">
                <Checkbox>Flag as inappropriate content</Checkbox>
              </FormItem>
              
              <FormItem name="attachments" label="Attachments">
                <Upload 
                  maxCount={5} 
                  beforeUpload={() => false} 
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Add Files</Button>
                </Upload>
              </FormItem>
            </>
          )}
          
          <FormItem>
            <Button
              type="primary"
              loading={isloading}
              disabled={isloading}
              htmlType="submit"
              block
              size="large"
            >
              Update {showCommentEdit ? 'Comment' : 'Post'}
            </Button>
          </FormItem>
        </Form>
      </Modal>
      <Modal open={showReport} onCancel={()=>{setShowReported(false);form.resetFields()}} footer={null} title="Reported Reason" width={500}  >
        <div>
         {repots&&repots.length>0?(
          repots.map((report:Report)=>(
            <Card
              key={report.id}
              className="shadow-sm mb-4">
          <Text > Reporter</Text>
          <Input readOnly />
          <div className="text-right">
            <Text type="secondary" className="text-sm">
              Reported on: {new Date(report.createdAt).toLocaleDateString()}
            </Text>
          </div>
          <Text >Reported Message</Text>
          <TextArea  readOnly className="text-black" value={report.reason|| "No reason Provide"} ></TextArea>
          </Card>
          ))):(
            <div className="text-center py-8">
            <Text type="secondary">No reports found on this Topic</Text>
            </div>
          )}
         
        </div>

      </Modal>
    </div>
  );
}