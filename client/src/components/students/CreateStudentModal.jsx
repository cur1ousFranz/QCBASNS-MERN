import { useContext, useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import { Alert } from "../../utils/Alert";
import numbersOnly from "../../utils/NumberKeys";

const CreateStudentModal = ({ toggleModal }) => {
  const [barangayList, setBarangayList] = useState([]);

  const [showStudentSuffix, setShowStudentSuffix] = useState(true);
  const [showParentSuffix, setShowParentSuffix] = useState(true);

  const [schoolId, setSchoolid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
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
  const [parentSuffix, setParentSuffix] = useState("");
  const [parentGender, setParentGender] = useState("Male");
  const [parentContactNumber, setParentContactNumber] = useState("");
  const [relationship, setRelationship] = useState("");

  //TODO:: DISPLAY ERROR EMPTY FIELDS

  useState(() => {
    const getAllBarangays = async () => {
      try {
        const response = await axiosClient.get("/barangay");
        if (response.status === 200) {
          setBarangayList(() => response.data);
          setBarangay(() => response.data[0].name);
        }
      } catch (error) {}
    };

    getAllBarangays();
  }, []);

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
      className="fixed inset-0 flex items-center px-4 justify-center modal-backdrop bg-opacity-50 bg-gray-50"
    >
      <div className="modal w-full md:w-5/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header px-4 py-4 mt-4">
          <p className="text-xl">New Student</p>
        </header>

        <main className="px-4">
          <form
            id="semester-form"
            onSubmit={handleFormSubmit}
            className=" max-h-96 overflow-y-auto"
          >
            <p className="text-lg">Student Details</p>
            <div className="py-6 space-y-5">
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>School ID</label>
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
                <div className="w-full">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <div className="flex justify-between">
                    <label>Suffix (Optional)</label>
                    <input
                      onChange={() =>
                        setShowStudentSuffix(() => !showStudentSuffix)
                      }
                      type="checkbox"
                      className="w-3 h-3 mt-2 bg-gray-100 rounded border-gray-300 focus:ring-gray-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-gray-500"
                    />
                  </div>
                  <select
                    onChange={(e) => setSuffix(e.target.value)}
                    defaultValue={"Select"}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                    disabled={showStudentSuffix}
                  >
                    <option value="Select" disabled>
                      Select
                    </option>
                    <option value="Jr">Jr</option>
                    <option value="Sr">Sr</option>
                  </select>
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <label>Gender</label>
                  <select
                    onChange={(e) => setGender(() => e.target.value)}
                    value={gender}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Birthdate</label>
                  <input
                    onChange={(e) => setBirthDate(e.target.value)}
                    value={birthDate}
                    type="date"
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <label>Contact Number</label>
                  <input
                    onKeyDown={numbersOnly}
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                    maxLength={11}
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <hr />
              <p className="text-lg">Parent Details</p>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={parentFirstName}
                    onChange={(e) => setParentFirstname(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    value={parentMiddleName}
                    onChange={(e) => setParentMiddleName(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={parentLastName}
                    onChange={(e) => setParentLastName(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <label>Suffix (Optional)</label>
                    <input
                      onChange={() =>
                        setShowParentSuffix(() => !showParentSuffix)
                      }
                      type="checkbox"
                      className="w-3 h-3 mt-2 bg-gray-100 rounded border-gray-300 focus:ring-gray-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-gray-500"
                    />
                  </div>
                  <select
                    onChange={(e) => setParentSuffix(e.target.value)}
                    defaultValue={"Select"}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                    disabled={showParentSuffix}
                  >
                    <option value="Select" disabled>
                      Select
                    </option>
                    <option value="Jr">Jr</option>
                    <option value="Sr">Sr</option>
                  </select>
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Gender</label>
                  <select
                    onChange={(e) => setParentGender(() => e.target.value)}
                    value={parentGender}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <label>Contact Number</label>
                  <input
                    onKeyDown={numbersOnly}
                    onChange={(e) => setParentContactNumber(e.target.value)}
                    value={parentContactNumber}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                    maxLength={11}
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Relationship</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full"></div>
              </div>
              <hr />
              <p className="text-lg">Address Details</p>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <label>Street</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  />
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Barangay</label>
                  <select
                    onChange={(e) => setBarangay(() => e.target.value)}
                    value={barangay}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  >
                    {barangayList.length > 0 &&
                      barangayList.map((barangay) => (
                        <option key={barangay._id} value={barangay.name}>
                          {barangay.name}
                        </option>
                      ))}
                  </select>
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
                <div className="w-full">
                  <label>City/Municipality</label>
                  <input
                    type="text"
                    value={city}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                    disabled
                  />
                  {/* <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
                /> */}
                  {/* {error && (
                  <p className="text-sm absolute text-red-500">{error}</p>
                )} */}
                </div>
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
            Create Student
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CreateStudentModal;
