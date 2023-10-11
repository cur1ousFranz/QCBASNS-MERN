import { useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import numbersOnly from "../../utils/NumberKeys";
import { Alert } from "../../utils/Alert";
import ValidationMessage from "../typography/ValidationMessage";
import {
  CHECKBOX_DEFAULT_STYLE,
  INPUT_DEFAULT_STYLE,
  INPUT_ERROR_STYLE,
} from "../../constants/Constant";
import ErrorModal from "./ErrorModal";
import UpperCaseWords from "../../utils/UpperCaseWords";
import calculateAge from "../../utils/CalculateAge";

const EditStudentModal = ({
  toggleModal,
  studentId,
  title,
  getSemesterStudents,
}) => {
  const [barangayList, setBarangayList] = useState([]);

  const [showStudentSuffix, setShowStudentSuffix] = useState(false);
  const [showParentSuffix, setShowParentSuffix] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  //Error fields
  const [errorFields, setErrorFields] = useState([]);
  const [
    studentContactNumberErrorMessage,
    setStudentContactNumberErrorMessage,
  ] = useState("");
  const [parentContactNumberErrorMessage, setParentContactNumberErrorMessage] =
    useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [studentIdErrorMessage, setStudentIdErrorMessage] = useState(
    "School ID is required."
  );
  const [birthDatteErrorMessage, setBirthDateErrorMessage] = useState("");

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

  const formatContactNumber = (number) => {
    const contactArray = number.split("");
    return contactArray.slice(3).join("");
  };

  // Get the current details of student for default value
  useEffect(() => {
    const getStudentDetails = async () => {
      try {
        const response = await axiosClient.get(`/student/${studentId}`);
        if (response.status === 200) {
          const student = response.data;
          setSchoolid(() => student.school_id);
          setFirstName(() => student.first_name);
          setMiddleName(() =>
            student.middle_name !== "N/A" ? student.middle_name : ""
          );
          setLastName(() => student.last_name);
          if (student.suffix !== "N/A") {
            setSuffix(() => student.suffix);
            setShowStudentSuffix(true);
          }
          setGender(() => student.gender);
          setBirthDate(() => student.birthdate);
          setContactNumber(() =>
            student.contact_number !== "N/A"
              ? formatContactNumber(student.contact_number)
              : ""
          );
          setVillage(() => student.address.village);
          setStreet(() =>
            student.address.street !== "N/A" ? student.address.street : ""
          );
          setBarangay(() => student.address.barangay);
          setCity(() => student.address.city);
          setParentFirstname(() => student.parent.first_name);
          setParentMiddleName(() =>
            student.parent.middle_name !== "N/A"
              ? student.parent.middle_name
              : ""
          );
          setParentLastName(() => student.parent.last_name);
          if (student.parent.suffix !== "N/A") {
            setParentSuffix(() => student.parent.suffix);
            setShowParentSuffix(true);
          }
          setParentGender(() => student.parent.gender);
          setParentContactNumber(() =>
            formatContactNumber(student.parent.contact_number)
          );
          setRelationship(() => student.parent.relationship);
        }
      } catch (error) {}
    };
    getStudentDetails();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    setErrorFields(() => errors);
    setParentContactNumberErrorMessage("");
    setStudentIdErrorMessage("LRN is required.");
    setBirthDateErrorMessage("");

    // Student details
    if (!schoolId) errors.push("schoolId");
    if (schoolId && schoolId.length < 12) {
      errors.push("schoolId");
      setStudentIdErrorMessage("LRN must be 12 numbers");
    }
    if (!firstName) errors.push("firstName");
    if (!lastName) errors.push("lastName");
    // Validate contact number of student if not empty
    if (contactNumber) {
      if (contactNumber.length < 11) {
        setStudentContactNumberErrorMessage(
          "Contact number must be 11 digits."
        );
        errors.push("studentContactNumber");
      }
      // Check if contact number starts with 09
      if (contactNumber.length === 11) {
        const numberArr = contactNumber.split("");
        const firstTwoDigit = [numberArr[0], numberArr[1]];
        if (firstTwoDigit.join("") !== "09") {
          setStudentContactNumberErrorMessage("Invalid contact number.");
          errors.push("studentContactNumber");
        }
      }
    }
    if (!birthDate) {
      errors.push("birthDate");
      setBirthDateErrorMessage(() => "Birthdate is required.");
    }
    if (birthDate) {
      const age = calculateAge(birthDate);
      if (age <= 14) {
        setBirthDateErrorMessage(() => "Age must be 15 years old and above.");
        errors.push("birthDate");
      }
    }
    if (!village) errors.push("village");
    // Parent details
    if (!parentFirstName) errors.push("parentFirstName");
    if (!parentLastName) errors.push("parentLastName");
    if (!parentGender) errors.push("parentGender");
    if (parentContactNumber.length < 11) {
      setParentContactNumberErrorMessage("Contact number must be 11 digits.");
      errors.push("parentContactNumber");
    }
    if (!parentContactNumber) {
      setParentContactNumberErrorMessage(() => "Contact number is required.");
      errors.push("parentContactNumber");
    }
    // Check if contact number starts with 09
    if (parentContactNumber.length === 11) {
      const numberArr = parentContactNumber.split("");
      const firstTwoDigit = [numberArr[0], numberArr[1]];
      if (firstTwoDigit.join("") !== "09") {
        setParentContactNumberErrorMessage("Invalid contact number.");
        errors.push("parentContactNumber");
      }
    }
    if (!relationship) errors.push("relationship");
    if (errors.length === 0) {
      const studentSuff = showStudentSuffix ? suffix : "N/A";
      const parentSuff = showParentSuffix ? parentSuffix : "N/A";

      const updatedtudentData = {
        school_id: schoolId,
        first_name: UpperCaseWords(firstName),
        middle_name: middleName ? UpperCaseWords(middleName) : "N/A",
        last_name: UpperCaseWords(lastName),
        gender,
        suffix: studentSuff,
        birthdate: birthDate,
        contact_number: contactNumber ? `+63${contactNumber}` : "N/A",
        parent: {
          first_name: UpperCaseWords(parentFirstName),
          middle_name: parentMiddleName
            ? UpperCaseWords(parentMiddleName)
            : "N/A",
          last_name: UpperCaseWords(parentLastName),
          suffix: parentSuff,
          gender: parentGender,
          contact_number: `+63${parentContactNumber}`,
          relationship: UpperCaseWords(relationship),
        },
        address: {
          village: UpperCaseWords(village),
          street: street ? UpperCaseWords(street) : "N/A",
          barangay,
          city,
        },
      };

      try {
        const response = await axiosClient.put(
          `/student/${studentId}`,
          updatedtudentData
        );
        if (response.status === 200) {
          getSemesterStudents();
          Alert("Updated student successfully");
          toggleModal(false);
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

  const onChangeBirthDate = (value) => {
    setBirthDate(() => value);
    const age = calculateAge(value);
    const errors = [];
    if (age <= 14) {
      setBirthDateErrorMessage(() => "Age must be 15 years old and above.");
      errors.push("birthDate");
      setErrorFields(() => errors);
    } else {
      setBirthDateErrorMessage("");
      setErrorFields(() => []);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center px-4 justify-center modal-backdrop bg-opacity-50 bg-gray-50"
      style={{ minHeight: "100vh" }}
    >
      <div className="modal w-full md:w-8/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header border-b px-4 py-3 mt-4">
          <p className="text-lg">
            {" "}
            <span className="inline-block me-2">
              <img src="/img/edit.svg" alt="" />
            </span>
            {title}
          </p>
        </header>

        <main className="px-4 h-96 overflow-y-auto">
          <form id="semester-form" onSubmit={handleFormSubmit}>
            <p className="text-lg">Student Details</p>
            <div className="py-6 space-y-5">
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>LRN</label>
                  <input
                    type="text"
                    value={schoolId}
                    onChange={(e) => setSchoolid(e.target.value)}
                    className={
                      !errorFields.includes("schoolId")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                    onKeyDown={numbersOnly}
                    maxLength={12}
                  />
                  {errorFields.includes("schoolId") && (
                    <ValidationMessage message={studentIdErrorMessage} />
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
                <div className="w-full relative">
                  <label>
                    Middle Name <span className="text-xs">(Optional)</span>
                  </label>
                  <input
                    name="middle_name"
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
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
                <div className="w-full relative">
                  <div className="flex justify-between">
                    <label>
                      Suffix <span className="text-xs">(Optional)</span>
                    </label>
                    <input
                      onChange={() => setShowStudentSuffix(!showStudentSuffix)}
                      type="checkbox"
                      className={CHECKBOX_DEFAULT_STYLE}
                      checked={showStudentSuffix}
                    />
                  </div>
                  <select
                    onChange={(e) => setSuffix(e.target.value)}
                    value={suffix}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                    disabled={!showStudentSuffix}
                  >
                    <option value="Jr">Jr</option>
                    <option value="Sr">Sr</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
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
                    onChange={(e) => onChangeBirthDate(e.target.value)}
                    value={birthDate}
                    type="date"
                    className={
                      !errorFields.includes("birthDate")
                        ? INPUT_DEFAULT_STYLE
                        : INPUT_ERROR_STYLE
                    }
                  />
                  {errorFields.includes("birthDate") && (
                    <ValidationMessage message={birthDatteErrorMessage} />
                  )}
                </div>
                <div className="w-full relative">
                  <label>
                    Contact Number <span className="text-xs">(Optional)</span>
                  </label>
                  <input
                    onKeyDown={numbersOnly}
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className={INPUT_DEFAULT_STYLE}
                    maxLength={11}
                  />
                  {errorFields.includes("studentContactNumber") && (
                    <ValidationMessage
                      message={studentContactNumberErrorMessage}
                    />
                  )}
                </div>
              </div>
              <hr />
              <p className="text-lg">Parent/Guardian Details</p>
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
                  <label>
                    Middle Name <span className="text-xs">(Optional)</span>
                  </label>
                  <input
                    name="middle_name"
                    type="text"
                    value={parentMiddleName}
                    onChange={(e) => setParentMiddleName(e.target.value)}
                    className={INPUT_DEFAULT_STYLE}
                  />
                </div>
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
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <div className="flex justify-between">
                    <label>
                      Suffix <span className="text-xs">(Optional)</span>
                    </label>
                    <input
                      onChange={() =>
                        setShowParentSuffix(() => !showParentSuffix)
                      }
                      type="checkbox"
                      className={CHECKBOX_DEFAULT_STYLE}
                      checked={showParentSuffix}
                    />
                  </div>
                  <select
                    onChange={(e) => setParentSuffix(e.target.value)}
                    value={parentSuffix}
                    className={INPUT_DEFAULT_STYLE}
                    disabled={!showParentSuffix}
                  >
                    <option value="Jr">Jr</option>
                    <option value="Sr">Sr</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                  </select>
                </div>
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
                    <ValidationMessage
                      message={parentContactNumberErrorMessage}
                    />
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
                  <label>
                    Street <span className="text-xs">(Optional)</span>
                  </label>
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
                <div className="w-full relative">
                  <label>Barangay</label>
                  <select
                    onChange={(e) => setBarangay(() => e.target.value)}
                    className={INPUT_DEFAULT_STYLE}
                    value={barangay}
                  >
                    {barangayList.length > 0 &&
                      barangayList.map((brgy) => (
                        <option key={brgy._id} value={brgy.name}>
                          {brgy.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full relative">
                  <label>City</label>
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
            className="px-2 uppercase flex py-2 text-sm rounded-md border border-gray-900 hover:bg-gray-100 text-gray-900"
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
            type="submit"
            form="semester-form"
          >
            Update Student
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

export default EditStudentModal;
