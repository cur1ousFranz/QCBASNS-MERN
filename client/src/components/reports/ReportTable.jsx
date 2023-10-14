import React, { useEffect, useState } from "react";
import getWeekdaysAndFormattedDatesInMonth from "../../utils/GetWeekDaysInMonth";
import { REPORT } from "../../constants/Report";
import getWeeksInMonth from "../../utils/GetWeekDaysInWeek";
import { countResult, getStudentsRecord } from "../../utils/ReportUtil";

export default function MonthlyReportTable({
  selectedMonthIndex,
  semesterYear,
  monthAttendances,
  currentSelectedSemester,
  tableShow,
  currentWeeklyIndex,
  setWeeklyIndexes,
}) {
  const [weekDaysAndDates, setWeekDaysAndDates] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");

  useEffect(() => {
    if (tableShow === REPORT.Monthly) {
      const result = getWeekdaysAndFormattedDatesInMonth(
        semesterYear,
        selectedMonthIndex
      );
      setWeekDaysAndDates(() => result);
    }
    if (tableShow === REPORT.Weekly) {
      const result = getWeeksInMonth(semesterYear, selectedMonthIndex);
      setWeekDaysAndDates(() => result[currentWeeklyIndex]); // Divided weeks in month

      const indexes = [];
      for (let i = 0; i < result.length; i++) {
        indexes.push(i);
      }
      setWeeklyIndexes(() => indexes);
    }
  }, [selectedMonthIndex, semesterYear, tableShow, currentWeeklyIndex]);

  useEffect(() => {
    // Set inital attendance record
    if (weekDaysAndDates && monthAttendances.length) {
      const studentsListInitialRecord = getStudentsRecord(
        weekDaysAndDates,
        monthAttendances,
        currentSelectedSemester
      );
      setMonthlyAttendance(() => studentsListInitialRecord);
    }
  }, [weekDaysAndDates]);

  return (
    <>
      <div className="table-container max-h-[70vh] overflow-y-auto">
        <table className="report w-full text-sm text-left mx-auto overflow-y-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr className="bg-gray-50 text-center">
              <th
                rowSpan="2"
                className="whitespace-nowrap px-12 py-3 border-r border-gray-300"
              >
                Full Name
              </th>
              {weekDaysAndDates &&
                weekDaysAndDates.map((day) => (
                  <th
                    key={day.date}
                    className="font-normal italic text-gray-400 bg-gray-50"
                  >
                    {day.date}
                  </th>
                ))}
              <th colSpan={4} className="text-center px-6 py-3 uppercase">
                Month
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
              <th className="font-normal px-2 py-3 uppercase">Absent</th>
              <th className="font-normal px-2 py-3 uppercase">Late</th>
              <th className="font-normal px-2 py-3 uppercase">Cutting</th>
              <th className="font-normal px-2 py-3 uppercase">Halfday</th>
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
                    <tr
                      key={full_name}
                      className={`border ${
                        selectedRow === full_name ? "bg-green-100" : ""
                      } cursor-pointer hover:bg-green-100`}
                      onClick={() => setSelectedRow(full_name)}
                    >
                      <td className="whitespace-nowrap p-2">{index + 1}. {full_name}</td>
                      {dateValues.map((dateValues, index) => (
                        <td
                          key={full_name + dateValues + index}
                          className="text-xs border"
                        >
                          {dateValues.record === REPORT.NoRecord && (
                            <div className="p-3 text-center text-gray-400">
                              -:-
                            </div>
                          )}
                          {dateValues.record === REPORT.Present && (
                            <div className="p-3 bg-white"></div>
                          )}
                          {dateValues.record === REPORT.Absent && (
                            <div className="p-3 bg-black"></div>
                          )}
                          {dateValues.record === REPORT.Cutting && (
                            <div className="p-3 text-center">X</div>
                          )}
                          {dateValues.record === REPORT.Late && (
                            <div className="p-3 bg-red-500"></div>
                          )}
                          {dateValues.record === REPORT.Halfday && (
                            <div className="relative border border-black p-3">
                              <div className="absolute left-0 top-0 w-full h-1/2 bg-black"></div>
                              <div className="absolute left-0 bottom-0 w-full h-1/2 bg-white"></div>
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-2 border text-center">
                        {countResult(attendance, REPORT.Absent)}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {countResult(attendance, REPORT.Late)}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {countResult(attendance, REPORT.Cutting)}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {countResult(attendance, REPORT.Halfday)}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </>
  );
}
