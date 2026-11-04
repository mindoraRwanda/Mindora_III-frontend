import { Button, Form, Input, Modal, Spin, message, Card, Statistic,  Empty, Tooltip } from "antd";
import { CheckCircle, Calendar, DollarSign, Clock, AlertCircle, } from "lucide-react";
import  { useEffect, useState } from 'react';
import { BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import { MdPending } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createBillReport, deleteBillReport, getBillingReports, Reports, updateBillReport } from "../../Redux/Adminslice/BillingReportSlice";
import { AppDispatch, RootState } from "../../Redux/store";


export default function BillingReports() {
  const reports = useSelector((state: RootState) => state.BillingReports.data);
  const status = useSelector((state: RootState) => state.BillingReports.status);
  const [OpenBillMOdal,setOpenBillModal]=useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [currentBill, setCurrentBill] = useState<Reports | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const handleReportOpen = () => {
    setOpenBillModal(true);
  };

  const handleCloseBillModal = () => {
    setOpenBillModal(false);
    setUpdateModal(false);
    form.resetFields();
  };

  const openUpdateModel = (report: any) => {
    setCurrentBill(report);
    form.setFieldsValue({
      totalRevenue: report.totalRevenue,
      approvedInsuranceClaims: report.approvedInsuranceClaims,
      rejectedInsuranceClaims: report.rejectedInsuranceClaims,
      pendingInsuranceClaims: report.pendingInsuranceClaims,
      totalOutstandingBalance: report.totalOutstandingBalance,
    });
    setUpdateModal(true);
  };

  // Function update
  const handleUpdateBillReport = async () => {
    try {
      const values = form.getFieldsValue();
      if (!currentBill) return;
      await dispatch(updateBillReport({ id: currentBill.id, ...values })).unwrap();
      message.success("Report updated successfully");
      setUpdateModal(false);
      form.resetFields();
      dispatch(getBillingReports());
    } catch (error) {
      message.error("Failed to update report: " + error);
    }
  };

  // Create bill 
  const handleCreateReport = async (values: any) => {
    const formData = {
      startDate: values.startTime, 
      endDate: values.endTime,
    };
    try {
      await dispatch(createBillReport(formData)).unwrap();
      message.success("Report created successfully");
      setOpenBillModal(false);
      form.resetFields();
      dispatch(getBillingReports());
    } catch (error) {
      message.error("Failed to create report: " + error);
    }
  };

  // Delete Bill Report
  const handleDeleteReport = async (id: any) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this report? This action cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await dispatch(deleteBillReport(id)).unwrap();
          message.success("Report deleted successfully");
          dispatch(getBillingReports());
        } catch (error) {
          message.error("Failed to delete report: " + error);
        }
      }
    });
  };

  // Get all bills
  useEffect(() => {
    dispatch(getBillingReports());
  }, [dispatch]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: any) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (isoString: any) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate percentage for progress indicators
  const calculatePercentage = (part: number | undefined, total: number | undefined) => {
    const validPart = part ?? 0;
    const validTotal = total ?? 0;
    return validTotal > 0 ? Math.round((validPart / validTotal) * 100) : 0;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2 mt-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Billing Reports</h1>
          <p className="text-gray-500">View and manage financial reports</p>
        </div>
        <Button 
          type="primary"
          icon={<BiPlus size={18} />}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center" 
          size="large"
          onClick={handleReportOpen}
        >
          New Report
        </Button>
      </div>

      {status === 'loading' ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" tip="Loading reports..." />
        </div>
      ) : reports && reports.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {reports.map((report, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Calendar className="text-blue-500 mr-2" size={20} />
                  <h2 className="text-lg font-semibold">
                    Billing Period: <span className="text-blue-600">{formatDate(report.startDate)} - {formatDate(report.endDate)}</span>
                  </h2>
                </div>
                <div className="flex gap-2">
                  <Tooltip title="Edit Report">
                    <Button 
                      icon={<BiEdit size={18} />} 
                      onClick={() => openUpdateModel(report)}
                      className="flex items-center border-blue-400 text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete Report">
                    <Button 
                      icon={<BiTrash size={18} />} 
                      onClick={() => handleDeleteReport(report.id)}
                      danger
                      className="flex items-center"
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="bg-blue-50 border-none shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title={
                      <div className="flex items-center text-blue-700">
                        <DollarSign size={18} className="mr-1" />
                        <span className="text-lg font-medium">Total Revenue</span>
                      </div>
                    }
                    value={report.totalRevenue}
                    formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value))}
                    valueStyle={{ color: '#1a56db', fontWeight: 'bold', fontSize: '24px' }}
                  />
                  <div className="mt-2 text-gray-500">
                    Outstanding: {formatCurrency(report.totalOutstandingBalance || 0)}
                  </div>
                </Card>

                <Card className="bg-green-50 border-none shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title={
                      <div className="flex items-center text-green-700">
                        <CheckCircle size={18} className="mr-1" />
                        <span className="text-lg font-medium">Approved Claims</span>
                      </div>
                    }
                    value={report.approvedInsuranceClaims}
                    formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value || 0))}
                    valueStyle={{ color: '#047857', fontWeight: 'bold', fontSize: '24px' }}
                  />
                  <div className="mt-2 text-gray-500">
                    {calculatePercentage(report.approvedInsuranceClaims, report.totalRevenue)}% of total revenue
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="bg-yellow-50 border-none shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title={
                      <div className="flex items-center text-yellow-700">
                        <MdPending size={18} className="mr-1" />
                        <span className="text-lg font-medium">Pending Claims</span>
                      </div>
                    }
                    value={report.pendingInsuranceClaims}
                    formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value || 0))}
                    valueStyle={{ color: '#b45309', fontWeight: 'bold', fontSize: '24px' }}
                  />
                  <div className="mt-2 text-gray-500">
                    {calculatePercentage(report.pendingInsuranceClaims, report.totalRevenue)}% of total revenue
                  </div>
                </Card>

                <Card className="bg-red-50 border-none shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title={
                      <div className="flex items-center text-red-700">
                        <AlertCircle size={18} className="mr-1" />
                        <span className="text-lg font-medium">Rejected Claims</span>
                      </div>
                    }
                    value={report.rejectedInsuranceClaims}
                    formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value || 0))}
                    valueStyle={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '24px' }}
                  />
                  <div className="mt-2 text-gray-500">
                    {calculatePercentage(report.rejectedInsuranceClaims, report.totalRevenue)}% of total revenue
                  </div>
                </Card>
              </div>

              <div className="flex items-center text-gray-500 mt-2">
                <Clock size={16} className="mr-1" />
                <span>Last Updated: {formatDate(report.updatedAt)} at {formatTime(report.updatedAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No Billing Reports Available</h3>
                <p className="text-gray-500 mb-4">Create your first billing report to start tracking financial data</p>
                <Button 
                  type="primary" 
                  icon={<BiPlus size={18} />}
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={handleReportOpen}
                >
                  Create Report
                </Button>
              </div>
            }
          />
        </Card>
      )}

      {/* Create Report Modal */}
      <Modal footer={null} open={OpenBillMOdal} onCancel={handleCloseBillModal}>
