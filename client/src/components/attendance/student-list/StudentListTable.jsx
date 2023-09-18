import React, { useEffect, useState } from "react";
import ConvertTime from "../../../utils/ConvertTime";

export default function StudentListTable({
  attendance,
  totalAmScanned,
  totalPmScanned,
}) {
  const [sortedStudents, setSortedStudents] = useState([]);

  useEffect(() => {
    setSortedStudents(() =>
      attendance.students.sort((a, b) => a.full_name.localeCompare(b.full_name))
    );
  }, [attendance]);
  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full overflow-x-auto text-sm text-left mx-auto border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                LRN
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                In (AM)
              </th>
              <th scope="col" className="px-6 py-3">
                Out (AM)
              </th>
              <th scope="col" className="px-6 py-3">
                In (PM)
              </th>
              <th scope="col" className="px-6 py-3">
                Out (PM)
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents &&
              sortedStudents.map((student) => (
                <tr
                  key={student.student_id}
                  className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
                >
                  <th scope="row" className="relative px-6 py-4 font-medium">
                    <p className="text-xs text-gray-600">{student.school_id}</p>
                  </th>
                  <td className="px-6 py-4">{student.full_name}</td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4">
                    {student.time_in_am !== ""
                      ? ConvertTime(student.time_in_am)
                      : "--:--"}
                  </td>
                  <td className="px-6 py-4">
                    {student.time_out_am !== ""
                      ? ConvertTime(student.time_out_am)
                      : "--:--"}
                  </td>
                  <td className="px-6 py-4">
                    {student.time_in_pm !== ""
                      ? ConvertTime(student.time_in_pm)
                      : "--:--"}
                  </td>
                  <td className="px-6 py-4">
                    {student.time_out_pm !== ""
                      ? ConvertTime(student.time_out_pm)
                      : "--:--"}
                  </td>
                </tr>
              ))}

            {attendance &&
              attendance.students &&
              attendance.students.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center border-b cursor-pointer bg-white"
                  >
                    Nothing to show.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex space-x-3">
        <h1 className="text-sm text-gray-600">
          Scanned (AM): {totalAmScanned} / {attendance.students.length}
        </h1>
        <h1 className="text-sm text-gray-600">
          Scanned (PM): {totalPmScanned} / {attendance.students.length}
        </h1>
      </div>
    </>
  );
}
