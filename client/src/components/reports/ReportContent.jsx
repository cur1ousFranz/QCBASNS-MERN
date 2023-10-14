import React, { forwardRef, useEffect, useState } from "react";
import getWeekdaysAndFormattedDatesInMonth from "../../utils/GetWeekDaysInMonth";
import { REPORT } from "../../constants/Report";
import getWeeksInMonth from "../../utils/GetWeekDaysInWeek";
import { countResult, getStudentsRecord } from "../../utils/ReportUtil";

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
      const to = result[currentWeeklyIndex][result[currentWeeklyIndex].length - 1].date;
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
      <div ref={ref} className="p-4">
        <h1 className="text-sm py-1">
          {tableShow === REPORT.Monthly ? "Monthly" : "Weekly"} Report: {reportDateRange} {semesterYear}
        </h1>
        <table className="report border w-full text-sm text-left mx-auto overflow-y-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr className="bg-gray-50 text-center">
              <th
                rowSpan="2"
                className="whitespace-nowrap px-12 py-1 border-r border-gray-300"
              >
                Full Name
              </th>
              <th colSpan={4} className="text-center px-6 py-1 uppercase">
                {tableShow === REPORT.Monthly ? "Month" : "Weekly"}
              </th>
            </tr>
            <tr className="text-center">
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
                  const { full_name } = attendance;
                  return (
                    <tr key={full_name} className="border">
                      <td className="whitespace-nowrap p-2">
                        {index + 1}. {full_name}
                      </td>
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
      </div>
    </>
  );
});

export default ReportContent;
