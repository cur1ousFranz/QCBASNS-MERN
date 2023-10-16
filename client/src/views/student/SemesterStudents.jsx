import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../utils/AxiosClient";
import Header from "../../components/header-text/Header";
import StudentListModal from "../../components/modals/StudentListModal";
import { Alert } from "../../utils/Alert";
import CreateStudentModal from "../../components/modals/CreateStudentModal";
import QrCodeModal from "../../components/modals/QrCodeModal";
import EditStudentModal from "../../components/modals/EditStudentModal";
import StudentParentDetailsModal from "../../components/modals/StudentParentDetailsModal";

export default function SemesterStudents() {
  const { semesterId } = useParams();
  const [currentSemester, setCurrentSemester] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [attendanceTableDetailsList, setAttendanceTableDetailsList] = useState(
    []
  );
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(null);
  const [selectedStudentIdEdit, setSelectedStudentIdEdit] = useState("");
  const [selectedStudentIdDetails, setSelecedStudentIdDetails] = useState("");

  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [sortedStudents, setSortedStudents] = useState([]);

  useEffect(() => {
    getSemesterStudents();
    getSemester();
  }, [semesterId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This adds a smooth scrolling animation
    });
    if (currentSemester) {
      const school_year = `S.Y ${currentSemester.start_year}-${currentSemester.end_year}`;
      const semesterValue =
        currentSemester.semester === "1" ? "1st Semester" : "2nd Semester";
      const gradeLevel = currentSemester.grade_level;
      const track = currentSemester.track;
      const strand =
        currentSemester.strand !== "N/A" ? currentSemester.strand : "";
      const section = currentSemester.section;
      const tableDetails = [school_year, semesterValue, gradeLevel, track, section];
      if (strand) tableDetails.push(strand);
      setAttendanceTableDetailsList(() => tableDetails);
    }
  }, [currentSemester]);

  const getSemesterStudents = async () => {
    if (semesterId) {
      try {
        const response = await axiosClient.get(
          `/semester/${semesterId}/student`
        );
        if (response.status === 200) {
          setStudentList(() => response.data);
        }
      } catch (error) {
        //   setErrorModalMessage(error.message);
      }
    }
  };

  const getSemester = async () => {
    try {
      const response = await axiosClient.get(`/semester/${semesterId}`);
      if (response.status === 200) {
        setCurrentSemester(() => response.data);
      }
    } catch (error) {}
  };

  const handleAddExistingStudents = async (studentsId) => {
    if (studentsId) {
      try {
        const response = await axiosClient.put(
          `/semester/${semesterId}/existing`,
          { students: studentsId }
        );
        if (response.status === 200) {
          setStudentList(() => response.data);
          getSemester();
          toggleStudentListModal(false);
          Alert("Added students successfully");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setSortedStudents(() =>
      studentList.sort((a, b) => a.last_name.localeCompare(b.last_name))
    );
  }, [studentList]);

  const toggleStudentListModal = (value) => setShowStudentListModal(value);
  const toggleQrCodeModal = (value = false) => setShowQrCodeModal(value);
  const toggleCreateStudentModal = (value) => setShowCreateStudentModal(value);
  const toggleEditStudentModal = (value) => setShowEditStudentModal(value);
  const toggleStudentParentDetailsModal = (value) =>
    setShowStudentDetailsModal(value);

  return (
    <>
      <div className="w-full" style={{ minHeight: "100vh" }}>
        <div className="flex">
          <div className="py-12 px-6 lg:px-12 w-full space-y-3">
            <div className="flex justify-between">
              <div className="flex items-center space-x-3">
                <div
                  onClick={() => window.history.back()}
                  className="p-1 cursor-pointer rounded-full hover:bg-green-200"
                >
                  <img src="/img/arrow-back.svg" className="w-5" alt="" />
                </div>
                <Header title="Semester Students" />
              </div>
              <div className="flex space-x-3">
                {currentSemester && currentSemester.active && (
                  <>
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
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex">
                {attendanceTableDetailsList &&
                  attendanceTableDetailsList.map((list, index) => (
                    <div className="flex" key={index}>
                      <p className="p-1 italic text-sm text-gray-500">{list}</p>
                      {attendanceTableDetailsList.length - 1 !== index && (
                        <p className="mt-1 px-2 text-gray-300">/</p>
                      )}
                    </div>
                  ))}
              </div>
              <div className="mt-2 flex space-x-3">
                <h1 className="text-sm text-gray-600">
                  Total Students: {studentList.length}
                </h1>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full overflow-x-auto text-sm text-left mx-auto overflow-y-auto border">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      LRN
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Full Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Suffix
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Gender
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3">
                      QR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentList &&
                    sortedStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className="border-b cursor-pointer bg-white hover:bg-green-50"
                      >
                        <th
                          onClick={() => {
                            setShowStudentDetailsModal(true);
                            setSelecedStudentIdDetails(student._id);
                          }}
                          scope="row"
                          className="px-6 py-4 font-medium whitespace-nowrap"
                        >
                          {student.school_id}
                        </th>
                        <td
                          onClick={() => {
                            setShowStudentDetailsModal(true);
                            setSelecedStudentIdDetails(student._id);
                          }}
                          className="px-6 py-4"
                        >
                          {student.last_name}, {student.first_name}{" "}
                          {student.middle_name !== "N/A"
                            ? student.middle_name[0].toUpperCase() + "."
                            : ""}
                        </td>
                        <td
                          onClick={() => {
                            setShowStudentDetailsModal(true);
                            setSelecedStudentIdDetails(student._id);
                          }}
                          className="px-6 py-4"
                        >
                          {student.suffix !== "N/A" ? student.suffix : ""}
                        </td>
                        <td
                          onClick={() => {
                            setShowStudentDetailsModal(true);
                            setSelecedStudentIdDetails(student._id);
                          }}
                          className="px-6 py-4"
                        >
                          {student.gender}
                        </td>
                        <td
                          onClick={() => {
                            setShowStudentDetailsModal(true);
                            setSelecedStudentIdDetails(student._id);
                          }}
                          className="px-6 py-4"
                        >
                          {student.contact_number !== "N/A"
                            ? student.contact_number
                            : ""}
                        </td>
                        <td className="relative px-6 py-4 flex justify-between">
                          <img
                            onClick={() => {
                              setSelectedStudentName(
                                () =>
                                  `${student.first_name} ${
                                    student.middle_name !== "N/A"
                                      ? student.middle_name
                                      : ""
                                  } ${student.last_name}${
                                    student.suffix !== "N/A"
                                      ? ", " + student.suffix
                                      : ""
                                  }`
                              );
                              setSelectedStudent(() => student);
                              setShowQrCodeModal(true);
                            }}
                            src="/img/qrcode.svg"
                            alt=""
                          />
                          <img
                            onClick={() => {
                              setShowOptionMenu(true);
                              setSeletedOptionIndex(index);
                            }}
                            className="inline-block"
                            src="/img/dots_option.svg"
                            alt=""
                          />
                          {showOptionMenu && index === selectedOptionIndex && (
                            <div
                              onMouseLeave={() => setShowOptionMenu(false)}
                              className="origin-top-right absolute right-0 mr-8 mt-2 w-44 z-10 rounded-md shadow-lg"
                            >
                              <div className="rounded-md border shadow-xs text-start bg-white">
                                <div
                                  onClick={() => {
                                    toggleEditStudentModal(true);
                                    setSelectedStudentIdEdit(() => student._id);
                                  }}
                                  className="p-3 flex space-x-3 hover:bg-gray-100"
                                >
                                  <img src="/img/edit.svg" alt="" />
                                  <p className="me-4">Edit</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  {studentList && studentList.length === 0 && (
                    <tr className="border-b cursor-pointer bg-white">
                      <td colSpan={6} className="px-6 py-4 text-center">
                        No students to show
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showStudentDetailsModal && (
        <StudentParentDetailsModal
          toggleModal={toggleStudentParentDetailsModal}
          studentId={selectedStudentIdDetails}
        />
      )}

      {showCreateStudentModal && (
        <CreateStudentModal
          toggleModal={toggleCreateStudentModal}
          semesterId={semesterId}
          setStudentList={setStudentList}
          getSemester={getSemester}
          title={"Create Student"}
        />
      )}

      {showEditStudentModal && (
        <EditStudentModal
          toggleModal={toggleEditStudentModal}
          title={"Edit Student"}
          studentId={selectedStudentIdEdit}
          getSemesterStudents={getSemesterStudents}
        />
      )}

      {showStudentListModal && (
        <StudentListModal
          toggleModal={toggleStudentListModal}
          addExisitingStudents={handleAddExistingStudents}
          currentSemesterId={semesterId}
          currentSemester={currentSemester}
        />
      )}
      {showQrCodeModal && (
        <QrCodeModal
          toggleModal={toggleQrCodeModal}
          title={selectedStudentName}
          student={selectedStudent}
        />
      )}
    </>
  );
}
