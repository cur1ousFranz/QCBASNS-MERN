import React, { useEffect, useState } from "react";
import MonthlyReportTable from "../../components/reports/MonthlyReportTable";
import { useParams } from "react-router-dom";
import axiosClient from "../../utils/AxiosClient";
import Header from "../../components/header-text/Header";
import { Absent, Cutting, Halfday, Late, REPORT } from "../../constants/Report";

export default function ReportSemester() {
  const { semesterId } = useParams();

  const [monthsList, setMonthsList] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [semesterYear, setSemesterYear] = useState(null);
  const [monthAttendances, setMonthAttendances] = useState([]);
  const [semester, setSemester] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);
  const [tableShow, setTableShow] = useState(REPORT.Monthly);
  const [currentWeeklyIndex, setCurrentWeeklyIndex] = useState(0);
  const [weeklyIndexes, setWeeklyIndexes] = useState([]);

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

  const formatIndex = (index) => {
    switch (index) {
      case 0:
        return "1st Week";
      case 1:
        return "2nd Week";
      case 2:
        return "3rd Week";
      case 3:
        return "4th Week";
      case 4:
        return "5th Week";
      default:
        return "";
    }
  };

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
            <div className="flex space-x-3">
              <select
                onChange={(e) => setTableShow(e.target.value)}
                value={tableShow}
                className="px-1 text-sm w-fit rounded-sm border border-gray-500"
              >
                <option value={REPORT.Monthly}>{REPORT.Monthly}</option>
                <option value={REPORT.Weekly}>{REPORT.Weekly}</option>
              </select>
              <select
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                value={selectedMonth ? selectedMonth : ""}
                className="px-1 text-sm w-fit rounded-sm border border-gray-500"
              >
                {monthsList &&
                  monthsList.map((month) => (
                    <option key={month.month} value={month.number}>
                      {month.month}
                    </option>
                  ))}
                {monthsList.length === 0 && <option>No record</option>}
              </select>

              {tableShow === REPORT.Weekly && (
                <select
                  onChange={(e) => setCurrentWeeklyIndex(e.target.value)}
                  value={currentWeeklyIndex}
                  className="px-1 text-sm w-fit rounded-sm border border-gray-500"
                >
                  {weeklyIndexes.map((index) => (
                    <option key={`weekly ${index}`} value={index}>
                      {formatIndex(index)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex space-x-3">
              <div className="flex space-x-2 text-sm">
                <p>Present</p>
                <div className="w-fit mt-1 p-1.5 h-fit border border-gray-400"></div>
              </div>
              <div className="flex space-x-2 text-sm">
                <p>Absent</p>
                <Absent />
              </div>
              <div className="flex space-x-2 text-sm">
                <p>Halfday</p>
                <Halfday />
              </div>
              <div className="flex space-x-2 text-sm">
                <p>Late</p>
                <Late />
              </div>
              <div className="flex space-x-2 text-sm">
                <p>Cutting</p>
                <Cutting />
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
          {monthAttendances.length > 0 && (
            <MonthlyReportTable
              selectedMonthIndex={selectedMonth}
              semesterYear={semesterYear}
              monthAttendances={monthAttendances}
              currentSelectedSemester={semester}
              tableShow={tableShow}
              currentWeeklyIndex={currentWeeklyIndex}
              setWeeklyIndexes={setWeeklyIndexes}
            />
          )}
          {/* {monthAttendances.length > 0 && tableShow === REPORT.Weekly && (
            <WeeklyReportTable
              selectedMonthIndex={selectedMonth}
              semesterYear={semesterYear}
              monthAttendances={monthAttendances}
              currentSelectedSemester={semester}
            />
          )} */}

          {/* <div className="border-b align-middle text-center cursor-pointer text-gray-400 bg-gray-50">
              <p className="py-24">No Record</p>
            </div> */}
        </div>
      </div>
    </div>
  );
}
