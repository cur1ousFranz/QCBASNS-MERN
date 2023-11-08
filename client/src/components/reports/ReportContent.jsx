import React, { forwardRef, useContext, useEffect, useState } from "react";
import getWeekdaysAndFormattedDatesInMonth from "../../utils/GetWeekDaysInMonth";
import { Absent, Cutting, Halfday, Late, REPORT } from "../../constants/Report";
import getWeeksInMonth from "../../utils/GetWeekDaysInWeek";
import { countResult, getStudentsRecord } from "../../utils/ReportUtil";
import ReportHeader from "./ReportContentHeader";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../utils/AxiosClient";

const ReportContent = forwardRef((props, ref) => {
  const {
    selectedMonthIndex,
    semesterYear,
    monthAttendances,
    currentSelectedSemester,
    tableShow,
    currentWeeklyIndex,
    setWeeklyIndexes,
  } = props;
  const [weekDaysAndDates, setWeekDaysAndDates] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [reportDateRange, setReportDateRange] = useState("");
  const { user } = useContext(AuthContext);
  const [adviser, setAdviser] = useState(null);

  useEffect(() => {
    if (user) {
      const getAdviser = async () => {
        try {
          const response = await axiosClient.get("/adviser");
          if (response.status === 200) {
            setAdviser(() => response.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getAdviser();
    }
  }, [user]);

  useEffect(() => {
    if (tableShow === REPORT.Monthly) {
      const result = getWeekdaysAndFormattedDatesInMonth(
        semesterYear,
        selectedMonthIndex
      );
      setWeekDaysAndDates(() => result);
      const from = result[0].date;
      const to = result[result.length - 1].date;
      setReportDateRange(() => `${from} - ${to}`);
    }
    if (tableShow === REPORT.Weekly) {
      const result = getWeeksInMonth(semesterYear, selectedMonthIndex);
      setWeekDaysAndDates(() => result[currentWeeklyIndex]); // Divided weeks in month
      const from = result[currentWeeklyIndex][0].date;
      const to =
        result[currentWeeklyIndex][result[currentWeeklyIndex].length - 1].date;
      setReportDateRange(() => `${from} - ${to}`);

      const indexes = [];
      for (let i = 0; i < result.length; i++) {
        indexes.push(i);
      }
      setWeeklyIndexes(() => indexes);
    }
  }, [selectedMonthIndex, semesterYear, tableShow, currentWeeklyIndex]);

  useEffect(() => {
    // Set inital attendance record
    if (weekDaysAndDates && monthAttendances.length > 0 && currentSelectedSemester) {
      const studentsListInitialRecord = getStudentsRecord(
        weekDaysAndDates,
        monthAttendances,
        currentSelectedSemester
      );
      setMonthlyAttendance(() => studentsListInitialRecord);
    }
  }, [weekDaysAndDates]);

  const getMonthByIndex = (index) => {
    switch (index) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        ref={ref}
        className="px-12 py-4 flex flex-col min-h-[100vh] box-content"
      >
        <div className="mt-12 mb-2">
          <div className="text-center pb-8 font-bold text-2xl flex justify-between">
            <div>
              <img src="/img/logo-kagawaran.svg" className="w-32" alt="" />
            </div>
            <h1 className="mt-12">
              Daily Attendance Report of Learners For Senior High School
            </h1>
            <div>
              <img
                src="/img/GSCNHS.png"
                className="mt-1"
                alt=""
                style={{ width: "8.5rem" }}
              />
            </div>
          </div>
          <div className="space-y-4">
            {currentSelectedSemester && (
              <>
                <div className="flex justify-between">
                  <ReportHeader
                    title="School Name"
                    value="General Santos City National High"
                  />
                  <ReportHeader title="School ID" value="304642" />
                  <ReportHeader title="District" value="Cahilsot" />
                  <ReportHeader
                    title="Division"
                    value="General Santos
                    City"
                  />
                  <ReportHeader title="Region" value="XII" />
                </div>
                <div className="flex justify-between">
                  <ReportHeader
                    title="Semester"
                    value={
                      currentSelectedSemester.semester === "1"
                        ? "1st Semester"
                        : "2nd Semester"
                    }
                  />
                  <ReportHeader
                    title="School Year"
                    value={`${currentSelectedSemester.start_year} - 
                    ${currentSelectedSemester.end_year}`}
                  />
                  <ReportHeader
                    title="Grade Level"
                    value={currentSelectedSemester.grade_level}
                  />
                  <ReportHeader
                    title="Track & Strand"
                    value={`${currentSelectedSemester.track} - 
                    ${
                      currentSelectedSemester.strand !== "N/A"
                        ? currentSelectedSemester.strand
                        : ""
                    }`}
                  />
                </div>
                <div className="flex justify-between">
                  <ReportHeader
                    title="Section"
                    value={currentSelectedSemester.section}
                  />
                  <div className="flex space-x-4">
                    <div>
                      <div className="flex space-x-2">
                        <p>Present</p>
                        <div className="w-fit mt-1 p-1.5 h-fit border border-gray-400"></div>
                      </div>
                      <div className="flex space-x-2">
                        <p>Absent</p>
                        <Absent />
                      </div>
                    </div>
                    <div>
                      <div className="flex space-x-2">
                        <p>Halfday</p>
                        <Halfday />
                      </div>
                      <div className="flex space-x-2">
                        <p>Cutting</p>
                        <Cutting />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <p>Late</p>
                      <Late />
                    </div>
                  </div>
                  <ReportHeader
                    title="Month of"
                    value={getMonthByIndex(selectedMonthIndex)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <h1 className="text-lg py-1">
          {tableShow === REPORT.Monthly ? "Monthly" : "Weekly"} Report:{" "}
          {reportDateRange} {semesterYear}
        </h1>
        <table className="report-content text-xs border w-full text-left mx-auto overflow-y-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr className="bg-gray-50 text-center">
              <th rowSpan="2" className="whitespace-nowrap py-1 border">
                No.
              </th>
              <th rowSpan="2" className="whitespace-nowrap py-1 border">
                <p>Full Name</p>
                <p>(Last Name, First Name, Middle Name)</p>
              </th>
              {weekDaysAndDates &&
                weekDaysAndDates.map((day) => (
                  <th
                    key={day.date}
                    className="font-normal italic text-gray-400 bg-gray-50"
                  >
                    {day.date.split(" ")[1]}
                  </th>
                ))}
              <th colSpan={4} className="text-center py-1 uppercase">
                Total for the{" "}
                {tableShow === REPORT.Monthly ? "Month" : "Weekly"}
              </th>
            </tr>
            <tr className="text-center">
              {weekDaysAndDates &&
                weekDaysAndDates.map((day, index) => (
                  <th
                    key={index}
                    className={
                      day.weekday === "F"
                        ? "font-normal bg-gray-200"
                        : "font-normal bg-gray-50"
                    }
                  >
                    {day.weekday}
                  </th>
                ))}
              <th className="font-normal py-3 uppercase">Absent</th>
              <th className="font-normal py-3 uppercase">Late</th>
              <th className="font-normal py-3 uppercase">Cutting</th>
              <th className="font-normal py-3 uppercase">Halfday</th>
            </tr>
          </thead>
          <tbody>
            {monthlyAttendance &&
              monthlyAttendance
                .sort((a, b) => a.full_name.localeCompare(b.full_name))
                .map((attendance, index) => {
                  const { student_id, full_name, ...dateDate } = attendance;
                  const dateValues = Object.values(dateDate);
                  return (
                    <tr key={full_name} className="border">
                      <td className="text-center border text-gray-700">
                        {index + 1}.
                      </td>
                      <td className="whitespace-nowrap text-base p-2">
                        {full_name}
                      </td>
                      {dateValues.map((dateValues, index) => (
                        <td
                          key={full_name + dateValues + index}
                          className="text-xs border"
                        >
                          {dateValues.record === REPORT.NoRecord && (
                            <div className="p-2 text-center text-gray-400">
                              -:-
                            </div>
                          )}
                          {dateValues.record === REPORT.Present && (
                            <div className="p-2 bg-white"></div>
                          )}
                          {dateValues.record === REPORT.Absent && (
                            <div className="p-2 bg-black"></div>
                          )}
                          {dateValues.record === REPORT.Cutting && (
                            <div className="p-2 text-center">X</div>
                          )}
                          {dateValues.record === REPORT.Late && (
                            <div className="p-2 bg-red-500"></div>
                          )}
                          {dateValues.record === REPORT.Halfday && (
                            <div className="relative border border-black p-2">
                              <div className="absolute left-0 top-0 w-full h-1/2 bg-black"></div>
                              <div className="absolute left-0 bottom-0 w-full h-1/2 bg-white"></div>
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="py-2 border text-center">
                        {countResult(attendance, REPORT.Absent)}
                      </td>
                      <td className="py-2 border text-center">
                        {countResult(attendance, REPORT.Late)}
                      </td>
                      <td className="py-2 border text-center">
                        {countResult(attendance, REPORT.Cutting)}
                      </td>
                      <td className="py-2 border text-center">
                        {countResult(attendance, REPORT.Halfday)}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        <div className="flex justify-start mt-12">
          <div className="text-center px-16">
            {adviser && (
              <p className="uppercase text-xl px-24">
                {adviser.first_name}{" "}
                {adviser.middle_name !== "N/A"
                  ? adviser.middle_name[0].toUpperCase() + "."
                  : ""}{" "}
                {adviser.last_name}{" "}
                {adviser.suffix !== "N/A" ? adviser.suffix : ""}
              </p>
            )}
            <p className="mt-1 uppercase text-xl border-t px-24 border-gray-800">
              Adviser
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

export default ReportContent;
