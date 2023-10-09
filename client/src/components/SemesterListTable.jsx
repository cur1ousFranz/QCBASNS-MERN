import React, { useState } from "react";
import Pagination from "./layouts/Pagination";
import EditSemesterModal from "./modals/EditSemesterModal";
import { useLocation } from "react-router-dom";

export default function SemesterListTable({
  semesterList,
  paginationData,
  navigate,
  handlePageChange,
  setSemesterList,
  setPaginationData,
}) {
  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(null);
  const [selectedSemesterId, setSelecteSemesterId] = useState(null);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const handleEditSemester = async (semesterId) => {
    setSelecteSemesterId(() => semesterId);
    setShowEditSemesterModal(true);
  };

  const toggleEditSemesterModal = (value) => setShowEditSemesterModal(value);

  return (
    <>
      <div className="overflow-y-auto">
        <table className="w-full overflow-x-auto text-sm text-left mx-auto border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                School Year
              </th>
              <th scope="col" className="px-6 py-3">
                Semester
              </th>
              <th scope="col" className="px-6 py-3">
                Track
              </th>
              <th scope="col" className="px-6 py-3">
                Strand
              </th>
              <th scope="col" className="px-6 py-3">
                Section
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
            {semesterList.semesters &&
              semesterList.semesters.map((semester, index) => (
                <tr
                  key={semester._id}
                  className="border-b whitespace-normal text-sm max-w-md overflow-ellipsis cursor-pointer bg-white hover:bg-green-50"
                >
                  <td
                    onClick={() => navigate(semester._id)}
                    className="px-6 py-4"
                  >
                    {semester.start_year} - {semester.end_year}
                  </td>
                  <td
                    onClick={() => navigate(semester._id)}
                    className="px-6 py-4"
                  >
                    {semester.semester}
                    {semester.semester === "1" ? "st Semester" : "nd Semester"}
                  </td>
                  <td
                    onClick={() => navigate(semester._id)}
                    className="px-6 py-4"
                  >
                    {semester.track}
                  </td>
                  <td
                    onClick={() => navigate(semester._id)}
                    className="px-6 py-4"
                  >
                    {semester.strand}
                  </td>
                  <th
                    onClick={() => navigate(semester._id)}
                    scope="row"
                    className="px-6 py-4 font-medium"
                  >
                    {semester.section}
                  </th>
                  <td
                    onClick={() => navigate(semester._id)}
                    className="px-6 py-4"
                  >
                    {semester.grade_level}
                  </td>
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
                    {currentPath === "/student" && (
                      <>
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
                      </>
                    )}
                  </td>
                </tr>
              ))}

            {semesterList &&
              semesterList.semesters &&
              semesterList.semesters.length === 0 && (
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
        <div className="mt-2 flex justify-between">
          <h1 className="text-sm text-gray-600">
            Total Pages: {semesterList.totalPages}
          </h1>
          {semesterList.totalPages > 1 && (
            <Pagination
              pagination={paginationData}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
      {showEditSemesterModal && (
        <div className="mx-auto">
          <EditSemesterModal
            toggleModal={toggleEditSemesterModal}
            semesterId={selectedSemesterId}
            setSemesterList={setSemesterList}
            setPaginationData={setPaginationData}
          />
        </div>
      )}
    </>
  );
}
