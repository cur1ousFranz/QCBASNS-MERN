import React, { useState } from "react";
import QrCodeModal from "../modals/QrCodeModal";

export default function StudentListTable({ students }) {
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showOptionMenu, setShowOptionMenu] = useState(false);
  const [selectedOptionIndex, setSeletedOptionIndex] = useState(null);

  const toggleQrCodeModal = (value = false) => setShowQrCodeModal(value);

  return (
    <>
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
            students.map((student, index) => (
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
                  {student.first_name} {student.middle_name} {student.last_name}
                </td>
                <td className="px-6 py-4">{student.contact_number}</td>
                {/* <td className="px-6 py-4">07:21</td> */}
                <td className="px-6 py-4 flex justify-between">
                  <img
                    onClick={() => {
                      setSelectedStudentName(
                        () =>
                          `${student.first_name} ${student.middle_name} ${student.last_name}`
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
                      className="origin-top-right absolute ml-4 mt-2 w-44 z-10 rounded-md shadow-lg"
                    >
                      <div className="rounded-md border shadow-xs text-start bg-white">
                        <div
                          // onClick={() => handleEditSemester(semester._id)}
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
