import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import ErrorModal from "./ErrorModal";
import { CHECKBOX_DEFAULT_STYLE } from "../../constants/Constant";

export default function StudentListModal({
  toggleModal,
  addExisitingStudents,
  currentSemesterId,
  currentSemester,
}) {
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [selectedStudentList, setSelectedStudentList] = useState([]);
  const [studentListExist, setStudentListExist] = useState([]);
  const [sortedStudents, setSortedStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const response = await axiosClient.get("/student");
        if (response.status === 200) {
          setStudentList(() => response.data);
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    };

    getAllStudents();
  }, []);

  const toggleCheckbox = (checked, studentId) => {
    if (checked) {
      setSelectedStudentList(() => [...selectedStudentList, studentId]);
    } else {
      const newStudentIds = selectedStudentList.filter(
        (id) => id !== studentId
      );
      setSelectedStudentList(() => newStudentIds);
    }
  };

  const toggleCheckAll = (checked) => {
    if (checked) {
      const currentSelected = [];
      for (const student of studentList) {
        if (!studentListExist.includes(student._id)) {
          currentSelected.push(student._id);
        }
      }
      setSelectedStudentList(() => currentSelected);
    } else {
      setSelectedStudentList(() => []);
    }
  };

  const handleAddStudents = () => {
    if (selectedStudentList) {
      addExisitingStudents(selectedStudentList);
      setStudentListExist(() => selectedStudentList);
    }
  };

  const handleCancel = () => {
    toggleModal(false);
  };

  useEffect(() => {
    const list = [];
    for (const student of currentSemester.students) {
      list.push(student.student_id);
    }
    setStudentListExist(() => list);
  }, [currentSemester]);

  useEffect(() => {
    if (!search) {
      setSortedStudents(() => []);
      return;
    }
    const searchValue = search.toLocaleLowerCase()
    const searchedStudentsList = studentList.filter((student) => {
      if (
        student.first_name.toLowerCase().includes(searchValue) ||
        student.middle_name.toLowerCase().includes(searchValue) ||
        student.last_name.toLowerCase().includes(searchValue) ||
        student.school_id.toLowerCase().includes(searchValue)
      ) {
        return student;
      }
    });
    setSortedStudents(() =>
      searchedStudentsList.sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      )
    );
  }, [search]);

  return (
    <div
      className="fixed inset-0 flex items-center px-4 justify-center modal-backdrop bg-opacity-50 bg-gray-50"
      style={{ minHeight: "100vh" }}
    >
      <div className="modal w-full md:w-8/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header border-b px-4 py-3 mt-4">
          <p className="text-lg uppercase">Add Students</p>
        </header>

        <main className="px-4 max-h-96 overflow-y-auto">
          <div className="px-2 flex mt-3 py-2 w-full bg-gray-100 rounded-md">
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="text"
              className="w-full outline-none bg-gray-100"
              placeholder="Search student"
            />
            <img src="/img/search.svg" alt="" />
          </div>
          <div className="w-full flex mt-4 border-t">
            <p className="w-full text-center">Name</p>
            <p className="w-full text-center">LRN</p>
          </div>
          <ul className="my-6">
            {sortedStudents.length > 0 && (
              <li className="px-2 py-1 flex space-x-3">
                <input
                  onChange={(e) => toggleCheckAll(e.target.checked)}
                  type="checkbox"
                  className={`${CHECKBOX_DEFAULT_STYLE}`}
                />
                <p className="text-sm mt-1">Check All</p>
              </li>
            )}
            {studentList.length > 0 &&
              sortedStudents.map((student, index) => (
                <li
                  key={student._id}
                  className={
                    "flex items-center border-b space-x-4 cursor-pointer px-2 py-1 text-gray-900 rounded-sm hover:bg-green-50 "
                  }
                >
                  <div className="w-full flex space-x-4">
                    <input
                      onChange={(e) =>
                        toggleCheckbox(e.target.checked, student._id)
                      }
                      checked={selectedStudentList.includes(student._id)}
                      type="checkbox"
                      className={`${CHECKBOX_DEFAULT_STYLE}`}
                      disabled={studentListExist.includes(student._id)}
                    />
                    <p
                      className={
                        studentListExist.includes(student._id)
                          ? "inline-block mt-1 text-gray-400"
                          : "inline-block mt-1"
                      }
                    >
                      {student.last_name}, {student.first_name}{" "}
                      {student.middle_name !== "N/A"
                        ? student.middle_name[0].toUpperCase() + "."
                        : ""}
                      {student.suffix !== "N/A" ? ` ${student.suffix}` : ""}
                    </p>
                  </div>
                  <div className="w-full flex justify-center space-x-4">
                    <p
                      className={
                        studentListExist.includes(student._id)
                          ? "inline-block mt-1 text-gray-400"
                          : "inline-block mt-1"
                      }
                    >
                      {student.school_id}
                    </p>
                  </div>
                </li>
              ))}

            {studentList && studentList.length === 0 && (
              <li>
                <p className="text-center text-xl text-gray-400">
                  No students yet.
                </p>
              </li>
            )}
          </ul>
        </main>

        <footer className="modal-footer p-4 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-2 uppercase flex py-2 text-sm rounded-md border border-gray-900 hover:bg-gray-100 text-gray-900"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleAddStudents}
            className={
              !selectedStudentList.length
                ? "px-2 uppercase flex py-2 text-sm rounded-md cursor-not-allowed text-gray-700 bg-gray-200"
                : "px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
            }
            type="submit"
            form="semester-form"
            disabled={!selectedStudentList.length}
          >
            Add Students
          </button>
        </footer>
      </div>
      {errorModalMessage && <ErrorModal title={errorModalMessage} />}
    </div>
  );
}
