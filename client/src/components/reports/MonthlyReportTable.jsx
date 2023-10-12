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
    if (weekDaysAndDates && monthAttendances.length) {
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
                (student.time_in_am !== "" && student.time_out_am === "") ||
                (student.time_in_pm !== "" && student.time_out_pm === "") ||
                isCutting(
                  currentSelectedSemester.timeout_am,
                  student.time_out_am
                ) ||
                isCutting(
                  currentSelectedSemester.timeout_pm,
                  student.time_out_pm
                )
              ) {
                dayRecord = REPORT.Cutting;
              }
              // HALFDAY
              if (isHalfday(currentSelectedSemester.timeout_am, student)) {
                dayRecord = REPORT.Halfday;
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

  const isCutting = (semesterTimeOut, studentTimeOut) => {
    if (!studentTimeOut) return false;
    const studentTimeMatch = studentTimeOut.match(/\d{2}:\d{2}/);
    const studentTime = studentTimeMatch[0];
    return studentTime < semesterTimeOut;
  };

  const isHalfday = (semesterTimeOut, student) => {
    if (
      student.time_in_am &&
      student.time_out_am &&
      !student.time_in_pm &&
      !student.time_out_pm
    ) {
      const studentTimeMatch = student.time_out_am.match(/\d{2}:\d{2}/);
      const studentTime = studentTimeMatch[0];
      if (studentTime > semesterTimeOut) {
        return true;
      }
    }
  };

  const countResult = (attendance, toCount) => {
    let countAbsent = 0;
    let countLate = 0;
    let countCutting = 0;
    let countHalfday = 0;
    const { student_id, full_name, ...dateDate } = attendance;
    const dateValues = Object.values(dateDate);
    dateValues.forEach((value) => {
      if (value.record === REPORT.Absent) countAbsent++;
      if (value.record === REPORT.Late) countLate++;
      if (value.record === REPORT.Cutting) countCutting++;
      if (value.record === REPORT.Halfday) countHalfday++;
    });

    switch (toCount) {
      case REPORT.Absent:
        return countAbsent;
      case REPORT.Late:
        return countLate;
      case REPORT.Cutting:
        return countCutting;
      case REPORT.Halfday:
        return countHalfday;
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
              <th className="font-normal px-2 py-3 uppercase">Halfday</th>
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
                      <td className="whitespace-nowrap px-4 py-2">
                        {full_name}
                      </td>
                      {dateValues.map((dateValues, index) => (
                        <td
                          key={full_name + dateValues + index}
                          className="text-xs border"
                        >
                          {dateValues.record === REPORT.NoRecord && (
                            <div className="p-3">-:-</div>
                          )}
                          {dateValues.record === REPORT.Present && (
                            <div className="p-4 bg-white"></div>
                          )}
                          {dateValues.record === REPORT.Absent && (
                            <div className="p-5 bg-black"></div>
                          )}
                          {dateValues.record === REPORT.Cutting && (
                            <div className="p-3 text-center">X</div>
                          )}
                          {dateValues.record === REPORT.Late && (
                            <div className="p-5 bg-red-500"></div>
                          )}
                          {dateValues.record === REPORT.Halfday && (
                            <div className="relative border border-black p-5">
                              <div className="absolute left-0 top-0 w-full h-1/2 bg-black"></div>
                              <div className="absolute left-0 bottom-0 w-full h-1/2 bg-white"></div>
                            </div>
                          )}
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
