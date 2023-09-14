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
import QrCodeScannerModal from "../components/attendance/student-list/QrCodeScannerModal";
import ConvertDate from "../utils/ConvertDate";
import {
  ADVISER_CONTEXT_TYPES,
  AdviserContext,
} from "../context/AdviserContext";
import { SCAN_TIME } from "../constants/ScanTime";

// TODO:: SEND SMS AFTER SCANNING (SERVER)
export default function Attendance() {
  const location = useLocation();
  const { semesters, dispatch: semesterDispatch } = useContext(SemesterContext);
  const { attendances, dispatch } = useContext(AttendanceContext);
  useState(false);
  const [showCreateAttendanceModal, setShowCreateAttendanceModal] =
    useState(false);
  const [currentShowedTable, setCurrentShowedTable] = useState(
    ATTENDANCE_TABLES.ATTENDANCE
  );
  const [currentSelectedSemester, setCurrentSelectedSemester] = useState(null);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [lastScannedStudentId, setLastScannedStudentId] = useState("");
  const [showScannerError, setShowScannerError] = useState(false);
  const [showScannerSuccess, setShowScannerSuccess] = useState(false);
  const [showScannerDefault, setShowScannerDefault] = useState(true);
  const [showConfirmToggleTimeInModal, setShowConfirmToggleTimeInModal] =
    useState(false);
  const [studentTableDetailsList, setStudentTableDetailsList] = useState([]);
  const { dispatch: dispatchAdviser } = useContext(AdviserContext);
  const [scanTime, setScanTime] = useState("");
  const [totalAmScanned, setTotalAmScanned] = useState(0);
  const [totalPmScanned, setTotalPmScanned] = useState(0);

  useEffect(() => {
    const getAllSemester = async () => {
      try {
        const response = await axiosClient.get("/semester");
        if (response.status === 200) {
          semesterDispatch({ type: "SET_SEMESTERS", payload: response.data });
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    };

    getAllSemester();
  }, []);

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
  }, [semesters]);

  useEffect(() => {
    setTimeout(() => {
      setShowScannerError(false);
      setShowScannerSuccess(false);
      setShowScannerDefault(true);
    }, 3000);
  }, [showScannerError, showScannerSuccess, showScannerDefault]);

  useEffect(() => {
    const getAdviser = async () => {
      try {
        const response = await axiosClient.get("/adviser");
        if (response.status === 200) {
          dispatchAdviser({
            type: ADVISER_CONTEXT_TYPES.SET_ADVISER,
            payload: response.data,
          });
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    };
    getAdviser();
  }, []);

  const handleCreateAttendance = async () => {
    let latestAttendance;
    if (attendances.length) {
      latestAttendance = attendances[0];
    }

    if (currentSelectedSemester) {
      try {
        const newAttendance = {
          semester_id: currentSelectedSemester._id,
        };
        const response = await axiosClient.post("/attendance", newAttendance);
        if (response.status === 200) {
          dispatch({
            type: ATTENDANCE_CONTEXT_TYPES.ADD_SEMESTER_ATTENDANCE,
            payload: response.data,
          });
          Alert("Created successfully");

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
    } else {
      Alert("You don't have active semester yet.", "error");
    }
  };

  useEffect(() => {
    if (currentSelectedSemester) {
      const school_year = `S.Y ${currentSelectedSemester.start_year}-${currentSelectedSemester.end_year}`;
      const semester =
        currentSelectedSemester.semester === "1"
          ? "1st Semester"
          : "2nd Semester";
      const track = currentSelectedSemester.track;
      const strand =
        currentSelectedSemester.strand !== "N/A"
          ? currentSelectedSemester.strand
          : "";
      const section = currentSelectedSemester.section;
      const tableDetails = [school_year, semester, section, track];
      if (strand) tableDetails.push(strand);
      setStudentTableDetailsList(() => tableDetails);
    }
  }, [currentSelectedSemester, selectedAttendance]);

  // Count total AM scanned students
  useEffect(() => {
    if (selectedAttendance) {
      let amCount = 0;
      let pmCount = 0;
      selectedAttendance.students.forEach((student) => {
        if (student.time_in_am) {
          amCount++;
        }
        if (student.time_in_pm) {
          pmCount++;
        }
      });

      setTotalAmScanned(() => amCount);
      setTotalPmScanned(() => pmCount);
    }
  }, [selectedAttendance]);

  const toggleCreateAttendanceModal = (value) =>
    setShowCreateAttendanceModal(value);
  const toggleConfirmTimeInModal = (value) =>
    setShowConfirmToggleTimeInModal(value);

  const handleSelectAttendance = async (table, attendance) => {
    setSelectedAttendance(() => attendance);
    setCurrentShowedTable(() => table);
  };

  const handleQrScanned = async (student) => {
    // Validate qr code is valid
    let isQrValid = true;
    if (!student._id) {
      Alert("Invalid Qr Code", "error");
      isQrValid = false;
    }

    if (isQrValid) {
      setLastScannedStudentId(() => student._id);
      // Avoid call request when qr used was previously scanned
      if (student._id !== lastScannedStudentId) {
        const studentDetails = {
          semester_id: currentSelectedSemester._id,
        };
        try {
          const response = await axiosClient.put(
            `/attendance/${selectedAttendance._id}/student/${student._id}`,
            studentDetails
          );

          if (response.status === 200) {
            Alert(
              `${
                selectedAttendance.is_timein_am ||
                selectedAttendance.is_timein_pm
                  ? "Time In Success!"
                  : "Time Out Success!"
              }`
            );
            setSelectedAttendance(() => response.data);
            dispatch({
              type: ATTENDANCE_CONTEXT_TYPES.UPDATE_SEMESTER_ATTENDANCE,
              payload: response.data,
            });

            setShowScannerSuccess(true);
            setShowScannerDefault(false);
          }
        } catch (error) {
          setShowScannerError(true);
          setShowScannerDefault(false);
          if (error.response.data.error === "student") {
            Alert(error.response.data.message, "error");
          }
          if (error.response.data.error === "time_in_am") {
            Alert(error.response.data.message, "error");
          }
          if (error.response.data.error === "time_out_am") {
            Alert(error.response.data.message, "error");
          }
          if (error.response.data.error === "time_in_pm") {
            Alert(error.response.data.message, "error");
          }
          if (error.response.data.error === "time_out_pm") {
            Alert(error.response.data.message, "error");
          }
        }
      } else {
        setShowScannerError(true);
        setShowScannerDefault(false);
      }
    }
  };

  const changeNewScanTime = (timein_am, timeout_am, timein_pm, timeout_pm) => {
    return {
      is_timein_am: timein_am,
      is_timeout_am: timeout_am,
      is_timein_pm: timein_pm,
      is_timeout_pm: timeout_pm,
    };
  };

  const handleToggleScanAttendance = async () => {
    let newScanTime;
    // eslint-disable-next-line default-case
    switch (scanTime) {
      case SCAN_TIME.TIME_IN_AM:
        newScanTime = changeNewScanTime(true, false, false, false);
        break;
      case SCAN_TIME.TIME_OUT_AM:
        newScanTime = changeNewScanTime(false, true, false, false);
        break;
      case SCAN_TIME.TIME_IN_PM:
        newScanTime = changeNewScanTime(false, false, true, false);
        break;
      case SCAN_TIME.TIME_OUT_PM:
        newScanTime = changeNewScanTime(false, false, false, true);
        break;
    }

    try {
      const response = await axiosClient.put(
        `/attendance/${selectedAttendance._id}`,
        newScanTime
      );
      if (response.status === 200) {
        dispatch({
          type: ATTENDANCE_CONTEXT_TYPES.UPDATE_SEMESTER_ATTENDANCE,
          payload: response.data,
        });
        setSelectedAttendance(() => response.data);
        Alert(`Switched to ${scanTime}`);
        setLastScannedStudentId("");
      }
    } catch (error) {
      setErrorModalMessage(error.message);
    }
  };

  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar menu={location.pathname} />
        </div>
        <div className="py-12 px-6 lg:px-12 w-full space-y-3">
          <div className="flex justify-between">
            <div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-6">
              <div className="w-full">
                <div className="flex space-x-2">
                  {currentShowedTable === ATTENDANCE_TABLES.STUDENT && (
                    <img
                      onClick={() => {
                        setCurrentShowedTable(
                          () => ATTENDANCE_TABLES.ATTENDANCE
                        );
                        setShowScanner(false);
                        setSelectedAttendance(null);
                      }}
                      className="cursor-pointer p-2 rounded-md hover:bg-gray-200"
                      src="/img/arrow-back.svg"
                      alt=""
                    />
                  )}

                  <Header title={`Attendance`} />
                  {selectedAttendance && (
                    <span
                      className={
                        selectedAttendance.status
                          ? "text-xs py-1 px-2 h-fit rounded-md text-white bg-green-400"
                          : "text-xs py-1 px-2 h-fit rounded-md text-white bg-red-400"
                      }
                    >
                      {selectedAttendance.status ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <div>
                  {currentShowedTable === ATTENDANCE_TABLES.STUDENT &&
                    selectedAttendance.status && (
                      <div className="flex space-x-3">
                        <p className="font-semibold text-gray-600">AM</p>
                        <div className="flex border rounded-md">
                          <p
                            onClick={
                              !selectedAttendance.is_timein_am
                                ? () => {
                                    setScanTime(() => SCAN_TIME.TIME_IN_AM);
                                    toggleConfirmTimeInModal(true);
                                  }
                                : null
                            }
                            className={
                              selectedAttendance.is_timein_am
                                ? "px-3 rounded-l-md cursor-pointer text-white bg-green-500"
                                : "px-3 rounded-l-md cursor-pointer text-gray-600 bg-gray-200 hover:bg-gray-100"
                            }
                          >
                            In
                          </p>
                          <p
                            onClick={
                              !selectedAttendance.is_timeout_am
                                ? () => {
                                    setScanTime(() => SCAN_TIME.TIME_OUT_AM);
                                    toggleConfirmTimeInModal(true);
                                  }
                                : null
                            }
                            className={
                              selectedAttendance.is_timeout_am
                                ? "px-3 rounded-r-md cursor-pointer text-white bg-green-500"
                                : "px-3 rounded-r-md cursor-pointer text-gray-600 bg-gray-200 hover:bg-gray-100"
                            }
                          >
                            Out
                          </p>
                        </div>
                        <p className="font-semibold text-gray-600">PM</p>
                        <div className="flex border rounded-md">
                          <p
                            onClick={
                              !selectedAttendance.is_timein_pm
                                ? () => {
                                    setScanTime(() => SCAN_TIME.TIME_IN_PM);
                                    toggleConfirmTimeInModal(true);
                                  }
                                : null
                            }
                            className={
                              selectedAttendance.is_timein_pm
                                ? "px-3 rounded-l-md cursor-pointer text-white bg-green-500"
                                : "px-3 rounded-l-md cursor-pointer text-gray-600 bg-gray-200 hover:bg-gray-100"
                            }
                          >
                            In
                          </p>
                          <p
                            onClick={
                              !selectedAttendance.is_timeout_pm
                                ? () => {
                                    setScanTime(() => SCAN_TIME.TIME_OUT_PM);
                                    toggleConfirmTimeInModal(true);
                                  }
                                : null
                            }
                            className={
                              selectedAttendance.is_timeout_pm
                                ? "px-3 rounded-r-md cursor-pointer text-white bg-green-500"
                                : "px-3 rounded-r-md cursor-pointer text-gray-600 bg-gray-200 hover:bg-gray-100"
                            }
                          >
                            Out
                          </p>
                        </div>
                      </div>
                    )}
                </div>
                <div>
                  {currentShowedTable === ATTENDANCE_TABLES.STUDENT &&
                    !showScanner &&
                    selectedAttendance.status && (
                      <div
                        onClick={() => setShowScanner(true)}
                        className="p-2 w-8 rounded-lg cursor-pointer bg-green-400 text-white  hover:bg-green-300"
                      >
                        <img src="/img/qrcode-scan.svg" alt="" />
                      </div>
                    )}
                </div>
              </div>
            </div>
            {currentShowedTable === ATTENDANCE_TABLES.ATTENDANCE && (
              <button
                onClick={() => toggleCreateAttendanceModal(true)}
                className="px-2 flex w-fit h-fit p-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
              >
                <img src="/img/plus.svg" alt="" />
                <p className="uppercase me-4">Attendance</p>
              </button>
            )}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex">
              {currentSelectedSemester && (
                <div className="hidden md:flex flex-col md:flex-row md:space-x-1">
                  <div className="flex">
                    {studentTableDetailsList &&
                      studentTableDetailsList.map((list, index) => (
                        <div className="flex" key={index}>
                          <p className="p-1 italic text-sm text-gray-500">
                            {list}
                          </p>
                          {studentTableDetailsList.length - 1 !== index && (
                            <p className="mt-1 px-2 text-gray-300">/</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {selectedAttendance && (
                <div className="flex">
                  <p className="mt-1 px-2 text-gray-300">/</p>
                  <p className="p-1 italic text-sm text-gray-500">
                    {ConvertDate(selectedAttendance.createdAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
          {currentShowedTable === ATTENDANCE_TABLES.SEMESTER && (
            <div className="w-full">
              <div className="overflow-x-auto">
                <SemesterListTable semesters={semesters} />
              </div>
            </div>
          )}

          <div className="w-full">
            {currentShowedTable === ATTENDANCE_TABLES.STUDENT && (
              <StudentListTable
                attendance={selectedAttendance}
                totalAmScanned={totalAmScanned}
                totalPmScanned={totalPmScanned}
              />
            )}
          </div>

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

      {/* {currentShowedTable === ATTENDANCE_TABLES.STUDENT &&
        !showScanner &&
        selectedAttendance.status && (
          <div
            onClick={() => setShowScanner(true)}
            className="fixed bottom-8 right-6"
          >
            <div className="p-4 rounded-lg shadow-lg cursor-pointer bg-green-400 text-white  hover:bg-green-300">
              <img src="/img/qrcode-scan.svg" alt="" />
            </div>
          </div>
        )} */}

      {currentShowedTable === ATTENDANCE_TABLES.STUDENT && showScanner && (
        <QrCodeScannerModal
          toggleModal={setShowScanner}
          handleQrScanned={handleQrScanned}
          showScannerError={showScannerError}
          showScannerSuccess={showScannerSuccess}
          showScannerDefault={showScannerSuccess}
          setShowScannerError={setShowScannerError}
          setLastScannedStudentId={setLastScannedStudentId}
        />
      )}

      {showConfirmToggleTimeInModal && (
        <ConfirmModal
          title={""}
          body={`Switch QR Scanning to ${scanTime}?`}
          toggleModal={toggleConfirmTimeInModal}
          submit={handleToggleScanAttendance}
        />
      )}
    </div>
  );
}
