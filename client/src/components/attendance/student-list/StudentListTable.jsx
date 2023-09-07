import React from "react";

export default function StudentListTable({ attendance }) {
  return (
    <>
      <table className="w-full overflow-x-auto text-sm text-left mx-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Time In
            </th>
            <th scope="col" className="px-6 py-3">
              Time Out
            </th>
          </tr>
        </thead>
        <tbody>
          {attendance &&
            attendance.students &&
            attendance.students.map((student) => (
              <tr
                key={attendance._id}
                className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
              >
                <th scope="row" className="relative px-6 py-4 font-medium">
                  <p className="text-xs text-gray-600"></p>
                </th>
                <td className="px-6 py-4"></td>

                <td className="px-6 py-4 flex justify-between"></td>
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
    </>
  );
}
