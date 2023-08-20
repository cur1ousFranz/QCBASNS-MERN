import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import Header from "../components/header-text/Header";
import CreateSemesterModal from "../components/modals/CreateSemesterModal";
import axiosClient from "../utils/AxiosClient";
import { SemesterContext } from "../context/SemesterContext";
import EditSemesterModal from "../components/modals/EditSemesterModal";

export default function Students() {
  const location = useLocation();
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const { semesters, dispatch } = useContext(SemesterContext);
  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(null);
  const [selectedSemesterId, setSelecteSemesterId] = useState(null);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(false);

  const handleShowSemesterModal = (value) => setShowSemesterModal(() => value);

  useEffect(() => {
    const getAllSemester = async () => {
      try {
        const response = await axiosClient.get("/semester");
        if (response.status === 200) {
          dispatch({ type: "SET_SEMESTERS", payload: response.data });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllSemester();
  }, []);

  const handleEditSemester = async (semesterId) => {
    setSelecteSemesterId(() => semesterId);
    setShowEditSemesterModal(true);
  };

  const toggleEditSemesterModal = (value) => setShowEditSemesterModal(value);

  return (
    <div className="w-full">
      <div className="flex">
        <Sidebar menu={location.pathname} />
        <div className="p-12 w-10/12 space-y-6">
          {/* <Header title={`Students`} /> */}
          <div className="flex">
            <button
              onClick={() => setShowSemesterModal(true)}
              className="px-2 py-2 text-sm rounded-md text-gray-700 bg-green-400"
            >
              Create Semester
            </button>
          </div>
          <div>
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
                    Track
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Strand
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Grade Level
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
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap"
                      >
                        {semester.section}
                      </th>
                      <td className="px-6 py-4">
                        {semester.semester}
                        {semester.semester === 1
                          ? "st Semester"
                          : "nd Semester"}
                      </td>
                      <td className="px-6 py-4">{semester.track}</td>
                      <td className="px-6 py-4">{semester.strand}</td>
                      <td className="px-6 py-4 flex justify-between">
                        <p>Grade {semester.grade_level}</p>
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
                    <td colSpan={5} className="px-6 py-4">
                      No semesters to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showSemesterModal && (
            <div className="mx-auto">
              <CreateSemesterModal toggleModal={handleShowSemesterModal} />
            </div>
          )}

          {showEditSemesterModal && (
            <div className="mx-auto">
              <EditSemesterModal
                toggleModal={toggleEditSemesterModal}
                semesterId={selectedSemesterId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
