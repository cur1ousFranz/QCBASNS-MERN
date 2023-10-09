import React, { useEffect, useState } from "react";
import Header from "../../components/header-text/Header";

import SemesterListTable from "../../components/SemesterListTable";
import axiosClient from "../../utils/AxiosClient";
import { useNavigate } from "react-router-dom";

export default function Attendance() {
  const [semesterList, setSemesterList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
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
      } catch (error) {
        console.log(error);
      }
    };

    getAllSemester();
  }, []);

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
          behavior: "smooth", // This adds a smooth scrolling animation
        });
      }
    } catch (error) {}
  };

  const navigateAttendance = (semesterId) => {
    navigate(`/attendance/semester/${semesterId}`);
  };

  // const handleSearch = async (searchInput) => {
  //   console.log(searchInput);
  // };

  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex">
        <div className="py-12 px-6 lg:px-12 w-full space-y-3">
          <Header title={`Semesters`} />
          <SemesterListTable
            semesterList={semesterList}
            paginationData={paginationData}
            navigate={navigateAttendance}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
