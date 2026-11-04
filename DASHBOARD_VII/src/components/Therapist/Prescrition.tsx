import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { 
  createPrescription, 
  deletePrescription, 
  fetchAllPrescription, 
  updatePrescription,
  MedicalPrescription 
} from '../../Redux/TherapistSlice/MedicationPrescription';
import { Button, DatePicker, Form, Input, Modal, Select, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { getAllMedication } from '../../Redux/TherapistSlice/MedicationSlice';
import { getAllPatientOfTherapy } from '../../Redux/Adminslice/PatientSlice';
import dayjs from 'dayjs';
import { BiPlus } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { AppDispatch, RootState } from '../../Redux/store';

export default function Prescription() {
  const medicaPredictions = useSelector((state: RootState) => state.MedicationPrescription.data);
  const statusPre = useSelector((state: RootState) => state.MedicationPrescription.status);
  const medicals = useSelector((state: RootState) => state.Medication.data);
  
  // Update the selector based on actual state structure
  const specificPatients = useSelector((state: RootState) => state.patients.data);
  
  const [filteredMedicationsPrescription, setFilteredMedicationsPrescription] = useState<MedicalPrescription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showPrescription, setShowPrescription] = useState(false);
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  // function for search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredMedicationsPrescription(medicaPredictions);
    } else {
      const filtered = medicaPredictions.filter((pre: MedicalPrescription) =>
        pre.medication.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMedicationsPrescription(filtered);
    }
  };

  useEffect(() => {
    setFilteredMedicationsPrescription(medicaPredictions);
  }, [medicaPredictions]);

  // this is for converting date in proper form
  const formatDate = (isoString: any) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  // to get patient information for therapist
  const therapistId = localStorage.getItem('TherapistId');
  useEffect(() => {
    if (therapistId) {
      dispatch(getAllPatientOfTherapy(therapistId));
    }
  }, [dispatch, therapistId]);

  // This is for getting all medications
  useEffect(() => {
    dispatch(getAllMedication());
  }, [dispatch]);

  // These are for Medication Prescriptions
  // useEffect for fetching all prescription
  useEffect(() => {
    dispatch(fetchAllPrescription());
  }, [dispatch])

  // Function to create prescription
  const handleCreatePrescription = async () => {
    const therapistId = localStorage.getItem('TherapistId');
    try {
      const values = await form.validateFields();
      
      // Find the selected medication to include in the prescription data
      const selectedMedication = medicals.find((med: any) => med.id === values.medicationId);
      
      const prescriptionData = {
        patientId: "159204fc-2726-428e-ab4f-dc6ef2d91f12",
        therapistId: therapistId || "",
        medicationId: values.medicationId,
        dosage: values.dosage,
        duration: values.duration,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
        notes: values.notes,
        medication: {
          id: values.medicationId,
          name: selectedMedication?.name || ""
        }
      };
      
      console.log('data that is being sent:', prescriptionData);
      const result = await dispatch(createPrescription(prescriptionData));
      
      if (createPrescription.fulfilled.match(result)) {
        message.success("Medication Prescription created successfully!");
        form.resetFields();
        setShowPrescription(false);
        dispatch(fetchAllPrescription());
      }
    }
    catch (error: any) {
      console.log(error.message);
    }
  };

  // Function to get edit modal
  const handleShowPrescription = (id: string) => {
    setShowPrescription(true);
    const prescription = medicaPredictions.find((prescription: any) => prescription.id === id);
    console.log("Found prescription:", prescription);
    if (prescription) {
      form.setFieldsValue({
        medicationId: prescription.medicationId,
        dosage: prescription.dosage,
        duration: prescription.duration,
        startDate: prescription.startDate ? dayjs(prescription.startDate) : null,
        endDate: prescription.endDate ? dayjs(prescription.endDate) : null,
        status: prescription.status,
        notes: prescription.notes,
      });
    }
    else {
      message.error('Prescription not found to update');
    }
    setCurrentPrescriptionId(id);
  }

  // to update prescription
  const handleUpdatePrescription = async () => {
    if (!currentPrescriptionId) {
      message.error('No prescription selected for update');
      return;
    };
    try {
      const values = await form.validateFields();
      
      // Find the selected medication to include in the updated prescription data
      const selectedMedication = medicals.find((med: any) => med.id === values.medicationId);
      
      const updatedPrescription = {
        id: currentPrescriptionId,
        patientId: "159204fc-2726-428e-ab4f-dc6ef2d91f12", // Assuming you need to include this for update
        therapistId: therapistId || "", // Assuming you need to include this for update
        medicationId: values.medicationId,
        dosage: values.dosage,
        duration: values.duration,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
        notes: values.notes,
        medication: {
          id: values.medicationId,
          name: selectedMedication?.name || ""
        }
      };
      
      console.log('data that is being sent:', updatedPrescription);
      const result = await dispatch(updatePrescription(updatedPrescription));
      
      if (updatePrescription.fulfilled.match(result)) {
        message.success("Medication Prescription updated successfully!");
        form.resetFields();
        setShowPrescription(false);
        setCurrentPrescriptionId(null);
        dispatch(fetchAllPrescription());
      }
    }
    catch (error: any) {
      console.log(error.message);
    }
  };

  // Function to delete a Prescription
  const handleDeletePrescription = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this prescription?');
    if (confirmDelete) {
      dispatch(deletePrescription(id));
      message.success('Medication Prescription deleted successfully');
      dispatch(fetchAllPrescription());
    }
  };

  return (
    <div className="bg-white rounded border pt-6 px-2 mt-14">
      <div className='flex gap-1'>
        <div className='w-1/3 p-5'>
          <h1 className="text-black text-2xl font-bold ">
            List of Patient
          </h1>

          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md mt-6">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-700">
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider border-b">ID</th>
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider border-b">Name</th>
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statusPre === 'loading' ? (
                <tr>
                  <td colSpan={3} className="py-4">
                    <div className="flex items-center justify-center">
                      <Spin size="small" />
                    </div>
                  </td>
                </tr>
              ) : (
                specificPatients && specificPatients.length > 0 ? (
                  specificPatients.map((patient: any, index: any) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4 text-gray-800">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{patient.user.firstName}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            className="px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150 text-sm"
                            onClick={() => handleShowPrescription(patient.id)}
                          >
                            View
                          </Button>
                          <Button
                            className="px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-150 text-sm"
                            onClick={() => handleDeletePrescription(patient.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      No Patients Found
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        
        <div className="w-2/3">
          <div className="flex justify-between gap-5 w-full my-2">
            <h2 className="text-xl font-bold text-black">
              Medication Prescription
            </h2>
            <div className="items-center border rounded bg-white flex float-right">
              <input
                type="text"
                name="query"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="rounded outline-none text-black -m-3 pl-6 "
              />
              <button
                type="submit"
                className="p-2 text-xl text-black bg-white rounded-r"
              >
                <FiSearch />
              </button>
            </div>

            <Button className="mt-1 p-5 text-white font-semibold bg-purple-600 rounded-md" onClick={() => setShowPrescription(true)}>
              <BiPlus size={25} />  Create Prescription
            </Button>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Medication Name</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Dosage</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">start date</th>
                <th className="p-3 text-left">End date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {statusPre === 'loading' ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    <div className="flex items-center justify-center">
                      <Spin size="large" />
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMedicationsPrescription.length > 0 ? (
                  filteredMedicationsPrescription.map((prescription, index) => (
                    <tr className="text-black" key={index}>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{prescription.medication ? prescription.medication.name : 'N/A'}</td>
                      <td className="p-3">{prescription.notes}</td>
                      <td className="p-3">{prescription.dosage}</td>
                      <td className="p-3">{prescription.duration}</td>
                      <td className="p-3">{formatDate(prescription.startDate)}</td>
                      <td className="p-3">{formatDate(prescription.endDate)}</td>
                      <td className="p-3">{prescription.status}</td>
                      <td className="p-3 flex">
                        <Button className="text-sm font-semibold text-white bg-blue-600 rounded-md p-2" onClick={() => handleShowPrescription(prescription.id || "")}>
                          Edit
                        </Button>
                        <Button className="ml-2 text-sm font-semibold text-white bg-red-600 rounded-md p-2" onClick={() => handleDeletePrescription(prescription.id || "")}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-500">
                      No Prescription Found
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* That is Modal for handling Medication Prescription */}
      <Modal
        open={showPrescription}
        onCancel={() => { setShowPrescription(false); form.resetFields(); setCurrentPrescriptionId(null) }}
        footer={null}
        title={currentPrescriptionId ? "Update Medication Prescription" : "Create Medication Prescription"}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Medication" name="medicationId" rules={[{ required: true, message: "Please select the medication!" }]}>
            <Select
              placeholder="Select medication"
              options={medicals.map((med: any) => ({
                value: med.id,
                label: med.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Dosage" name="dosage" rules={[{ required: true, message: "Please input the medication dosage!" }]}>
            <Input />
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Duration" name="duration" rules={[{ required: true, message: "Please input the duration" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status" className="w-full" rules={[{ required: true, message: "Please select the status" }]}>
              <Select
                placeholder="Select status"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Start Date" name="startDate" className="w-full" rules={[{ required: true, message: "Please select the start date" }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="End Date" name="endDate" className="w-full" rules={[{ required: true, message: "Please select the end date" }]}>
              <DatePicker />
            </Form.Item>
          </div>
          <Form.Item label="Notes" name="notes" rules={[{ required: true, message: "Please input the medication notes!" }]}>
            <TextArea />
          </Form.Item>
          <Button 
            className="w-full bg-purple-600 text-white p-3" 
            onClick={() => currentPrescriptionId ? handleUpdatePrescription() : handleCreatePrescription()}
            loading={statusPre === "loading"} 
            disabled={statusPre === 'loading'}
          >
            {currentPrescriptionId ? "Update Prescription" : "Create Prescription"}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}