import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../utils/AxiosClient";
import ConvertDate from "../../utils/ConvertDate";
import HumanReadableDate from "../../utils/HumanReadableDate";
import Header from "../../components/header-text/Header";
import Pagination from "../../components/layouts/Pagination";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { Alert } from "../../utils/Alert";
import ErrorModal from "../../components/modals/ErrorModal";
import LoadState from "../../components/header-text/LoadState";

export default function SemesterAttendances() {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [semester, setSemester] = useState(null);
  const [attendanceList, setAttendancesList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [hasAttendanceToday, setHasAttendanceToday] = useState(true);
  const [showCreateAttendanceModal, setShowCreateAttendanceModal] =
    useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [attendanceTableDetailsList, setAttendanceTableDetailsList] = useState(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateAttendance, setIsLoadingCreateAttendance] =
    useState(false);

  useEffect(() => {
    const getSemesterAttendances = async () => {
      if (semesterId) {
        setIsLoading(true);
        try {
          const response = await axiosClient.get(
            `attendance/semester/${semesterId}`
          );
          if (response.status === 200) {
            setData(() => response.data);
            setAttendancesList(() => response.data.attendances);
            setPaginationData({
              current_page: response.data.currentPage,
              last_page: response.data.totalPages,
            });
          }

          const res = await axiosClient.get(`/semester/${semesterId}`);
          if (res.status === 200) {
            setSemester(() => res.data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getSemesterAttendances();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handlePageChange = async (newPage) => {
    setPaginationData({ ...paginationData, current_page: newPage });
    try {
      const response = await axiosClient.get(
        `/attendance/semester/${semesterId}?page=${newPage}`
      );
      if (response.status === 200) {
        setData(() => response.data);
        setAttendancesList(() => response.data.attendances);
        setPaginationData({
          current_page: response.data.currentPage,
          last_page: response.data.totalPages,
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (semester) {
      const matchAttendanceDate = async () => {
        try {
          const response = await axiosClient.get(
            `/attendance/adviser/${semester.adviser_id}/semester/${semester._id}`
          );
          if (response.status === 200) {
            const attendancesData = response.data;
            if (attendancesData.length) {
              const attendance = attendancesData[attendancesData.length - 1];
              const givenDate = new Date(attendance.createdAt);
              const currentDate = new Date();

              const givenYear = givenDate.getFullYear();
              const givenMonth = givenDate.getMonth();
              const givenDay = givenDate.getDate();

              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth();
              const currentDay = currentDate.getDate();
              const matched =
                givenYear === currentYear &&
                givenMonth === currentMonth &&
                givenDay === currentDay;
              setHasAttendanceToday(() => matched);
            } else {
              setHasAttendanceToday(false);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      matchAttendanceDate();
    }
  }, [attendanceList, semester]);

  useEffect(() => {
    if (semester) {
      const school_year = `S.Y ${semester.start_year}-${semester.end_year}`;
      const semesterValue =
        semester.semester === "1" ? "1st Semester" : "2nd Semester";
      const gradeLevel = semester.grade_level;
      const track = semester.track;
      const strand = semester.strand !== "N/A" ? semester.strand : "";
      const section = semester.section;
      const tableDetails = [school_year, semesterValue, gradeLevel, track];
      if (strand) tableDetails.push(strand);
      tableDetails.push(section);
      setAttendanceTableDetailsList(() => tableDetails);
    }
  }, [semester]);

  const toggleCreateAttendanceModal = (value) =>
    setShowCreateAttendanceModal(value);

  const handleCreateAttendance = async () => {
    let latestAttendance;
    if (attendanceList.length > 0) {
      latestAttendance = attendanceList[0];
    }
    if (semester) {
      try {
        setIsLoadingCreateAttendance(true);
        const newAttendance = {
          semester_id: semesterId,
        };
        const response = await axiosClient.post("/attendance", newAttendance);
        if (response.status === 200) {
          setAttendancesList(() => response.data.attendances);
          setPaginationData({
            current_page: response.data.currentPage,
            last_page: response.data.totalPages,
          });
          Alert("Created successfully");

          // Update lastest attendance to inactive
          if (latestAttendance) {
            const res = await axiosClient.put(
              `/attendance/${latestAttendance._id}`,
              { status: false }
            );

            if (res.status === 200) {
              try {
                const response = await axiosClient.get(
                  `attendance/semester/${semesterId}?page=${paginationData.current_page}`
                );
                if (response.status === 200) {
                  setData(() => response.data);
                  setAttendancesList(() => response.data.attendances);
                  setPaginationData({
                    current_page: response.data.currentPage,
                    last_page: response.data.totalPages,
                  });
                }
              } catch (error) {
                console.log(error);
              }
            }
          }
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      } finally {
        setIsLoadingCreateAttendance(false);
      }
    } else {
      Alert("You don`t have semester yet", "error");
    }
  };

  const navigateAttendanceStudents = (attendanceId) => {
    navigate(`/attendance/semester/${semesterId}/attendance/${attendanceId}`);
  };

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
                <Header title="Attendances" />
              </div>
              <div>
                <button
                  onClick={() => {
                    if (!hasAttendanceToday && !isLoadingCreateAttendance) {
                      toggleCreateAttendanceModal(true);
                    }
                  }}
                  className={
                    (semester && !semester.active) || hasAttendanceToday
                      ? "flex w-fit h-fit p-2 text-sm rounded-md cursor-not-allowed text-white bg-gray-300"
                      : "flex w-fit h-fit p-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
                  }
                  disabled={
                    (semester && !semester.active) || hasAttendanceToday
                  }
                >
                  <img src="/img/plus.svg" alt="" />
                  <p className="uppercase me-4">Attendance</p>
                </button>
              </div>
            </div>
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
            <table className="w-full overflow-x-auto text-sm text-left mx-auto border">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    School Year
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceList &&
                  !isLoading &&
                  attendanceList.map((attendance) => (
                    <tr
                      onClick={() => navigateAttendanceStudents(attendance._id)}
                      key={attendance._id}
                      className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
                    >
                      <th
                        scope="row"
                        className="relative px-6 py-4 font-medium"
                      >
                        {ConvertDate(attendance.createdAt)}
                        <p className="text-xs text-gray-600">
                          {HumanReadableDate(new Date(attendance.createdAt))}
                        </p>
                      </th>
                      <td className="px-6 py-4">
                        SY {attendance.semester.start_year} -{" "}
                        {attendance.semester.end_year}
                      </td>

                      <td className="px-6 py-4 flex justify-between">
                        {attendance.status ? (
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
                      </td>
                    </tr>
                  ))}

                {attendanceList &&
                  attendanceList.length === 0 &&
                  !isLoading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center border-b cursor-pointer bg-white"
                      >
                        No attendances to show.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
            {!isLoading && (
              <div className="mt-2 flex justify-between">
                <h1 className="text-sm text-gray-600">
                  Total Pages: {data.totalPages}
                </h1>
                {data.totalPages !== 0 && (
                  <Pagination
                    pagination={paginationData}
                    onChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {errorModalMessage && <ErrorModal title={errorModalMessage} />}

        {showCreateAttendanceModal && (
          <ConfirmModal
            title={"Attention"}
            body={
              "You can only create on attendance per day. Would you like to proceed?"
            }
            toggleModal={toggleCreateAttendanceModal}
            submit={handleCreateAttendance}
          />
        )}
        {isLoading && <LoadState />}
      </div>
    </>
  );
}
