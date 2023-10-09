import React, { useEffect, useState } from "react";
import Header from "../../components/header-text/Header";
import CreateSemesterModal from "../../components/modals/CreateSemesterModal";
import axiosClient from "../../utils/AxiosClient";
import { useNavigate } from "react-router-dom";
import SemesterListTable from "../../components/SemesterListTable";

export default function Students() {
  const [semesterList, setSemesterList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const navigate = useNavigate();

  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const handleShowSemesterModal = (value) => setShowSemesterModal(() => value);

  useEffect(() => {
    getAllSemester();
  }, []);

  const getAllSemester = async () => {
    try {
      const response = await axiosClient.get("/semester");
      if (response.status === 200) {
        setSemesterList(() => response.data);
        setPaginationData({
          current_page: response.data.currentPage,
          last_page: response.data.totalPages,
        });
      }
    } catch (error) {}
  };

  const handlePageChange = async (newPage) => {
    setPaginationData({ ...paginationData, current_page: newPage });
    try {
      const response = await axiosClient.get(`/semester?page=${newPage}`);
      if (response.status === 200) {
        setSemesterList(() => response.data);
        setPaginationData({
          current_page: response.data.currentPage,
          last_page: response.data.totalPages,
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigateAttendance = (semesterId) => {
    navigate(`/student/semester/${semesterId}`);
  };

  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex">
        <div className="py-12 px-6 lg:px-12 w-full space-y-3">
          <div className="flex justify-between">
            <Header title="Semesters" />
            <div>
              <button
                onClick={() => setShowSemesterModal(true)}
                className="px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
              >
                {" "}
                <span className="me-1">
                  <img src="/img/plus.svg" alt="" />
                </span>
                Create Semester
              </button>
            </div>
          </div>
          <SemesterListTable
            semesterList={semesterList}
            paginationData={paginationData}
            navigate={navigateAttendance}
            handlePageChange={handlePageChange}
            setSemesterList={setSemesterList}
            setPaginationData={setPaginationData}
          />

          {showSemesterModal && (
            <div className="mx-auto">
              <CreateSemesterModal
                toggleModal={handleShowSemesterModal}
                setSemesterList={setSemesterList}
                getAllSemester={getAllSemester}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
