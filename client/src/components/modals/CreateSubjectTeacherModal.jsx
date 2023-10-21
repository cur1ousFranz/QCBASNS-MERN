import { useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import { Alert } from "../../utils/Alert";
import ValidationMessage from "../typography//ValidationMessage";
import {
  INPUT_DEFAULT_STYLE,
  INPUT_ERROR_STYLE,
} from "../../constants/Constant";

const CreateSubjectTeacherModal = ({
  toggleModal,
  getAdviserSubjectTeacher,
}) => {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");

  const [subjectError, setSubjectError] = useState("");
  const [emailError, setEmailError] = useState("");
  //   const [passwordError, setPasswordError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubjectError("");
    setEmailError("");
    // setPasswordError("");
    let hasErrors = false;
    if (!subject) {
      setSubjectError("Subject is required.");
      hasErrors = true;
    }
    if (!email) {
      setEmailError("Email is required.");
      hasErrors = true;
    }
    // if (!password) {
    //   setPasswordError("Password is required.");
    //   hasErrors = true;
    // }

    if (!hasErrors) {
      const newSubjectTeacher = { subject, email, password: "123456" };
      try {
        const response = await axiosClient.post(
          "/subject/teacher",
          newSubjectTeacher
        );
        if (response.status === 200) {
          Alert("Created Successfully");
          toggleModal(false);
          getAdviserSubjectTeacher();
        }
      } catch (error) {
        if (error.response) {
          if (error.response.data.errorFields.includes("email")) {
            setEmailError(() => error.response.data.error[0]);
          }
        }
      }
    }
  };

  const handleCancel = (value) => {
    toggleModal(value);
  };

  //   const generatePassword = () => {
  //     const characters =
  //       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //     let result = "";
  //     for (let i = 0; i < 10; i++) {
  //       const randomIndex = Math.floor(Math.random() * characters.length);
  //       result += characters[randomIndex];
  //     }
  //     setPassword(() => result);
  //   };

  return (
    <div className="fixed inset-0 flex items-center justify-center modal-backdrop bg-opacity-50 bg-gray-50">
      <div className="modal w-full my-auto md:w-8/12 lg:w-6/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header mt-4 py-3">
          <p className="text-lg">
            <span className="inline-block me-1">
              <img src="/img/plus.svg" alt="" />
            </span>
            New Subject Teacher
          </p>
        </header>

        <main className="px-4 h-84 overflow-y-auto">
          <form id="semester-form" onSubmit={handleFormSubmit}>
            <div className="py-6 space-y-5">
              <div className="relative space-y-6">
                <div className="flex space-x-3">
                  <div className="w-full">
                    <label>Subject</label>
                    <input
                      onChange={(e) => setSubject(e.target.value)}
                      value={subject}
                      type="text"
                      className={
                        !subjectError ? INPUT_DEFAULT_STYLE : INPUT_ERROR_STYLE
                      }
                    />
                    {subjectError && (
                      <ValidationMessage message={subjectError} />
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-full">
                    <label>Email</label>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      type="text"
                      className={
                        !emailError ? INPUT_DEFAULT_STYLE : INPUT_ERROR_STYLE
                      }
                    />
                    {emailError && <ValidationMessage message={emailError} />}
                  </div>
                </div>
                {/* <div className="flex space-x-3">
                  <div className="w-full">
                    <label>Password</label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type="text"
                      className={
                        !passwordError ? INPUT_DEFAULT_STYLE : INPUT_ERROR_STYLE
                      }
                    />
                    {passwordError && (
                      <ValidationMessage message={passwordError} />
                    )}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={generatePassword}
                        type="button"
                        className="p-1 text-xs border uppercase rounded-md border-gray-500 hover:bg-gray-100"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </form>
        </main>

        <footer className="modal-footer p-4 flex justify-end space-x-3">
          <button
            onClick={() => handleCancel(false)}
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
            Create
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CreateSubjectTeacherModal;