<Form onFinish={handleCreateReport}>
 <h1 className="text-2xl justify-center font-semibold m-2">New Report</h1>
 <Form.Item label="Start Time" name="startTime">
<Input type="date" placeholder="Enter Start Time" />
</Form.Item>
<Form.Item label="End Time" name="endTime">
<Input type="date" placeholder="Enter End Time" />
 </Form.Item>
 <Button type="primary" htmlType="submit" className="w-full">
   Create
 </Button>
</Form>
</Modal>

      {/* Update Report Modal */}
      <Modal
        title={<h2 className="text-xl font-semibold">Update Billing Report</h2>}
        open={updateModal}
        onCancel={handleCloseBillModal}
        footer={null}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="totalRevenue"
              label="Total Revenue"
              rules={[{required: true, message: 'Please enter total revenue'}]}
            >
              <Input prefix="$" placeholder="Enter total revenue" />
            </Form.Item>
            <Form.Item
              name="approvedInsuranceClaims"
              label="Approved Claims"
              rules={[{required: true, message: 'Please enter approved claims'}]}
            >
              <Input prefix="$" placeholder="Enter approved claims" />
            </Form.Item>
            <Form.Item
              name="rejectedInsuranceClaims"
              label="Rejected Claims"
              rules={[{required: true, message: 'Please enter rejected claims'}]}
            >
              <Input prefix="$" placeholder="Enter rejected claims" />
            </Form.Item>
            <Form.Item
              name="pendingInsuranceClaims"
              label="Pending Claims"
              rules={[{required: true, message: 'Please enter pending claims'}]}
            >
              <Input prefix="$" placeholder="Enter pending claims" />
            </Form.Item>
          </div>
          <Form.Item
            name='totalOutstandingBalance'
            label='Outstanding Balance'
            rules={[{required: true, message: 'Please enter outstanding balance'}]}
          >
            <Input prefix="$" placeholder='Enter outstanding balance' />
          </Form.Item>

          <div className="mt-6">
            <Button 
              type="primary" 
              onClick={handleUpdateBillReport}
              className="w-full bg-blue-500 hover:bg-blue-600 h-10"
              loading={status === "loading"} 
              disabled={status === 'loading'}
            >
              Update Billing Report
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}