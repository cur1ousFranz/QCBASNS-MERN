import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import Header from "../components/header-text/Header";
import { SemesterContext } from "../context/SemesterContext";
import { ATTENDANCE_TABLES } from "../constants/Constant";
import SemesterListTable from "../components/attendance/semesters-list/SemesterListTable";
import axiosClient from "../utils/AxiosClient";
import {
  ATTENDANCE_CONTEXT_TYPES,
  AttendanceContext,
} from "../context/AttendanceContext";
import ErrorModal from "../components/modals/ErrorModal";
import AttendanceListTable from "../components/attendance/attendance-list/AttendanceListTable";
import ConfirmModal from "../components/modals/ConfirmModal";
import { Alert } from "../utils/Alert";
import StudentListTable from "../components/attendance/student-list/StudentListTable";
import { QrScanner } from "@yudiel/react-qr-scanner";
import QrCodeScannerModal from "../components/attendance/student-list/QrCodeScannerModal";

// TODO:: ADD STUDENT IF EXISTING IN DATABSE
export default function Attendance() {
  const location = useLocation();
  const { semesters } = useContext(SemesterContext);
  const { attendances, dispatch } = useContext(AttendanceContext);
  // const [showSemesterListTable, setShowSemesterListTable] = useState(false); // Toggle this for semester list table
  // const [showAttendanceListTable, setShowAttendanceListTable] = useState(false); // Toggle this for attendance list table
  // const [showStudentsAttendanceListTable, setShowStudentsAttendanceListTable] =
  useState(false); // Toggle this for students attendance list table
  const [showCreateAttendanceModal, setShowCreateAttendanceModal] =
    useState(false);
  const [currentShowedTable, setCurrentShowedTable] = useState(
    ATTENDANCE_TABLES.ATTENDANCE
  );
  const [currentSelectedSemester, setCurrentSelectedSemester] = useState(null);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    // Get the attendance of latest semester (active)
    const getAllSemesterAttendances = async () => {
      if (semesters.length > 0) {
        const activeSemester = semesters.filter(
          (sem) => sem.active === true
        )[0];
        setCurrentSelectedSemester(() => activeSemester);
        try {
          const response = await axiosClient.get(
            `/attendance/semester/${activeSemester._id}`
          );
          if (response.status === 200) {
            dispatch({
              type: ATTENDANCE_CONTEXT_TYPES.SET_SEMESTER_ATTENDANCES,
              payload: response.data,
            });
          }
        } catch (error) {
          setErrorModalMessage(error.message);
        }
      }
    };

    getAllSemesterAttendances();
  }, []);

  const handleCreateAttendance = async () => {
    let latestAttendance;
    if (attendances.length) {
      latestAttendance = attendances[0];
    }
    try {
      const newAttendance = {
        semester_id: currentSelectedSemester._id,
        students: {},
      };
      const response = await axiosClient.post("/attendance", newAttendance);
      if (response.status === 200) {
        dispatch({
          type: ATTENDANCE_CONTEXT_TYPES.ADD_SEMESTER_ATTENDANCE,
          payload: response.data,
        });
        Alert("Attendance successfully");

        // Update lastest attendance to inactive
        if (latestAttendance) {
          const res = await axiosClient.put(
            `/attendance/${latestAttendance._id}`,
            {
              status: false,
            }
          );

          if (res.status === 200) {
            dispatch({
              type: ATTENDANCE_CONTEXT_TYPES.UPDATE_SEMESTER_ATTENDANCE,
              payload: res.data,
            });
          }
        }
      }
    } catch (error) {
      setErrorModalMessage(error.message);
    }
  };

  const toggleCreateAttendanceModal = (value) =>
    setShowCreateAttendanceModal(value);

  const handleSelectAttendance = async (table, attendance) => {
    setCurrentShowedTable(() => table);
    setSelectedAttendance(() => attendance);
  };

  const handleQrScanned = (student) => {
    console.log(student);
  };

  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar menu={location.pathname} />
        </div>
        <div className="py-12 px-6 lg:px-12 w-full space-y-3">
          <div className="flex justify-between">
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex space-x-2">
                {currentShowedTable === ATTENDANCE_TABLES.STUDENT && (
                  <img
                    onClick={() => {
                      setCurrentShowedTable(() => ATTENDANCE_TABLES.ATTENDANCE);
                      setShowScanner(false);
                    }}
                    className="cursor-pointer p-2 rounded-md hover:bg-gray-200"
                    src="/img/arrow-back.svg"
                    alt=""
                  />
                )}

                <Header title={`Attendance`} />
              </div>
              {currentSelectedSemester && (
                <div className="hidden md:flex flex-col md:flex-row md:space-x-1">
                  <p className="mt-2">
                    <span className="p-1 font-semibold text-xs rounded-md text-white bg-green-500">
                      {currentSelectedSemester.semester}
                      {currentSelectedSemester.semester === "1"
                        ? "st Semester"
                        : "nd Semester"}
                    </span>
                  </p>

                  <p className="mt-2">
                    <span className="p-1 font-semibold text-xs rounded-md text-white bg-yellow-500">
                      {currentSelectedSemester.track}
                    </span>
                  </p>
                  {currentSelectedSemester.strand !== "N/A" && (
                    <p className="mt-2">
                      <span className="p-1 font-semibold text-xs rounded-md text-white bg-orange-500">
                        {currentSelectedSemester.strand}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
            {currentShowedTable === ATTENDANCE_TABLES.ATTENDANCE && (
              <button
                onClick={() => toggleCreateAttendanceModal(true)}
                className="px-2 uppercase flex w-fit py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
              >
                <span className="me-1 mt-0.5">
                  <img src="/img/plus.svg" alt="" />
                </span>
                ATTENDANCE
              </button>
            )}
          </div>

          {currentShowedTable === ATTENDANCE_TABLES.SEMESTER && (
            <div className="w-full">
              <div className="overflow-x-auto">
                <SemesterListTable semesters={semesters} />
              </div>
            </div>
          )}

          {currentShowedTable === ATTENDANCE_TABLES.STUDENT && (
            <div className="w-full">
              <div className="overflow-x-auto">
                <StudentListTable attendance={selectedAttendance} />
              </div>
            </div>
          )}

          {currentShowedTable === ATTENDANCE_TABLES.ATTENDANCE && (
            <div className="w-full">
              <div className="overflow-x-auto">
                <AttendanceListTable
                  attendances={attendances}
                  toggleTable={handleSelectAttendance}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {errorModalMessage && <ErrorModal title={errorModalMessage} />}

      {showCreateAttendanceModal && (
        <ConfirmModal
          title={"Create New Attendance"}
          body={
            "By proceeding to create new attendance, previous attendance will be set to inactive."
          }
          toggleModal={toggleCreateAttendanceModal}
          submit={handleCreateAttendance}
        />
      )}

      {currentShowedTable === ATTENDANCE_TABLES.STUDENT && !showScanner && (
        <div
          onClick={() => setShowScanner(true)}
          className="fixed bottom-8 right-6"
        >
          <div className="p-4 rounded-lg shadow-lg cursor-pointer bg-green-400 text-white  hover:bg-green-300">
            <img src="/img/qrcode-scan.svg" alt="" />
          </div>
        </div>
      )}

      {currentShowedTable === ATTENDANCE_TABLES.STUDENT && showScanner && (
        <QrCodeScannerModal
          toggleModal={setShowScanner}
          handleQrScanned={handleQrScanned}
        />
      )}
    </div>
  );
}
