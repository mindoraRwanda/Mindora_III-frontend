import { Button, DatePicker, Form, Input, message, Modal, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { BiDownload, BiPlus } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { createReport, deletePatientReport, getAllReports, ReportInput, updatePatientReport } from '../../Redux/TherapistSlice/ReportSlice';
// import moment from 'moment';

function Reports() {
  const reportContent=useSelector((state:RootState)=>state.reports.Reports);
  const status=useSelector((state:RootState)=>state.reports.status);

  const [isreportShow,setIsReportShow]=useState(false);
  const [isEditModal,setIsEditModal]=useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [userId,setUserId]=useState('');
  const [form] = Form.useForm();
  const dispatch=useDispatch<AppDispatch>();

  //function to create report
  const handleCreateReport=async()=>{
    try{
      const values=form.getFieldsValue();
      const reportValue:ReportInput={
        userId:userId,
        startDate:values.startDate.format('YYYY-MM-DD'),
        endDate:values.endDate.format('YYYY-MM-DD'),
      }
      await dispatch(createReport(reportValue));
      message.success('Report created successfully');
      setIsReportShow(false);
      dispatch(getAllReports(userId)); 
      form.resetFields();
      
    }
    catch(error){
      console.log(error);
      message.error('Failed to create report');
    }
  };

  const handleShow=(report:any)=>{
    setIsEditModal(true);
    setCurrentReportId(report.id);
    const moodValue = typeof report.moodSummary === 'object'
    ? report.moodSummary?.averageRating || ''
    : report.moodSummary || '';
    
  const symptomValue = typeof report.symptomSummary === 'object'
    ? report.symptomSummary?.mostFrequentSymptom || ''
    : report.symptomSummary || '';
    form.setFieldsValue({
      moodSummary:moodValue,
      symptomSummary:symptomValue
    });
    setUserId(report.userId);
  };

  // function to update
  const handleUpdateReport=async()=>{
    try{
      const values=form.getFieldsValue();
      const reportValue={
        id:currentReportId,
        moodSummary: values.moodSummary,
        symptomSummary: values.symptomSummary,
      }
      await dispatch(updatePatientReport(reportValue as any));
      message.success('Report updated successfully');
      setIsEditModal(false);
      dispatch(getAllReports(userId));
      form.resetFields();
    }
    catch(error){
      console.log(error);
      message.error('Failed to update report');
    }
  };

  //Function to delete report
  const handleDeleteReport=(id:any)=>{
    dispatch(deletePatientReport(id));
    message.success('Report deleted successfully');
    dispatch(getAllReports(userId));
  };

// function to display all reports
  useEffect(()=>{
    const storedUserId=localStorage.getItem('UserId');
    const response= dispatch(getAllReports(userId));
    console.log("All reports",response);
    if(!storedUserId){
      message.error('User ID not found');
      return;
    }
    setUserId(storedUserId);
  },[dispatch, userId]);

  return (
    <div className="bg-white rounded border px-8 mt-4">
      <div className='flex justify-between p-3 mt-5'>
      <h3 className='text-black text-2xl font-semibold'>Patient Progress Report</h3>
      <Button className='bg-purple-600 text-white font-semibold p-5 flex' onClick={()=>setIsReportShow(true)}> <BiPlus size={25}/>
         New Report</Button> 
      </div>
     
      <table className='w-full'>
        <thead>
          <tr className='border-b text-gray-600' >
            <th className='p-3 text-left'>Patient ID</th>
            <th className='p-3 text-left'>Patient Mood</th>
            <th className='p-3 text-left'>Patient symptom Summary </th>
            <th className='p-3 text-left'>Start Date</th>
            <th className='p-3 text-left'>End Date</th>
            <th className='p-3 text-left'>Actions</th>
          </tr>
        </thead>
        <tbody>
        {status==='loading'?(
          <div className="flex items-center justify-center ">
          <Spin size="large" />
      </div>
      ):(reportContent && reportContent.length > 0 ?( reportContent.map((report,index)=>(
          <tr className='border-b text-gray-700'>
            <td className='p-3 text-left'>{index+1}</td>
            <td className='p-3 text-left'>{typeof report.moodSummary === 'object' ? (report.moodSummary?.averageRating || 'N/A') : (report.moodSummary || 'N/A')}</td>
            <td className='p-3 text-left'>{typeof report.symptomSummary === 'object' ? (report.symptomSummary?.mostFrequentSymptom || 'N/A'): (report.symptomSummary || 'N/A')}</td>
            <td className='p-3 text-left'>{report.startDate}</td>
            <td className='p-3 text-left'>{report.endDate}</td>
            <td className='p-3 text-left flex'>
              <Button  className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded flex items-center justify-center hover:bg-slate-200 transition-colors ml-2">View</Button>
              <Button  className="px-3 py-1 bg-indigo-500 text-white rounded flex items-center justify-center hover:bg-indigo-600 transition-colors ml-2"onClick={()=>handleShow(report)}>Edit</Button>
              <Button   className="px-3 py-1 bg-rose-500 text-white rounded flex items-center justify-center hover:bg-rose-600 transition-colors ml-2" onClick={()=>handleDeleteReport(report.id)}>Delete</Button>
              <Button  className="px-3 py-1 bg-emerald-500 text-white rounded flex items-center justify-center hover:bg-emerald-600 transition-colors ml-2"><BiDownload/>Download</Button>
            </td>
          </tr>
  ))):<tr><td>NO Report Found</td></tr>)}
        </tbody>
      </table>
    
      <Modal open={isreportShow} onCancel={()=>{setIsReportShow(false);form.resetFields()}} footer={null} title="CREATE NEW REPORT">
        <Form form={form} layout='vertical'onFinish={handleCreateReport} >
          <Form.Item name="startDate" label="Start Date" rules={[{required:true,message:"Please enter start date before!"}]} >
            <DatePicker  className='w-full'/>
          </Form.Item>
          <Form.Item name="endDate" label="End Date" rules={[{required:true,message:"Please enter start date before!"}]} >
            <DatePicker className='w-full'/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className='w-full'
               loading={status==="loading"} disabled={status==='loading'}
            >
              Create Report
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* modal for updates  */}
      <Modal open={isEditModal}  onCancel={() => {setIsEditModal(false);form.resetFields();}} footer={null} title="EDIT REPORT">
        <Form form={form} layout='vertical' onFinish={handleUpdateReport} >
          <Form.Item name="moodSummary" label="Mood Summary" rules={[{required:true,message:"Please enter mood summary!"}]} >
            <Input.TextArea rows={2} className='w-full border px-2 rounded'/>
          </Form.Item>
          <Form.Item name="symptomSummary" label="Symptom Summary" rules={[{required:true,message:"Please enter symptom summary!"}]} >
            <Input.TextArea rows={2} className='w-full border px-2 rounded' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className='w-full'
              loading={status==="loading"} disabled={status==='loading'}
            >
              Update Report
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Reports