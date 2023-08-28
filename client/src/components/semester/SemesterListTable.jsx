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
    <table className="w-full overflow-x-auto text-sm text-left mx-auto">
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
              className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
            >
              <th
                onClick={() => {
                  setShowStudentList(true);
                  setShowSudentSemesterId(() => semester._id);
                }}
                scope="row"
                className="px-6 py-4 font-medium"
              >
                {semester.section}
              </th>
              <td
                onClick={() => {
                  setShowStudentList(true);
                  setShowSudentSemesterId(() => semester._id);
                }}
                className="px-6 py-4"
              >
                {semester.semester}
                {semester.semester === "1" ? "st Semester" : "nd Semester"}
              </td>
              <td
                onClick={() => {
                  setShowStudentList(true);
                  setShowSudentSemesterId(() => semester._id);
                }}
                className="px-6 py-4"
              >
                {semester.start_year} - {semester.end_year}
              </td>
              <td
                onClick={() => {
                  setShowStudentList(true);
                  setShowSudentSemesterId(() => semester._id);
                }}
                className="px-6 py-4"
              >
                {semester.track}
              </td>
              <td
                onClick={() => {
                  setShowStudentList(true);
                  setShowSudentSemesterId(() => semester._id);
                }}
                className="px-6 py-4"
              >
                {semester.strand}
              </td>
              <td
                onClick={() => {
                  setShowStudentList(true);
                  setShowSudentSemesterId(() => semester._id);
                }}
                className="px-6 py-4"
              >
                {semester.grade_level}
              </td>
              <td className="px-6 py-4 flex justify-between">
                {semester.active ? (
                  <p className="mt-2">
                    <span className="p-1 font-semibold text-xs rounded-md bg-green-300">
                      Active
                    </span>
                  </p>
                ) : (
                  <p className="mt-2">
                    <span className="p-1 font-semibold text-xs rounded-md bg-red-300">
                      Inactive
                    </span>
                  </p>
                )}
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
                    className="origin-top-right absolute right-0 mr-20 mt-4 w-44 z-10 rounded-md shadow-lg"
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
