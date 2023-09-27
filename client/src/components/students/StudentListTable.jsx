import React, { useEffect, useState } from "react";
import QrCodeModal from "../modals/QrCodeModal";

export default function StudentListTable({
  toggleEditStudentModal,
  students,
  setSelectedStudentIdEdit,
  setSelecedStudentIdDetails,
  setShowStudentDetailsModal,
}) {
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(null);
  const [sortedStudents, setSortedStudents] = useState([]);

  useEffect(() => {
    if (students) {
      setSortedStudents(() =>
        students.sort((a, b) => a.last_name.localeCompare(b.last_name))
      );
    }
  }, [students]);

  const toggleQrCodeModal = (value = false) => setShowQrCodeModal(value);

  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full overflow-x-auto text-sm text-left mx-auto overflow-y-auto border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                LRN
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Suffix
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
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
            {sortedStudents &&
              sortedStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b cursor-pointer bg-white hover:bg-green-50"
                >
                  <th
                    onClick={() => {
                      setShowStudentDetailsModal(true);
                      setSelecedStudentIdDetails(() => student._id);
                    }}
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {student.school_id}
                  </th>
                  <td
                    onClick={() => {
                      setShowStudentDetailsModal(true);
                      setSelecedStudentIdDetails(() => student._id);
                    }}
                    className="px-6 py-4"
                  >
                    {student.last_name}, {student.first_name}{" "}
                    {student.middle_name !== "N/A"
                      ? student.middle_name[0].toUpperCase() + "."
                      : ""}
                  </td>
                  <td
                    onClick={() => {
                      setShowStudentDetailsModal(true);
                      setSelecedStudentIdDetails(() => student._id);
                    }}
                    className="px-6 py-4"
                  >
                    {student.suffix !== "N/A" ? student.suffix : ""}
                  </td>
                  <td
                    onClick={() => {
                      setShowStudentDetailsModal(true);
                      setSelecedStudentIdDetails(() => student._id);
                    }}
                    className="px-6 py-4"
                  >
                    {student.gender}
                  </td>
                  <td
                    onClick={() => {
                      setShowStudentDetailsModal(true);
                      setSelecedStudentIdDetails(() => student._id);
                    }}
                    className="px-6 py-4"
                  >
                    {student.contact_number !== "N/A" ? student.contact_number : ""}
                  </td>
                  <td className="relative px-6 py-4 flex justify-between">
                    <img
                      onClick={() => {
                        setSelectedStudentName(
                          () =>
                            `${student.first_name} ${
                              student.middle_name !== "N/A"
                                ? student.middle_name
                                : ""
                            } ${student.last_name}${
                              student.suffix !== "N/A"
                                ? ", " + student.suffix
                                : ""
                            }`
                        );
                        setSelectedStudent(() => student);
                        setShowQrCodeModal(true);
                      }}
                      src="/img/qrcode.svg"
                      alt=""
                    />
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
                        className="origin-top-right absolute right-0 mr-8 mt-2 w-44 z-10 rounded-md shadow-lg"
                      >
                        <div className="rounded-md border shadow-xs text-start bg-white">
                          <div
                            onClick={() => {
                              toggleEditStudentModal(true);
                              setSelectedStudentIdEdit(() => student._id);
                            }}
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
            {students && students.length === 0 && (
              <tr className="border-b cursor-pointer bg-white">
                <td colSpan={4} className="px-6 py-4 text-center">
                  No students to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {students && (
        <div className="mt-2">
          <h1 className="text-sm text-gray-600">Total: {students.length}</h1>
        </div>
      )}

      {showQrCodeModal && (
        <QrCodeModal
          toggleModal={toggleQrCodeModal}
          title={selectedStudentName}
          student={selectedStudent}
        />
      )}
    </>
  );
}
