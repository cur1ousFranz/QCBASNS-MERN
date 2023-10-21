import React, { useEffect, useState } from "react";
import Header from "../../components/header-text/Header";
import CreateSubjectTeacherModal from "../../components/modals/CreateSubjectTeacherModal";
import axiosClient from "../../utils/AxiosClient";

export default function SubjectTeacher() {
  const [showCreateSubjectTeachModal, setShowSubjectTeacherModal] =
    useState(false);
  const [subjectTeachers, setSubjectTeachers] = useState([]);

  useEffect(() => {
    getAdviserSubjectTeacher();
  }, []);

  const getAdviserSubjectTeacher = async () => {
    try {
      const response = await axiosClient.get("/adviser/subject/teacher");
      if (response.status === 200) {
        setSubjectTeachers(() => response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-12 bg-slate-50" style={{ minHeight: "100vh" }}>
      <div className="flex">
        <div className="px-6 lg:px-12 w-full space-y-3">
          <div className="flex justify-between">
            <Header title="Subject Teachers" />
            <button
              onClick={() => setShowSubjectTeacherModal(true)}
              className="px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
            >
              {" "}
              <span className="me-2">
                <img src="/img/person-plus.svg" alt="" />
              </span>
              New
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full overflow-x-auto text-sm text-left mx-auto overflow-y-auto border">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  {/* <th scope="col" className="px-6 py-3">
                    Password
                  </th>
                  <th scope="col" className="px-4 py-3"></th> */}
                </tr>
              </thead>
              <tbody className="relative">
                {subjectTeachers &&
                  subjectTeachers.map((sub, index) => (
                    <tr
                      key={sub + index}
                      className="border-b cursor-pointer bg-white hover:bg-green-50"
                    >
                      <td className="px-6 py-4">{sub.subject}</td>
                      <td className="px-6 py-4">{sub.user.email}</td>
                    </tr>
                  ))}
                {subjectTeachers && subjectTeachers.length === 0 && (
                  <tr className="border-b cursor-pointer bg-white">
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No subject teachers to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showCreateSubjectTeachModal && (
        <CreateSubjectTeacherModal
          toggleModal={setShowSubjectTeacherModal}
          getAdviserSubjectTeacher={getAdviserSubjectTeacher}
        />
      )}
    </div>
  );
}
