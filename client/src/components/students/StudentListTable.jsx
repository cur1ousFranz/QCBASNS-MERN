import React from "react";

export default function StudentListTable({ students }) {
  return (
    <table className="w-full text-sm text-left mx-auto transition duration-700 ease-in-out">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">
            ID No.
          </th>
          <th scope="col" className="px-6 py-3">
            Full Name
          </th>
          {/* <th scope="col" className="px-6 py-3">
            Grade
          </th> */}
          <th scope="col" className="px-6 py-3">
            Contact
          </th>
          <th scope="col" className="px-6 py-3">
            QR
          </th>
        </tr>
      </thead>
      <tbody>
        {students &&
          students.map((student) => (
            <tr
              key={student._id}
              className="border-b cursor-pointer bg-white hover:bg-green-50"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap"
              >
                {student.school_id}
              </th>
              <td className="px-6 py-4">
                {student.first_name} {student.middle_name} {student.last_name}{" "}
              </td>
              <td className="px-6 py-4">{student.contact_number}</td>
              {/* <td className="px-6 py-4">07:21</td> */}
              <td className="px-6 py-4">Test</td>
            </tr>
          ))}
        {students && students.length === 0 && (
          <tr className="border-b cursor-pointer bg-white hover:bg-green-50">
            <td colSpan={4} className="px-6 py-4 text-center">
              No students to show
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
