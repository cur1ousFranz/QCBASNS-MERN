import React, { useEffect, useState } from "react";
import getWeekdaysAndFormattedDatesInMonth from "../../utils/GetWeekDaysInMonth";
import formattedDate from "../../utils/FormattedDate";
import { REPORT } from "../../constants/Report";

export default function MonthlyReportTable({
  selectedMonthIndex,
  semesterYear,
  monthAttendances,
  currentSelectedSemester,
}) {
  const [weekDaysAndDates, setWeekDaysAndDates] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");

  useEffect(() => {
    const weekdaysAndFormattedDatesInMonth =
      getWeekdaysAndFormattedDatesInMonth(semesterYear, selectedMonthIndex);
    setWeekDaysAndDates(() => weekdaysAndFormattedDatesInMonth);
  }, [selectedMonthIndex, semesterYear]);

  useEffect(() => {
    // Set inital attendance record
    if (weekDaysAndDates) {
      
      const attendance = monthAttendances.sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      )[monthAttendances.length - 1];

      const studentsListInitialRecord = [];
      for (const student of attendance.students) {
        let studentInitialRecord = {
          student_id: student.student_id,
          full_name: `${student.full_name}${
            student.suffix !== "N/A" ? ", " + student.suffix : ""
          }`,
        };

        for (const day of weekDaysAndDates) {
          studentInitialRecord[day.date] = {
            record: REPORT.NoRecord,
            time_in_am: "",
            time_out_am: "",
            time_in_pm: "",
            time_out_pm: "",
          };
        }
        studentsListInitialRecord.push(studentInitialRecord);
      }

      for (const actualDate of weekDaysAndDates) {
        for (const attendance of monthAttendances) {
          const attendanceDate = formattedDate(attendance.createdAt);
          if (attendanceDate === actualDate.date) {
            for (const student of attendance.students) {
              /**
               * Present (No color)
               * Absent (Red)
               * Late (Yellow)
               * Cutting (Green)
               * Undertime (Orange)
               */

              let dayRecord;
              // PRESENT
              if (student.time_in_am && student.time_out_pm) {
                dayRecord = REPORT.Present;
              }
              // LATE
              if (
                isLate(currentSelectedSemester.timein_am, student.time_in_am) ||
                isLate(currentSelectedSemester.timein_pm, student.time_in_pm)
              ) {
                dayRecord = REPORT.Late;
              }
              // CUTTING
              if (
                (student.time_in_am && !student.time_out_am) ||
                (student.time_in_pm && !student.time_out_pm)
              ) {
                dayRecord = REPORT.Cutting;
              }
              // UNDERTIME
              if (
                isUnderTime(
                  currentSelectedSemester.timeout_am,
                  student.time_out_am
                ) ||
                isUnderTime(
                  currentSelectedSemester.timeout_pm,
                  student.time_out_pm
                )
              ) {
                dayRecord = REPORT.Undertime;
              }
              // ABSENT
              if (!student.time_in_am && !student.time_out_pm) {
                dayRecord = REPORT.Absent;
              }

              studentsListInitialRecord.map((attendance) => {
                if (attendance.student_id === student.student_id) {
                  attendance[attendanceDate] = {
                    record: dayRecord,
                    time_in_am: student.time_in_am,
                    time_out_am: student.time_out_am,
                    time_in_pm: student.time_in_pm,
                    time_out_pm: student.time_out_pm,
                  };
                }
                return attendance;
              });
            }
          }
        }
      }

      setMonthlyAttendance(() => studentsListInitialRecord);
    }
  }, [weekDaysAndDates]);

  const isLate = (semesterTimeIn, studentTimeIn) => {
    if (!studentTimeIn) return false;
    const studentTimeMatch = studentTimeIn.match(/\d{2}:\d{2}/);
    const studentTime = studentTimeMatch[0];
    return studentTime > semesterTimeIn;
  };

  const isUnderTime = (semesterTimeOut, studentTimeOut) => {
    if (!studentTimeOut) return false;
    const studentTimeMatch = studentTimeOut.match(/\d{2}:\d{2}/);
    const studentTime = studentTimeMatch[0];
    return studentTime < semesterTimeOut;
  };

  const countResult = (attendance, toCount) => {
    let countAbsent = 0;
    let countLate = 0;
    let countCutting = 0;
    let countUndertime = 0;
    const { student_id, full_name, ...dateDate } = attendance;
    const dateValues = Object.values(dateDate);
    dateValues.forEach((value) => {
      if (value.record === REPORT.Absent) countAbsent++;
      if (value.record === REPORT.Late) countLate++;
      if (value.record === REPORT.Cutting) countCutting++;
      if (value.record === REPORT.Undertime) countUndertime++;
    });

    switch (toCount) {
      case REPORT.Absent:
        return countAbsent;
      case REPORT.Late:
        return countLate;
      case REPORT.Cutting:
        return countCutting;
      case REPORT.Undertime:
        return countUndertime;
      default:
        return 0;
    }
  };

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
              <th className="font-normal px-2 py-3 uppercase">Undertime</th>
            </tr>
          </thead>
          <tbody>
            {monthlyAttendance &&
              monthlyAttendance
                .sort((a, b) => a.full_name.localeCompare(b.full_name))
                .map((attendance) => {
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
                      <td className="px-4 py-2">{full_name}</td>
                      {dateValues.map((dateValues, index) => (
                        <td
                          key={full_name + dateValues + index}
                          className={`px-4 py-2 text-xs border 
                          ${
                            dateValues.record === REPORT.Absent
                              ? "bg-red-400"
                              : dateValues.record === REPORT.Late
                              ? "bg-yellow-400"
                              : dateValues.record === REPORT.Cutting
                              ? "bg-green-400"
                              : dateValues.record === REPORT.Undertime
                              ? "bg-orange-400"
                              : ""
                          }`}
                        >
                          {dateValues.record === REPORT.NoRecord ? "-:-" : ""}
                        </td>
                      ))}
                      <td className="px-4 py-2 border">
                        {countResult(attendance, REPORT.Absent)}
                      </td>
                      <td className="px-4 py-2 border">
                        {countResult(attendance, REPORT.Late)}
                      </td>
                      <td className="px-4 py-2 border">
                        {countResult(attendance, REPORT.Cutting)}
                      </td>
                      <td className="px-4 py-2 border">
                        {countResult(attendance, REPORT.Undertime)}
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
