import { Button, Input, message, Modal, Form, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Edit, Search } from "lucide-react";
import  { useEffect, useState } from "react";
import { BiFastForward, BiPlus } from "react-icons/bi";
import { FaTrash, FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createArticle, deleteArticle, getAllArticle, UpdateArticle } from "../../Redux/Adminslice/Article_Slice";
import { useForm } from "antd/es/form/Form";
import { AppDispatch, RootState } from "../../Redux/store";

// Define the Article interface to match your Redux state
interface Article {
  id?: string;
  title: string;
  category: string;
  content: string;
  author: string;
  publishedDate: string;
  coverImage?: string;
  courseId: string;
  picture?: string;
}

interface ArticleManagementProps {
  selectedCourseId:any ;
  setActiveButton: (buttonName: string) => void;
}

function Article_Management({ selectedCourseId, setActiveButton }: ArticleManagementProps) {
  const status = useSelector((state: RootState) => state.articleContent.status);
  const articles = useSelector((state: RootState) => state.articleContent.data || []);
  const [selectCategory, setSelectCategory] = useState("AllCategory");
  const [CreateArticleModal, setCreateArticleModal] = useState(false);
  const [editArticleModal, setEditArticleModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const Dispatch = useDispatch<AppDispatch>();
  const [form] = useForm();

  const handleOpenModal = (article: Article | null = null) => {
    if (article) {
      setEditArticleModal(true);
      setCurrentArticle(article);
      form.setFieldsValue({
        title: article.title,
        content: article.content,
        category: article.category,
        author: article.author,
        publishedDate: article.publishedDate ? article.publishedDate.slice(0, 10) : "",
      });
    } else {
      setEditArticleModal(false);
      setCurrentArticle(null);
      form.resetFields();
    }
    setCreateArticleModal(true);
  };

  const handleCancelCreateArticleModal = () => {
    setCreateArticleModal(false);
    setCurrentArticle(null);
    setEditArticleModal(false);
  };

  const handleEditClick = async () => {
    try {
      const values = await form.validateFields();
      if (!currentArticle?.id) {
        message.error("No article selected for editing");
        return;
      }
      const formData = new FormData();
      formData.append('courseId', selectedCourseId);
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('category', values.category);
      formData.append('author', values.author);
      formData.append('publishedDate', values.dateUploaded);
      const imageFile = values.coverImage?.fileList?.[0]?.originFileObj;
      if (imageFile) {
        formData.append('picture', imageFile);
      }
      await Dispatch(UpdateArticle({ id: currentArticle.id, formData })).unwrap();
      message.success("Article updated successfully");
      handleCancelCreateArticleModal();
      Dispatch(getAllArticle(selectedCourseId));
      form.resetFields();
    }
    catch (error: any) {
      message.error(`Failed to update article: ${error}`);
    }
  };

  const handleDeleteArticle = async (article: Article) => {
    try {
      if (!article.id) {
        message.error("No article selected for deletion");
        return;
      }
      await Dispatch(deleteArticle(article.id)).unwrap();
      message.success("Article deleted successfully");
      Dispatch(getAllArticle(selectedCourseId));
    }
    catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      message.error(`Failed to delete article: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      console.log('The articles of selectedCourseId are:', selectedCourseId);
      Dispatch(getAllArticle(selectedCourseId));
    }
  }, [Dispatch, selectedCourseId]);

  // logic to take courseId from local storage
  const handleCreateArticle = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      if (!selectedCourseId) {
        message.error("Please select a course first");
        return;
      }
      formData.append('courseId', selectedCourseId);
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('category', values.category);
      formData.append('author', values.author);
      formData.append('publishedDate', values.dateUploaded);
      const imageFile = values.coverImage?.fileList?.[0]?.originFileObj;
      if (imageFile) {
        formData.append('picture', imageFile);
      };
      await Dispatch(createArticle(formData)).unwrap();
      message.success("Article created successfully");
      setCreateArticleModal(false);
      setActiveButton('Course Articles');
      form.resetFields();
      Dispatch(getAllArticle(selectedCourseId));
    } catch (error: any) {
      message.error(`Failed to create article: ${error}`);
    }
  };

  return (
    <>
      <div className="text-2xl text-black m-4   bg-white">
        <div className="font-2xl justify-between  p-2 bg-white flex">
          <h1 className="text-black text-2xl font-semibold">
            Article Management
          </h1>
          <div className="p-1 border rounded text-lg italic">
            {" "}
            Total Articles:
            <span className="text-blue-500 ml-2">{articles.length}</span>
          </div>
        </div>
        <div className="border rounded p-7 my-5 ">
          {status === 'loading' ? (
            <div className="text-center py-4">Loading ....</div>
          ) :
            articles.length > 0 ? (
              <div className="grid grid-cols-3">
                {articles.map((article, index) => (
                  <div key={article.id || index} className="rounded-md mx-2 px-5 py-2 border">
                    <div className="flex justify-between">
                      <h3 className="font-semibold my-2">{article.title}</h3>
                      <h5 className="text-lg"> {article.category}</h5>
                    </div>
                    {/* <p className="my-3">{article.content ? article.content: 'no content aveillable'}</p> */}
                    <hr />
                    <div className="flex gap-2 my-2 justify-end">
                      <button className="hover:ease-in-out text-purple-600  py-1 px-2 text-lg flex cursor-pointer">
                        More info <BiFastForward className="mt-2" />{" "}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">No articles available.</p>
            )}
        </div>
        <div className="flex gap-4">
          <div className=" flex w-2/3 border rounded ">
            <Search className="mt-2 ml-2" size={30} />
            <input
              type="text"
              placeholder="Search articles..."
              className="rounded-md w-full ml-2 text-lg "
            />
          </div>
          <select
            className="w-1/3 mr-4 border rounded text-lg"
            value={selectCategory}
            onChange={(e) => setSelectCategory(e.target.value)}
          >
            <option value="AllCategory">All Categories</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
          <Button className="bg-purple-600  text-white font-bold py-5 px-4 rounded flex" onClick={() => handleOpenModal()}>
            <BiPlus size={23} /> New Article
          </Button>
        </div>
        <div className="rounded border p-10 my-2">
          {articles.length > 0 ? (
            <table className="min-w-full">
              <tbody>
                {articles.map((article, index) => (
                  <tr key={article.id || index} className="border text-left text-sm text-gray-800">
                    <td>
                      {article.picture ? (
                        <img
                          src={article.picture}
                          alt="Article Image"
                          width={70}
                          height={50}
                          className="rounded-md m-2 object-cover"
                        />
                      ) : (
                        <img src="https://via.placeholder.com/40" alt="Placeholder" />
                      )}
                    </td>
                    <td>{article.title}</td>
                    <td>{article.category}</td>
                    <td>{article.publishedDate}</td>
                    <td>
                      <Button className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800" onClick={() => handleOpenModal(article)}
                      >
                        <Edit />
                      </Button>
                      <Button className="px-2 py-1 text-sm ml-3 text-gray-600 hover:text-gray-800" onClick={() => handleDeleteArticle(article)}>
                        <FaTrash size={20} color="red" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 text-lg">
                    No articles available.
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Modal for creating article */}
      <Modal open={CreateArticleModal} onCancel={handleCancelCreateArticleModal} footer={null}
        title={editArticleModal ? " Edit Article" : "Create new Article"} >
        <div className="rounded  m-2">
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Article Title"
              rules={[
                { required: true, message: 'Please enter title' }]}
            >
              <Input placeholder="article title" />
            </Form.Item>
            <Form.Item
              name="author"
              label="Author"
              rules={[
                { required: true, message: 'Please enter author' }]}
            >
              <Input placeholder="Enter name of Author" />

            </Form.Item>
            <div className="flex gap-3">
              <Form.Item
                name="category"
                label="Category"
                className="w-full"
                rules={[
                  { required: true, message: 'Please select category' }]}
              >
                <Input placeholder="article category" />
              </Form.Item>
              <Form.Item
                name="dateUploaded"
                label="Published Date"
                className="w-full"
                rules={[
                  { required: true, message: 'Please select date uploaded' }]}>
                <Input type="date" />
              </Form.Item>
            </div>

            <Form.Item
              name="coverImage"
              label="Article Cover Image"
              rules={[
                { required: false }]}>
              <Upload maxCount={1} >
                <Button><FaUpload />Select Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="content"
              label="Content"
              rules={[
                { required: true, message: 'Please enter content' }]}>
              <TextArea placeholder="Article content" />
            </Form.Item>
          </Form>
        </div>
        <div className="flex justify-end">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full font-bold py-2 px-4 rounded flex"
            htmlType="submit"
            onClick={editArticleModal ? handleEditClick : handleCreateArticle}
            loading={status === "loading"} disabled={status === 'loading'}
          >
            {editArticleModal ? "Update Article" : "Add Article"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Article_Management;