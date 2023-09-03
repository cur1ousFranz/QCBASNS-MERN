import { useContext, useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import numbersOnly from "../../utils/NumberKeys";
import { Alert } from "../../utils/Alert";
import { StudentContext } from "../../context/StudentContext";
import ValidationMessage from "../typography/ValidationMessage";
import {
  CHECKBOX_DEFAULT_STYLE,
  INPUT_DEFAULT_STYLE,
  INPUT_ERROR_STYLE,
} from "../../constants/Constant";
import ErrorModal from "../modals/ErrorModal";
import UpperCaseWords from "../../utils/UpperCaseWords";

const CreateStudentModal = ({ toggleModal, semesterId, title }) => {
  const { dispatch } = useContext(StudentContext);
  const [barangayList, setBarangayList] = useState([]);

  const [showStudentSuffix, setShowStudentSuffix] = useState(true);
  const [showParentSuffix, setShowParentSuffix] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  //Error fields
  const [errorFields, setErrorFields] = useState([]);
  const [contactNumberErrorMessage, setContactNumberErrorMessage] =
    useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");

  useEffect(() => {
    const getAllBarangays = async () => {
      try {
        const response = await axiosClient.get("/barangay");
        if (response.status === 200 && response.data.length) {
          setBarangayList(() => response.data);
          setBarangay(() => response.data[0].name);
        } else {
          setShowErrorModal(true);
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    };

    getAllBarangays();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    setErrorFields(() => errors);
    setContactNumberErrorMessage("");

    // Student details
    if (!schoolId) errors.push("schoolId");
    if (!firstName) errors.push("firstName");
    if (!lastName) errors.push("lastName");
    if (!birthDate) errors.push("birthDate");
    if (!village) errors.push("village");
    if (!street) errors.push("street");
    // Parent details
    if (!parentFirstName) errors.push("parentFirstName");
    if (!parentLastName) errors.push("parentLastName");
    if (!parentGender) errors.push("parentGender");
    if (parentContactNumber.length < 11) {
      setContactNumberErrorMessage("Contact number must be 11 digits.");
      errors.push("parentContactNumber");
    }
    if (!parentContactNumber) {
      setContactNumberErrorMessage(() => "Contact number is required.");
      errors.push("parentContactNumber");
    }
    if (!relationship) errors.push("relationship");
    if (errors.length === 0) {
      const studentSuff = showStudentSuffix === false ? suffix : "N/A";
      const parentSuff = showParentSuffix === false ? parentSuffix : "N/A";

      const newStudentData = {
        school_id: schoolId,
        first_name: UpperCaseWords(firstName),
        middle_name: middleName ? UpperCaseWords(middleName) : "N/A",
        last_name: UpperCaseWords(lastName),
        gender,
        suffix: studentSuff,
        birthdate: birthDate,
        contact_number: contactNumber ? contactNumber : "N/A",
        parent: {
          first_name: UpperCaseWords(parentFirstName),
          middle_name: parentMiddleName
            ? UpperCaseWords(parentMiddleName)
            : "N/A",
          last_name: UpperCaseWords(parentLastName),
          suffix: parentSuff,
          gender: parentGender,
          contact_number: parentContactNumber,
          relationship: UpperCaseWords(relationship),
        },
        address: {
          village: UpperCaseWords(village),
          street: UpperCaseWords(street),
          barangay,
          city,
        },
      };

      try {
        const response = await axiosClient.post("/student", newStudentData);
        if (response.status === 200) {
          // Recently added student should be added in semester as well
          const student = response.data;
          dispatch({ type: "ADD_STUDENT", payload: student });
          const res = await axiosClient.post(`/semester/${semesterId}`, {
            student_id: student._id,
          });

          if (res.status === 200) {
            Alert("Added student successfully");
            toggleModal(false);
          }
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    } else {
      setErrorFields(() => errors);
    }
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
      style={{ minHeight: "100vh" }}
    >
      <div className="modal w-full md:w-5/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header border-b px-4 py-3 mt-4">
          <p className="text-lg">
            {" "}
            <span className="inline-block me-2">
              <img src="/img/person-plus.svg" alt="" />
            </span>
            {title}
          </p>
        </header>

        <main className="px-4 h-96 overflow-y-auto">
          <form
            id="semester-form"
            onSubmit={handleFormSubmit}
            className="max-h-96 overflow-y-auto"
          >
            <p className="text-lg">Student Details</p>
            <div className="py-6 space-y-5">
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>School ID</label>
                  <input
                    type="text"
                    value={schoolId}
                    onChange={(e) => setSchoolid(e.target.value)}
                    className={
                      !errorFields.includes("schoolId")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("schoolId") && (
                    <ValidationMessage message="School ID is required." />
                  )}
                </div>
                <div className="w-full relative">
                  <label>First Name</label>
                  <input
                    name="first_name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={
                      !errorFields.includes("firstName")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("firstName") && (
                    <ValidationMessage message="First Name is required." />
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>Middle Name (Optional)</label>
                  <input
                    name="middle_name"
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className={INPUT_DEFAULT_STYLE}
                  />
                </div>
                <div className="w-full relative">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={
                      !errorFields.includes("lastName")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("lastName") && (
                    <ValidationMessage message="Last Name is required." />
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <div className="flex justify-between">
                    <label>Suffix (Optional)</label>
                    <input
                      onChange={() =>
                        setShowStudentSuffix(() => !showStudentSuffix)
                      }
                      type="checkbox"
                      className={CHECKBOX_DEFAULT_STYLE}
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
                </div>
                <div className="w-full relative">
                  <label>Gender</label>
                  <select
                    onChange={(e) => setGender(() => e.target.value)}
                    value={gender}
                    className={INPUT_DEFAULT_STYLE}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>Birthdate</label>
                  <input
                    onChange={(e) => setBirthDate(e.target.value)}
                    value={birthDate}
                    type="date"
                    className={
                      !errorFields.includes("birthDate")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("birthDate") && (
                    <ValidationMessage message="Birthdate is required." />
                  )}
                </div>
                <div className="w-full relative">
                  <label>Contact Number (Optional)</label>
                  <input
                    onKeyDown={numbersOnly}
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className={INPUT_DEFAULT_STYLE}
                    maxLength={11}
                  />
                </div>
              </div>
              <hr />
              <p className="text-lg">Parent Details</p>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>First Name</label>
                  <input
                    name="first_name"
                    type="text"
                    value={parentFirstName}
                    onChange={(e) => setParentFirstname(e.target.value)}
                    className={
                      !errorFields.includes("parentFirstName")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("parentFirstName") && (
                    <ValidationMessage message="First Name is required." />
                  )}
                </div>
                <div className="w-full relative">
                  <label>Middle Name (Optional)</label>
                  <input
                    name="middle_name"
                    type="text"
                    value={parentMiddleName}
                    onChange={(e) => setParentMiddleName(e.target.value)}
                    className={INPUT_DEFAULT_STYLE}
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    type="text"
                    value={parentLastName}
                    onChange={(e) => setParentLastName(e.target.value)}
                    className={
                      !errorFields.includes("parentLastName")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("parentLastName") && (
                    <ValidationMessage message="Last Name is required." />
                  )}
                </div>
                <div className="w-full relative">
                  <div className="flex justify-between">
                    <label>Suffix (Optional)</label>
                    <input
                      onChange={() =>
                        setShowParentSuffix(() => !showParentSuffix)
                      }
                      type="checkbox"
                      className={CHECKBOX_DEFAULT_STYLE}
                    />
                  </div>
                  <select
                    onChange={(e) => setParentSuffix(e.target.value)}
                    defaultValue={"Select"}
                    className={INPUT_DEFAULT_STYLE}
                    disabled={showParentSuffix}
                  >
                    <option value="Select" disabled>
                      Select
                    </option>
                    <option value="Jr">Jr</option>
                    <option value="Sr">Sr</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>Gender</label>
                  <select
                    onChange={(e) => setParentGender(() => e.target.value)}
                    value={parentGender}
                    className={INPUT_DEFAULT_STYLE}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="w-full relative">
                  <label>Contact Number</label>
                  <input
                    onKeyDown={numbersOnly}
                    onChange={(e) => setParentContactNumber(e.target.value)}
                    value={parentContactNumber}
                    className={
                      !errorFields.includes("parentContactNumber")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                    maxLength={11}
                  />
                  {errorFields.includes("parentContactNumber") && (
                    <ValidationMessage message={contactNumberErrorMessage} />
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>Relationship</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className={
                      !errorFields.includes("relationship")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("relationship") && (
                    <ValidationMessage message="Relationship is required." />
                  )}
                </div>
                <div className="w-full relative"></div>
              </div>
              <hr />
              <p className="text-lg">Address Details</p>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className={
                      !errorFields.includes("village")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("village") && (
                    <ValidationMessage message="Village is required." />
                  )}
                </div>
                <div className="w-full relative">
                  <label>Street</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={
                      !errorFields.includes("street")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("street") && (
                    <ValidationMessage message="Street is required." />
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>Barangay</label>
                  <select
                    onChange={(e) => setBarangay(() => e.target.value)}
                    value={barangay}
                    className={INPUT_DEFAULT_STYLE}
                  >
                    {barangayList.length > 0 &&
                      barangayList.map((barangay) => (
                        <option key={barangay._id} value={barangay.name}>
                          {barangay.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-full relative">
                  <label>City/Municipality</label>
                  <input
                    type="text"
                    value={city}
                    className={INPUT_DEFAULT_STYLE}
                    disabled
                  />
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
            className="px-3 py-2 bg-green-500 hover:bg-green-400 text-white text-sm"
            type="submit"
            form="semester-form"
          >
            Create Student
          </button>
        </footer>
      </div>
      {showErrorModal && (
        <ErrorModal
          toggleModal={handleCancel}
          title={"Something went wrong!"}
        />
      )}

      {errorModalMessage && <ErrorModal title={errorModalMessage} />}
    </div>
  );
};

export default CreateStudentModal;
