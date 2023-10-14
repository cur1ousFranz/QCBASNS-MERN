import { REPORT } from "../constants/Report";
import formattedDate from "./FormattedDate";

export const isLate = (semesterTimeIn, studentTimeIn) => {
  if (!studentTimeIn) return false;
  const studentTimeMatch = studentTimeIn.match(/\d{2}:\d{2}/);
  const studentTime = studentTimeMatch[0];
  return studentTime > semesterTimeIn;
};

export const isCutting = (semesterTimeOut, studentTimeOut) => {
  if (!studentTimeOut) return false;
  const studentTimeMatch = studentTimeOut.match(/\d{2}:\d{2}/);
  const studentTime = studentTimeMatch[0];
  return studentTime < semesterTimeOut;
};

export const isHalfday = (semesterTimeOut, student) => {
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

export const countResult = (attendance, toCount) => {
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

export const getStudentsRecord = (
  weekDaysAndDates,
  monthAttendances,
  currentSelectedSemester
) => {
  const attendance = monthAttendances.sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  )[monthAttendances.length - 1];

  const studentsListInitialRecord = [];
  for (const student of attendance.students) {
    let studentInitialRecord = {
      student_id: student.student_id,
      full_name: `${student.full_name}${
        student.suffix !== "N/A" ? " " + student.suffix : ""
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
            isCutting(currentSelectedSemester.timeout_pm, student.time_out_pm)
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
  return studentsListInitialRecord;
};
