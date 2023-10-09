import { useEffect, useState } from "react";
import InputLayout from "../input/InputLayout";
import axiosClient from "../../utils/AxiosClient";

export default function StudentParentDetailsModal({ toggleModal, studentId }) {
  const [schoolId, setSchoolid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("Jr");
  const [gender, setGender] = useState("Male");
  const [birthDate, setBirthDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [village, setVillage] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("General Santos City");

  //Parent fields
  const [parentFirstName, setParentFirstname] = useState("");
  const [parentMiddleName, setParentMiddleName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [parentSuffix, setParentSuffix] = useState("Jr");
  const [parentGender, setParentGender] = useState("Male");
  const [parentContactNumber, setParentContactNumber] = useState("");
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    const getStudentDetails = async () => {
      try {
        const response = await axiosClient.get(`/student/${studentId}`);
        if (response.status === 200) {
          const student = response.data;
          setSchoolid(() => student.school_id);
          setFirstName(() => student.first_name);
          setMiddleName(() => student.middle_name);
          setLastName(() => student.last_name);
          setSuffix(() => student.suffix);
          setGender(() => student.gender);
          setBirthDate(() => student.birthdate);
          setContactNumber(() => student.contact_number);
          setVillage(() => student.address.village);
          setStreet(() => student.address.street);
          setBarangay(() => student.address.barangay);
          setCity(() => student.address.city);
          setParentFirstname(() => student.parent.first_name);
          setParentMiddleName(() => student.parent.middle_name);
          setParentLastName(() => student.parent.last_name);
          setParentSuffix(() => student.parent.suffix);
          setParentGender(() => student.parent.gender);
          setParentContactNumber(() => student.parent.contact_number);
          setRelationship(() => student.parent.relationship);
        }
      } catch (error) {}
    };
    getStudentDetails();
  }, []);

  const handleClose = () => {
    toggleModal(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center modal-backdrop"
      style={{ minHeight: "100vh" }}
    >
      <div className="modal w-full md:w-7/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header px-4 py-3 mt-4 border-b border-gray-50">
          <p className="text-xl">
            <span className="inline-block me-2">
              <img src="/img/info.svg" alt="" />
            </span>
            Student Details
          </p>
        </header>

        <main className="px-8 pb-4 h-80 overflow-y-auto">
          <div className="max-h-96 px-2 flex space-x-6">
            <div className="py-6 w-full space-y-4">
              <p className="py-1 px-2 rounded-md text-center text-gray-700 bg-gray-100">
                Student
              </p>
              <InputLayout label="LRN" value={schoolId} />
              <hr />
              <InputLayout label="First Name" value={firstName} />
              <hr />
              <InputLayout label="Middle Name" value={middleName} />
              <hr />
              <InputLayout label="Last Name" value={lastName} />
              <hr />
              <InputLayout label="Suffix" value={suffix} />
              <hr />
              <InputLayout label="Gender" value={gender} />
              <hr />
              <InputLayout label="Birthdate" value={birthDate} />
              <hr />
              <InputLayout label="Contact Number" value={contactNumber} />
              <p className="py-1 px-2 rounded-md text-center text-gray-700 bg-gray-100">
                Address
              </p>
              <InputLayout label="Village" value={village} />
              <hr />
              <InputLayout label="Street" value={street} />
              <hr />
              <InputLayout label="Barangay" value={barangay} />
              <hr />
              <InputLayout label="City/Municipality" value={city} />
            </div>
            <div className="py-6 w-full space-y-4">
              <p className="py-1 px-2 rounded-md text-center text-gray-700 bg-gray-100">
                Parent
              </p>
              <InputLayout label="First Name" value={parentFirstName} />
              <hr />
              <InputLayout label="Middle Name" value={parentMiddleName} />
              <hr />
              <InputLayout label="Last Name" value={parentLastName} />
              <hr />
              <InputLayout label="Suffix" value={parentSuffix} />
              <hr />
              <InputLayout label="Gender" value={parentGender} />
              <hr />
              <InputLayout label="Contact Number" value={parentContactNumber} />
              <hr />
              <InputLayout label="Relationship" value={relationship} />
              <hr />
            </div>
          </div>
        </main>
        <footer className="modal-footer border-t border-gray-50 p-4 flex justify-center space-x-3">
          <button
            onClick={handleClose}
            className="px-3 py-2 rounded-sm bg-gray-500 hover:bg-gray-700 text-white text-sm"
            type="button"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
