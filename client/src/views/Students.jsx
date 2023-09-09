import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import Header from "../components/header-text/Header";
import CreateSemesterModal from "../components/modals/CreateSemesterModal";
import axiosClient from "../utils/AxiosClient";
import { SemesterContext } from "../context/SemesterContext";
import EditSemesterModal from "../components/modals/EditSemesterModal";
import StudentListTable from "../components/students/StudentListTable";
import SemesterListTable from "../components/semester/SemesterListTable";
import CreateStudentModal from "../components/students/CreateStudentModal";
import { StudentContext } from "../context/StudentContext";
import EditStudentModal from "../components/students/EditStudentModal";
import StudentParentDetailsModal from "../components/modals/StudentParentDetailsModal";
import ErrorModal from "../components/modals/ErrorModal";
import StudentListModal from "../components/students/StudentListModal";
import { Alert } from "../utils/Alert";

export default function Students() {
  const location = useLocation();
  const { semesters, dispatch } = useContext(SemesterContext);
  const studentContext = useContext(StudentContext);

  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(null);
  const [selectedSemesterId, setSelecteSemesterId] = useState(null);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);

  // Used to fetch all students from specific semester
  const [showStudentSemesterId, setShowSudentSemesterId] = useState("");

  const handleShowSemesterModal = (value) => setShowSemesterModal(() => value);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [selectedStudentIdEdit, setSelectedStudentIdEdit] = useState("");
  const [selectedStudentIdDetails, setSelecedStudentIdDetails] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const getAllSemester = async () => {
    try {
      const response = await axiosClient.get("/semester");
      if (response.status === 200) {
        dispatch({ type: "SET_SEMESTERS", payload: response.data });
      }
    } catch (error) {
      setErrorModalMessage(error.message);
    }
  };

  useEffect(() => {
    getAllSemester();
  }, []);

  useEffect(() => {
    const getSemesterStudents = async () => {
      if (showStudentSemesterId) {
        try {
          const response = await axiosClient.get(
            `/semester/${showStudentSemesterId}/student`
          );
          if (response.status === 200) {
            studentContext.dispatch({
              type: "SET_SEMESTER_STUDENTS",
              payload: response.data,
            });
          }

          const res = await axiosClient.get(
            `/semester/${showStudentSemesterId}`
          );
          if (res.status === 200) {
            setCurrentSemester(() => res.data);
          }
        } catch (error) {
          setErrorModalMessage(error.message);
        }
      }
    };

    getSemesterStudents();
  }, [showStudentSemesterId]);

  const handleEditSemester = async (semesterId) => {
    setSelecteSemesterId(() => semesterId);
    setShowEditSemesterModal(true);
  };

  const handleAddExistingStudents = async (studentsId) => {
    if (studentsId) {
      try {
        const response = await axiosClient.put(
          `/semester/${showStudentSemesterId}/existing`,
          { students: studentsId }
        );
        if (response.status === 200) {
          studentContext.dispatch({
            type: "SET_SEMESTER_STUDENTS",
            payload: response.data,
          });
          toggleStudentListModal(false);
          Alert("Added students successfully");
          getAllSemester();
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    }
  };

  const toggleEditSemesterModal = (value) => setShowEditSemesterModal(value);
  const toggleCreateStudentModal = (value) => setShowCreateStudentModal(value);
  const toggleEditStudentModal = (value) => setShowEditStudentModal(value);
  const toggleStudentParentDetailsModal = (value) =>
    setShowStudentDetailsModal(value);
  const toggleStudentListModal = (value) => setShowStudentListModal(value);

  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar menu={location.pathname} />
        </div>
        <div className="py-12 px-6 lg:px-12 w-full space-y-3">
          <div className="flex flex-row md:flex-col">
            {/* CREATE SEMESTER BUTTON */}
            {!showStudentList && (
              <div className="flex justify-between w-full">
                <Header title="Semesters" />
                <button
                  onClick={() => setShowSemesterModal(true)}
                  className="px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
                >
                  {" "}
                  <span className="me-1">
                    <img src="/img/plus.svg" alt="" />
                  </span>
                  Create Semester
                </button>
              </div>
            )}
            {showStudentList && (
              <div className="flex flex-col md:flex-row justify-between w-full">
                <div className="flex space-x-4">
                  <img
                    onClick={() => setShowStudentList(false)}
                    className="cursor-pointer p-2 rounded-md hover:bg-gray-200"
                    src="/img/arrow-back.svg"
                    alt=""
                  />
                  <Header title="Students" />
                  {currentSemester && currentSemester.active ? (
                    <p className="mt-2">
                      <span className="p-1 font-semibold text-xs rounded-md text-white bg-green-500">
                        Active
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2">
                      <span className="p-1 font-semibold text-xs rounded-md text-white bg-red-400">
                        Inactive
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowStudentListModal(true)}
                    className="px-2 uppercase flex py-2 text-xs rounded-md text-white bg-blue-400 hover:bg-blue-300"
                  >
                    {" "}
                    <span className="me-2">
                      <img src="/img/person-check.svg" alt="" />
                    </span>
                    Existing
                  </button>
                  {currentSemester && currentSemester.active && (
                    <button
                      onClick={() => setShowCreateStudentModal(true)}
                      className="px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
                    >
                      {" "}
                      <span className="me-2">
                        <img src="/img/person-plus.svg" alt="" />
                      </span>
                      New
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* SEMESTER LISTS */}
          <div className="w-full">
            <div className="overflow-x-auto">
              {!showStudentList && (
                <SemesterListTable
                  semesters={semesters}
                  setShowStudentList={setShowStudentList}
                  setShowOptionMenu={setShowOptionMenu}
                  setSeletedOptionIndex={setSeletedOptionIndex}
                  showOptionMenu={showOptionMenu}
                  selectedOptionIndex={selectedOptionIndex}
                  handleEditSemester={handleEditSemester}
                  setShowSudentSemesterId={setShowSudentSemesterId}
                />
              )}
            </div>
          </div>
          <div className="w-full">
            {/* STUDENTS LIST */}
            {showStudentList && (
              <StudentListTable
                toggleEditStudentModal={toggleEditStudentModal}
                students={studentContext.students}
                setSelectedStudentIdEdit={setSelectedStudentIdEdit}
                setSelecedStudentIdDetails={setSelecedStudentIdDetails}
                setShowStudentDetailsModal={setShowStudentDetailsModal}
              />
            )}
          </div>

          {showSemesterModal && (
            <div className="mx-auto">
              <CreateSemesterModal toggleModal={handleShowSemesterModal} />
            </div>
          )}

          {showEditSemesterModal && (
            <div className="mx-auto">
              <EditSemesterModal
                toggleModal={toggleEditSemesterModal}
                semesterId={selectedSemesterId}
              />
            </div>
          )}

          {showCreateStudentModal && (
            <CreateStudentModal
              toggleModal={toggleCreateStudentModal}
              semesterId={showStudentSemesterId}
              title={"Create Student"}
            />
          )}

          {showEditStudentModal && (
            <EditStudentModal
              toggleModal={toggleEditStudentModal}
              title={"Edit Student"}
              studentId={selectedStudentIdEdit}
            />
          )}

          {showStudentDetailsModal && (
            <StudentParentDetailsModal
              toggleModal={toggleStudentParentDetailsModal}
              studentId={selectedStudentIdDetails}
            />
          )}

          {errorModalMessage && <ErrorModal title={errorModalMessage} />}

          {showStudentListModal && (
            <StudentListModal
              toggleModal={toggleStudentListModal}
              addExisitingStudents={handleAddExistingStudents}
              currentSemesterId={showStudentSemesterId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
