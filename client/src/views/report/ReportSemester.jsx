import React, { useEffect, useState } from "react";
import MonthlyReportTable from "../../components/reports/MonthlyReportTable";
import { useParams } from "react-router-dom";
import axiosClient from "../../utils/AxiosClient";
import Header from "../../components/header-text/Header";

export default function ReportSemester() {
  const { semesterId } = useParams();

  const [monthsList, setMonthsList] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [semesterYear, setSemesterYear] = useState(null);
  const [monthAttendances, setMonthAttendances] = useState([]);
  const [semester, setSemester] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);

  useEffect(() => {
    const getSemester = async () => {
      try {
        const response = await axiosClient.get(`/semester/${semesterId}`);
        if (response.status === 200) {
          const semester = response.data;
          setSemester(() => semester);
          setSemesterYear(() => new Date(semester.createdAt).getFullYear());
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSemester();
  }, [semesterId]);

  useEffect(() => {
    if (attendances.length && selectedMonth) {
      const filteredAttendance = filterAttendanceByMonth(
        attendances,
        selectedMonth
      );
      setMonthAttendances(() => filteredAttendance);
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (semester) {
      const school_year = `S.Y ${semester.start_year}-${semester.end_year}`;
      const semesterValue =
        semester.semester === "1" ? "1st Semester" : "2nd Semester";
      const track = semester.track;
      const strand = semester.strand !== "N/A" ? semester.strand : "";
      const section = semester.section;
      const tableDetails = [school_year, semesterValue, section, track];
      if (strand) tableDetails.push(strand);
      setTableDetails(() => tableDetails);
    }
  }, [semester]);

  useEffect(() => {
    if (semesterId) {
      const getAllSemesterAttendances = async () => {
        try {
          const response = await axiosClient.get(
            `/report/attendance/semester/${semesterId}`
          );
          if (response.status === 200) {
            setAttendances(() => response.data);
            // Get unique months to list in dropdown
            if (response.data.length) {
              const months = getUniqueMonths(response.data);
              setMonthsList(() => months);
              setSelectedMonth(() => months[months.length - 1].number);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      getAllSemesterAttendances();
    }
  }, [semesterId]);

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
      <div className="flex">
        <div className="py-12 px-6 lg:px-12 w-full space-y-3">
          <div className="flex items-center space-x-3">
            <div
              onClick={() => window.history.back()}
              className="p-1 cursor-pointer rounded-full hover:bg-green-200"
            >
              <img src="/img/arrow-back.svg" className="w-5" alt="" />
            </div>
            <Header title="Semester's Report" />
          </div>
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
          <div className="flex">
            {tableDetails &&
              tableDetails.map((list, index) => (
                <div className="flex" key={index}>
                  <p className="p-1 italic text-sm text-gray-500">{list}</p>
                  {tableDetails.length - 1 !== index && (
                    <p className="mt-1 px-2 text-gray-300">/</p>
                  )}
                </div>
              ))}
          </div>
          {monthAttendances.length > 0 ? (
            <MonthlyReportTable
              selectedMonthIndex={selectedMonth}
              semesterYear={semesterYear}
              monthAttendances={monthAttendances}
              currentSelectedSemester={semester}
            />
          ) : (
            <div className="border-b align-middle text-center cursor-pointer text-gray-400 bg-gray-50">
              <p className="py-24">No Record</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
