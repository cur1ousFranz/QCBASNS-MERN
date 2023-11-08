import React, { useEffect, useState } from "react";
import ConvertTime from "../../utils/ConvertTime";
import { useParams } from "react-router-dom";
import axiosClient from "../../utils/AxiosClient";
import Header from "../../components/header-text/Header";
import { Alert } from "../../utils/Alert";
import ConvertDate from "../../utils/ConvertDate";
import QrCodeScannerModal from "../../components/modals/QrCodeScannerModal";
import LoadState from "../../components/header-text/LoadState";

export default function AttendanceStudents() {
  const { semesterId, attendanceId } = useParams();
  const [attendance, setAttendance] = useState(null);
  const [studentsList, setStudentList] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [lastScannedStudentId, setLastScannedStudentId] = useState("");
  const [showScannerError, setShowScannerError] = useState(false);
  const [showScannerSuccess, setShowScannerSuccess] = useState(false);
  const [showScannerDefault, setShowScannerDefault] = useState(true);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [studentTableDetailsList, setStudentTableDetailsList] = useState([]);
  const [sortedStudents, setSortedStudents] = useState([]);

  const [totalAmInScanned, setTotalAmInScanned] = useState(0);
  const [totalAmOutScanned, setTotalAmOutScanned] = useState(0);
  const [totalPmInScanned, setTotalPmInScanned] = useState(0);
  const [totalPmOutScanned, setTotalPmOutScanned] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getAttendanceStudents = async () => {
    try {
      const response = await axiosClient.get(`/attendance/${attendanceId}`);
      if (response.status === 200) {
        setAttendance(() => response.data);
        setStudentList(() => response.data.students);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getSemester = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get(`/semester/${semesterId}`);
        if (response.status === 200) {
          setCurrentSemester(() => response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAttendanceStudents();
    getSemester();
  }, [attendanceId]);

  useEffect(() => {
    if (currentSemester && attendance) {
      const school_year = `S.Y ${currentSemester.start_year}-${currentSemester.end_year}`;
      const semester =
        currentSemester.semester === "1" ? "1st Semester" : "2nd Semester";
      const gradeLevel = currentSemester.grade_level;
      const track = currentSemester.track;
      const strand =
        currentSemester.strand !== "N/A" ? currentSemester.strand : "";
      const section = currentSemester.section;
      const attendanceDate = ConvertDate(attendance.createdAt);
      const tableDetails = [school_year, semester, gradeLevel, track];
      if (strand) tableDetails.push(strand);
      tableDetails.push(section);
      tableDetails.push(attendanceDate);
      setStudentTableDetailsList(() => tableDetails);
    }
  }, [currentSemester, attendance]);

  useEffect(() => {
    let amInCount = 0;
    let amOutCount = 0;
    let pmInCount = 0;
    let pmOutCount = 0;
    studentsList.forEach((student) => {
      if (student.time_in_am) {
        amInCount++;
      }
      if (student.time_out_am) {
        amOutCount++;
      }
      if (student.time_in_pm) {
        pmInCount++;
      }
      if (student.time_out_pm) {
        pmOutCount++;
      }
    });

    setTotalAmInScanned(() => amInCount);
    setTotalAmOutScanned(() => amOutCount);
    setTotalPmInScanned(() => pmInCount);
    setTotalPmOutScanned(() => pmOutCount);
  }, [studentsList]);

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
          semester_id: semesterId,
          page: attendance.currentPage,
        };
        try {
          const response = await axiosClient.put(
            `/attendance/${attendanceId}/student/${student._id}`,
            studentDetails
          );

          if (response.status === 200) {
            Alert(
              `${student.last_name}, ${student.first_name} ${
                student.middle_name !== "N/A"
                  ? student.middle_name[0].toUpperCase() + "."
                  : ""
              }  Scanned Success!`
            );

            getAttendanceStudents();
            setShowScannerSuccess(true);
            setShowScannerDefault(false);
          }
        } catch (error) {
          setShowScannerError(true);
          setShowScannerDefault(false);
          if (error.response.data) {
            Alert(error.response.data.message, "error");
          }
        }
      } else {
        setShowScannerError(true);
        setShowScannerDefault(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowScannerError(false);
      setShowScannerSuccess(false);
      setShowScannerDefault(true);
    }, 3000);
  }, [showScannerError, showScannerSuccess, showScannerDefault]);

  useEffect(() => {
    if (lastScannedStudentId) {
      setTimeout(() => {
        setLastScannedStudentId("");
      }, 10000);
    }
  }, [lastScannedStudentId]);

  useEffect(() => {
    setSortedStudents(() =>
      studentsList.sort((a, b) => a.full_name.localeCompare(b.full_name))
    );
  }, [studentsList]);

  return (
    <>
      <div className="w-full" style={{ minHeight: "100vh" }}>
        <div className="flex">
          <div className="py-12 px-6 lg:px-12 w-full space-y-3">
            <div className="flex justify-between">
              <div className="w-full">
                <div className="flex justify-between">
                  <div className="flex space-x-3">
                    <div className="flex items-center space-x-3">
                      <div
                        onClick={() => window.history.back()}
                        className="p-1 cursor-pointer rounded-full hover:bg-green-200"
                      >
                        <img src="/img/arrow-back.svg" className="w-5" alt="" />
                      </div>
                      <Header title="Attendance Students" />
                    </div>
                    {attendance && (
                      <span
                        className={
                          attendance.status
                            ? "text-xs py-1 px-2 h-fit rounded-md text-white bg-green-400"
                            : "text-xs py-1 px-2 h-fit rounded-md text-white bg-red-400"
                        }
                      >
                        {attendance.status ? "Active" : "Inactive"}
                      </span>
                    )}
                  </div>
                  {currentSemester && currentSemester.active && (
                    <div>
                      {!showScanner && (
                        <div
                          onClick={() => setShowScanner(true)}
                          className="p-2 flex space-x-3 rounded-lg cursor-pointer bg-green-400 text-white  hover:bg-green-300"
                        >
                          <img
                            src="/img/qrcode-scan.svg"
                            className="w-4"
                            alt=""
                          />
                          <p className="uppercase text-gray-900">Scan QR</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex mt-1 justify-between">
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
                  <div className="flex space-x-3 font-semibold">
                    <h1 className="text-sm text-gray-600">
                      Scanned (AM) IN: {totalAmInScanned} / OUT:{" "}
                      {totalAmOutScanned}
                    </h1>
                    <h1 className="text-sm text-gray-600">
                      (PM) IN: {totalPmInScanned} / OUT: {totalPmOutScanned}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full overflow-x-auto text-sm text-left mx-auto border">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      LRN
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Full Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Gender
                    </th>
                    <th scope="col" className="px-6 py-3">
                      In (AM)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Out (AM)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      In (PM)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Out (PM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList &&
                    !isLoading &&
                    sortedStudents.map((student) => (
                      <tr
                        key={student.student_id}
                        className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
                      >
                        <th
                          scope="row"
                          className="relative px-6 py-4 font-medium"
                        >
                          <p className="text-xs text-gray-600">
                            {student.school_id}
                          </p>
                        </th>
                        <td className="px-6 py-4">{student.full_name}</td>
                        <td className="px-6 py-4">{student.gender}</td>
                        <td className="px-6 py-4">
                          {student.time_in_am !== ""
                            ? ConvertTime(student.time_in_am)
                            : "--:--"}
                        </td>
                        <td className="px-6 py-4">
                          {student.time_out_am !== ""
                            ? ConvertTime(student.time_out_am)
                            : "--:--"}
                        </td>
                        <td className="px-6 py-4">
                          {student.time_in_pm !== ""
                            ? ConvertTime(student.time_in_pm)
                            : "--:--"}
                        </td>
                        <td className="px-6 py-4">
                          {student.time_out_pm !== ""
                            ? ConvertTime(student.time_out_pm)
                            : "--:--"}
                        </td>
                      </tr>
                    ))}

                  {studentsList &&
                    studentsList.students &&
                    studentsList.students.length === 0 &&
                    !isLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center border-b cursor-pointer bg-white"
                        >
                          Nothing to show.
                        </td>
                      </tr>
                    )}
                </tbody>
                {studentsList && studentsList.length === 0 && (
                  <tbody>
                    <tr className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50">
                      <td colSpan={7} className="px-6 py-4 text-center">
                        No students to show
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        {showScanner && (
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
        {isLoading && <LoadState />}
      </div>
    </>
  );
}
