import React from "react";

export default function SemesterListTable({
  semesters,
  setShowStudentList,
  setShowOptionMenu,
  setSeletedOptionIndex,
  showOptionMenu,
  selectedOptionIndex,
  handleEditSemester,
  setShowSudentSemesterId,
}) {
  return (
    <table className="w-full text-sm text-left mx-auto">
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
              key={semester._id}
              className="border-b cursor-pointer bg-white hover:bg-green-50"
            >
              <th
                onClick={() => {
                  setShowStudentList(true);
                  setShowSudentSemesterId(() => semester._id);
                }}
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap hover:underline"
              >
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
                <p
                  className={
                    semester.active
                      ? "font-semibold text-green-700"
                      : "font-semibold text-red-500"
                  }
                >
                  {semester.active ? "Active" : "Inactive"}
                </p>
                <img
                  onClick={() => {
                    setShowOptionMenu(true);
                    setSeletedOptionIndex(index);
                  }}
                  className="inline-block"
                  src="/img/dots_option.svg"
                  alt=""
                />
                {showOptionMenu && index === selectedOptionIndex && (
                  <div
                    onMouseLeave={() => setShowOptionMenu(false)}
                    className="origin-top-right absolute ml-4 mt-2 w-44 z-10 rounded-md shadow-lg"
                  >
                    <div className="rounded-md border shadow-xs text-start bg-white">
                      <div
                        onClick={() => handleEditSemester(semester._id)}
                        className="p-3 flex space-x-3 hover:bg-gray-100"
                      >
                        <img src="/img/edit.svg" alt="" />
                        <p className="me-4">Edit</p>
                      </div>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}

        {semesters && semesters.length === 0 && (
          <tr>
            <td
              colSpan={6}
              className="px-6 py-4 text-center border-b cursor-pointer bg-white"
            >
              No semesters to show.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
