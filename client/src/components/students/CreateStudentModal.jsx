import { useContext, useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import { SemesterContext } from "../../context/SemesterContext";
import { Alert } from "../../utils/Alert";

const CreateStudentModal = ({ toggleModal }) => {
  const [schoolId, setSchoolid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [village, setVillage] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");

  //Parent fields
  const [parentFirstName, setParentFirstname] = useState("");
  const [parentMiddleName, setParentMiddleName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [parentSuffix, setParentSuffix] = useState("");
  const [parentGender, setParentGender] = useState("");
  const [parentContactNumber, setParentContactNumber] = useState("");
  const [relationship, setRelationship] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    toggleModal(false);
  };

  const handleBackdropCancel = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      toggleModal(false);
    }
  };

  return (
    <div
      onClick={handleBackdropCancel}
      className="fixed inset-0 flex items-center justify-center modal-backdrop bg-opacity-50 bg-gray-50"
    >
      <div className="modal w-full md:w-1/3 bg-white rounded-lg shadow-lg">
        <header className="modal-header px-4 mt-4">
          <p className="text-xl">New Student</p>
        </header>

        <main className="px-4">
          <form id="semester-form" onSubmit={handleFormSubmit}>
            <div className="py-6 space-y-5">
              <div>
                <label>Student ID</label>
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setSchoolid(e.target.value)}
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
                />
                {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
              </div>
            </div>
          </form>
        </main>

        <footer className="modal-footer p-4 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-3 py-2 border border-gray-900 text-gray-900 text-sm"
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm"
            type="submit"
            form="semester-form"
          >
            Creat Semester
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CreateStudentModal;
