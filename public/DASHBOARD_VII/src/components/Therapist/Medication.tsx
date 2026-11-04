import { Button, Input, Modal, Form, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  createMedication,
  deleteMedication,
  getAllMedication,
  PatientMedication,
  updateMedication,
} from "../../Redux/TherapistSlice/MedicationSlice";
import TextArea from "antd/es/input/TextArea";
import { BiPlus } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

export default function Medication() {
  const medicals = useSelector((state: RootState) => state.Medication.data);
  const status = useSelector((state: RootState) => state.Medication.status);
  const [showMedication, setShowMedication] = useState(false);
  const [filteredMedications, setFilteredMedications] = useState<
    PatientMedication[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  // function for search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredMedications(medicals);
    } else {
      const filtered = medicals.filter((med: PatientMedication) =>
        med.name?.toLowerCase().includes(query.toLowerCase())
      ) as PatientMedication[];
      setFilteredMedications(filtered);
    }
  };

  useEffect(() => {
    setFilteredMedications(medicals);
  }, [medicals]);

  // This is for getting all medications
  useEffect(() => {
    dispatch(getAllMedication());
  }, [dispatch]);

  // this is for converting date inf proper form
  const formatDate = (isoString:any) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  // this is for creating new medication
  const handleCreateMedication = async () => {
    try {
      const values = await form.validateFields();
      const MedicationData = {
        name: values.name,
        dosageForm: Number(values.dosageForm),
        strength: values.strength,
        description: values.description,
      };
      console.log("data that is being sent:", MedicationData);
      const result = await dispatch(createMedication(MedicationData));
      if (createMedication.fulfilled.match(result)) {
        message.success("Medication created successfully!");
        form.resetFields();
        setShowMedication(false);
        dispatch(getAllMedication());
      }
    } catch (error:any) {
      console.log(error.message);
    }
  };
  // function for updating the medication
  const handleUpdateMedication = async (id: string) => {
    const medication = medicals.find((medication) => medication.id === id);
    if (medication) {
      form.setFieldsValue({
        name: medication.name,
        dosageForm: medication.dosageForm,
        strength: medication.strength,
        description: medication.description,
      });
      setShowMedication(true);
    } else {
      message.error("Medication not found!");
    }
    try {
      const values = await form.validateFields();
      const updatedMedication = {
        id,
        name: values.name,
        dosageForm: values.dosageForm,
        strength: values.strength,
        description: values.description,
      };
      const UpdatedResult = await dispatch(updateMedication(updatedMedication));
      if (createMedication.fulfilled.match(UpdatedResult)) {
        message.success("Medication updated successfully!");
        form.resetFields();
        setShowMedication(false);
        dispatch(getAllMedication());
      }
    } catch (error:any) {
      console.log(error.message);
    }
  };

  // that is for deleting medication
  const handleDeleteMedication = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this medication?"
    );
    if (confirm) {
      try {
        const result = await dispatch(deleteMedication(id));
        if (deleteMedication.fulfilled.match(result)) {
          message.success("Medication deleted successfully!");
          dispatch(getAllMedication());
        } else {
          message.error("Failed to delete medication");
        }
      } catch (error:any) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="bg-white rounded border pt-6 px-2 mt-14">
      <div className="ml-10">
        <div className="flex justify-between gap-5 p-5 w-full my-2">
          <h2 className="text-xl font-bold text-black">
            Medication Management
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

          <Button
            className="mt-1 p-5 text-white font-semibold bg-purple-600 rounded-md"
            onClick={() => setShowMedication(true)}
          >
            <BiPlus size={25} /> Add Medication
          </Button>
        </div>
        <table className="w-full border-collapse mt-6">
          <thead>
            <tr className="border-b text-gray-600  ">
              <th className="p-3 text-left ">ID</th>
              <th className="p-3 text-left ">Name</th>
              <th className="p-3 text-left w-3/10">Description</th>
              <th className="p-3 text-left ">DosageForm</th>
              <th className="p-3 text-left ">strength</th>
              <th className="p-3 text-left ">Created date</th>
              <th className="p-3 text-left ">Updated date</th>
              <th className="p-3 text-left ">Action</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <div className="flex items-center justify-center ">
                <Spin size="large" />
              </div>
            ) : filteredMedications.length > 0 ? (
              filteredMedications.map((med, index) => (
                <tr className="text-black" key={index}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{med.name}</td>
                  <td className="p-3 w-3/10">{med.description}</td>
                  <td className="p-3">{med.dosageForm}</td>
                  <td className="p-3">{med.strength}</td>
                  <td className="p-3">{formatDate(med.createdAt)}</td>
                  <td className="p-3">{formatDate(med.updatedAt)}</td>
                  <td className="p-3 flex">
                    <Button
                      className="px-3 py-1 bg-indigo-500 text-white rounded flex items-center justify-center hover:bg-indigo-600 transition-colors ml-2"
                      onClick={() => handleUpdateMedication(String(med.id))}
                    >
                      Edit
                    </Button>
                    <Button
                      className="px-3 py-1 bg-rose-500 text-white rounded flex items-center justify-center hover:bg-rose-600 transition-colors ml-2"
                      onClick={() => handleDeleteMedication(String(med.id))}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-black">
                <td colSpan={8} className="text-center">
                  {searchQuery
                    ? "No matching medications found."
                    : "No medications available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Modal
          open={showMedication}
          onCancel={() => {
            setShowMedication(false);
            form.resetFields();
          }}
          footer={null}
          title="Create Medication"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="FullName"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input the medication name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Dosage Form"
              name="dosageForm"
              rules={[
                {
                  required: true,
                  message: "Please input the medication dosageForm !",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Strength"
              name="strength"
              rules={[
                {
                  required: true,
                  message: "Please input the medication Strength !",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input the medication Description!",
                },
              ]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                className="text-white bg-purple-600 p-3 flex w-full"
                onClick={handleCreateMedication}
                loading={status === "loading"}
                disabled={status === "loading"}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
