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

export default function Students() {
  const location = useLocation();
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const { semesters, dispatch } = useContext(SemesterContext);
  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(null);
  const [selectedSemesterId, setSelecteSemesterId] = useState(null);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);

  const [showStudentSemesterId, setShowSudentSemesterId] = useState("");

  const handleShowSemesterModal = (value) => setShowSemesterModal(() => value);

  useEffect(() => {
    const getAllSemester = async () => {
      try {
        const response = await axiosClient.get("/semester");
        if (response.status === 200) {
          dispatch({ type: "SET_SEMESTERS", payload: response.data });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllSemester();
  }, []);

  useEffect(() => {
    const getSemesterStudents = async () => {
      if (showStudentSemesterId) {
        try {
          const response = await axiosClient.get(
            `/student/semester/${showStudentSemesterId}`
          );
          if (response.status === 200) {
            console.log(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    getSemesterStudents();
  }, [showStudentSemesterId]);

  const handleEditSemester = async (semesterId) => {
    setSelecteSemesterId(() => semesterId);
    setShowEditSemesterModal(true);
  };

  const toggleEditSemesterModal = (value) => setShowEditSemesterModal(value);

  return (
    <div className="w-full">
      <div className="flex">
        <Sidebar menu={location.pathname} />
        <div className="p-12 w-10/12 space-y-6">
          <div className="flex">
            {/* CREATE SEMESTER BUTTON */}
            {!showStudentList && (
              <div className="flex justify-end w-full">
                <button
                  onClick={() => setShowSemesterModal(true)}
                  className="px-2 py-2 text-sm rounded-md text-gray-700 bg-green-400"
                >
                  Create Semester
                </button>
              </div>
            )}
            {showStudentList && (
              <div className="flex space-x-3">
                <img
                  onClick={() => setShowStudentList(false)}
                  className="cursor-pointer p-2 rounded-md hover:bg-gray-200"
                  src="/img/arrow-back.svg"
                  alt=""
                />
                <Header title="Students" />
              </div>
            )}
          </div>
          {/* SEMESTER LISTS */}
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
          {/* STUDENTS LIST */}
          {showStudentList && <StudentListTable />}
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
        </div>
      </div>
    </div>
  );
}
