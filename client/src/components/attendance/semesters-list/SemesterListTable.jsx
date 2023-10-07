import React from "react";
import { ATTENDANCE_TABLES } from "../../../constants/Constant";

export default function SemesterListTable({ semesters, toggleTable }) {
  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full overflow-x-auto text-sm text-left mx-auto border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Section
              </th>
              <th scope="col" className="px-6 py-3">
                Semester
              </th>
              <th scope="col" className="px-6 py-3">
                School Year
              </th>
              <th scope="col" className="px-6 py-3">
                Track
              </th>
              <th scope="col" className="px-6 py-3">
                Strand
              </th>
              <th scope="col" className="px-6 py-3">
                Grade Level
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {semesters &&
              semesters.map((semester, index) => (
                <tr
                onClick={() => toggleTable(ATTENDANCE_TABLES.ATTENDANCE, semester)}
                  key={semester._id}
                  className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
                >
                  <th scope="row" className="px-6 py-4 font-medium">
                    {semester.section}
                  </th>
                  <td className="px-6 py-4">
                    {semester.semester}
                    {semester.semester === "1" ? "st Semester" : "nd Semester"}
                  </td>
                  <td className="px-6 py-4">
                    {semester.start_year} - {semester.end_year}
                  </td>
                  <td className="px-6 py-4">{semester.track}</td>
                  <td className="px-6 py-4">{semester.strand}</td>
                  <td className="px-6 py-4">{semester.grade_level}</td>
                  <td className="px-6 py-4 flex justify-between">
                    {semester.active ? (
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

            {semesters && semesters.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center border-b cursor-pointer bg-white"
                >
                  No semesters to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-2">
          <h1 className="text-sm text-gray-600">Total: {semesters.length}</h1>
        </div>
      </div>
    </>
  );
}
