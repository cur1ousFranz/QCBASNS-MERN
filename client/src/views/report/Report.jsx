import React, { useEffect, useState } from "react";
import Header from "../../components/header-text/Header";
import axiosClient from "../../utils/AxiosClient";
import SemesterListTable from "../../components/SemesterListTable";
import { useNavigate } from "react-router-dom";
import LoadState from "../../components/header-text/LoadState";

export default function Report() {
  const navigate = useNavigate();
  const [semesterList, setSemesterList] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllSemester = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
          behavior: "smooth",
        });
      }
    } catch (error) {}
  };

  const navigateSemesterReport = (semesterId) => {
    navigate(`/report/semester/${semesterId}`);
  };

  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex max-w-full">
        <div className="p-12 w-full space-y-3">
          <Header title={`Semesters`} />
          <SemesterListTable
            semesterList={semesterList}
            paginationData={paginationData}
            navigate={navigateSemesterReport}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
      {isLoading && <LoadState />}
    </div>
  );
}
