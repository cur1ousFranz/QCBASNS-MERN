import React from "react";
import ConvertDate from "../../../utils/ConvertDate";
import HumanReadableDate from "../../../utils/HumanReadableDate";
import { ATTENDANCE_TABLES } from "../../../constants/Constant";

export default function AttendanceListTable({ attendances, toggleTable }) {
  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <table className="w-full overflow-x-auto text-sm text-left mx-auto border">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              School Year
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {attendances &&
            attendances.map((attendance) => (
              <tr
                onClick={() =>
                  toggleTable(ATTENDANCE_TABLES.STUDENT, attendance)
                }
                key={attendance._id}
                className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
              >
                <th scope="row" className="relative px-6 py-4 font-medium">
                  {ConvertDate(attendance.createdAt)}
                  <p className="text-xs text-gray-600">
                    {HumanReadableDate(new Date(attendance.createdAt))}
                  </p>
                </th>
                <td className="px-6 py-4">
                  SY {attendance.semester.start_year} -{" "}
                  {attendance.semester.end_year}
                </td>

                <td className="px-6 py-4 flex justify-between">
                  {attendance.status ? (
                    <p className="mt-2">
                      <span className="p-1 font-semibold text-xs rounded-md text-white bg-green-500">
                        Active
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2">
                      <span className="p-1 font-semibold text-xs rounded-md text-white bg-red-400">
                        Inactive
                      </span>
                    </p>
                  )}
                </td>
              </tr>
            ))}

          {attendances && attendances.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 text-center border-b cursor-pointer bg-white"
              >
                No attendances to show.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-2">
        <h1 className="text-sm text-gray-600">Total: {attendances.length}</h1>
      </div>
    </div>
  );
}
