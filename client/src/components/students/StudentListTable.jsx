import React from "react";

export default function StudentListTable() {
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
          <th scope="col" className="px-6 py-3">
            Grade
          </th>
          <th scope="col" className="px-6 py-3">
            Contact
          </th>
          <th scope="col" className="px-6 py-3">
            QR
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b cursor-pointer bg-white hover:bg-green-50">
          <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
            2323
          </th>
          <td className="px-6 py-4">Franz Jeff Dignos</td>
          <td className="px-6 py-4">01-03-23</td>
          <td className="px-6 py-4">07:21</td>
          <td className="px-6 py-4">04:20</td>
        </tr>
      </tbody>
    </table>
  );
}
