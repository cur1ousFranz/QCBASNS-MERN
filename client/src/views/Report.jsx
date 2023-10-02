import React, { useContext, useEffect, useState } from "react";
import Header from "../components/header-text/Header";
import MonthlyReportTable from "../components/reports/MonthlyReportTable";
import axiosClient from "../utils/AxiosClient";
import { SemesterContext } from "../context/SemesterContext";
import {
  ATTENDANCE_CONTEXT_TYPES,
  AttendanceContext,
} from "../context/AttendanceContext";

export default function Report() {
  const { semesters, dispatch } = useContext(SemesterContext);
  const { attendances, dispatch: attendanceDispatch } =
    useContext(AttendanceContext);

  const [monthAttendances, setMonthAttendances] = useState([]);
  const [latestSemesterId, setLatestSemesterId] = useState("");
  const [monthsList, setMonthsList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [semesterYear, setSemesterYear] = useState(null);
  const [semesterStudents, setSemesterStudents] = useState([]);
  const [currentSelectedSemester, setCurrentSelectedSemester] = useState("");

  useEffect(() => {
    const getAllSemesters = async () => {
      try {
        const response = await axiosClient.get("/semester");
        if (response.status === 200) {
          dispatch({ type: "SET_SEMESTERS", payload: response.data });
        }
      } catch (error) {}
    };

    getAllSemesters();
  }, []);

  useEffect(() => {
    // Get the latest semester id for default display of report attendances
    if (semesters.length) {
      const semester = semesters[semesters.length - 1];
      setCurrentSelectedSemester(() => semester);
      setLatestSemesterId(() => semester._id);
      setSemesterYear(() => new Date(semester.createdAt).getFullYear());
      setSemesterStudents(() => semester.students);
    }
  }, [semesters]);

  useEffect(() => {
    if (latestSemesterId) {
      const getAllSemesterAttendances = async () => {
        try {
          const response = await axiosClient.get(
            `/attendance/semester/${latestSemesterId}`
          );
          if (response.status === 200) {
            attendanceDispatch({
              type: ATTENDANCE_CONTEXT_TYPES.SET_SEMESTER_ATTENDANCES,
              payload: response.data,
            });
            // Get unique months to list in dropdown
            if (response.data.length) {
              const months = getUniqueMonths(response.data);
              setMonthsList(() => months);
              setSelectedMonth(() => months[months.length - 1].number);
            }
          }
        } catch (error) {}
      };

      getAllSemesterAttendances();
    }
  }, [latestSemesterId]);

  // Filter attendances by selected month
  useEffect(() => {
    if (attendances.length && selectedMonth) {
      const filteredAttendance = filterAttendanceByMonth(
        attendances,
        selectedMonth
      );
      setMonthAttendances(() => filteredAttendance);
    }
  }, [selectedMonth]);

  function getUniqueMonths(attendances) {
    const uniqueMonths = [];
    for (const attendance of attendances) {
      const date = new Date(attendance.createdAt);
      const monthNumber = date.getMonth() + 1; // JavaScript months are zero-based
      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(date);

      const existingMonth = uniqueMonths.find(
        (month) => month.number === monthNumber
      );

      if (!existingMonth) {
        uniqueMonths.push({ number: monthNumber, month: monthName });
      }
    }
    uniqueMonths.sort((a, b) => a.number - b.number);
    return uniqueMonths;
  }

  function filterAttendanceByMonth(attendances, targetMonth) {
    const filteredAttendances = [];

    for (const attendance of attendances) {
      const date = new Date(attendance.createdAt);
      const month = date.getMonth() + 1; // JavaScript months are zero-based
      if (month === targetMonth) {
        filteredAttendances.push(attendance);
      }
    }
    return filteredAttendances;
  }

  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex max-w-full">
        <div className="p-12 w-full space-y-3">
          <Header title={`Report`} />
          <div className="">
            <div className="flex justify-between space-x-3">
              <select
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                value={selectedMonth ? selectedMonth : ""}
                className="px-2 py-1 w-fit border rounded-md"
              >
                {monthsList &&
                  monthsList.map((month) => (
                    <option key={month.month} value={month.number}>
                      {month.month}
                    </option>
                  ))}
                {monthsList.length === 0 && <option>No record</option>}
              </select>
              <div className="flex space-x-3">
                <div className="flex space-x-2 text-sm">
                  <p>Present</p>
                  <div className="w-fit mt-1 p-1.5 h-fit border border-gray-400"></div>
                </div>
                <div className="flex space-x-2 text-sm">
                  <p>Absent</p>
                  <div className="w-fit mt-1 p-1.5 h-fit border border-red-400 bg-red-400"></div>
                </div>
                <div className="flex space-x-2 text-sm">
                  <p>Late</p>
                  <div className="w-fit mt-1 p-1.5 h-fit border border-yellow-400 bg-yellow-400"></div>
                </div>
                <div className="flex space-x-2 text-sm">
                  <p>Cutting</p>
                  <div className="w-fit mt-1 p-1.5 h-fit border border-green-400 bg-green-400"></div>
                </div>
                <div className="flex space-x-2 text-sm">
                  <p>Undertime</p>
                  <div className="w-fit mt-1 p-1.5 h-fit border border-orange-400 bg-orange-400"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 overflow-x-auto">
            {monthAttendances.length > 0 ? (
              <MonthlyReportTable
                selectedMonthIndex={selectedMonth}
                semesterYear={semesterYear}
                monthAttendances={monthAttendances}
                currentSelectedSemester={currentSelectedSemester}
              />
            ) : (
              <div className="border-b text-center py-24 cursor-pointer text-gray-400 bg-gray-50">
                No Record
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
