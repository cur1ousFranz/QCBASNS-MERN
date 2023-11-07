import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PATHNAME } from "../../constants/Constant";
import axiosClient from "../../utils/AxiosClient";
import UpperCaseWords from "../../utils/UpperCaseWords";
import ROLE from "../../utils/Role";

export default function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, dispatch } = useContext(AuthContext);

  const location = useLocation();
  const [adviser, setAdviser] = useState(null);
  const [subTeacher, setSubTeacher] = useState(null);
  const [currentPath, setCurrentPath] = useState("");

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setShowProfileDropdown(false);
    localStorage.removeItem("user");
    setAdviser(null)
    setSubTeacher(null)
  };

  useEffect(() => {
    if (user && user.role === ROLE.ADVISER) {
      const getAdviser = async () => {
        try {
          const response = await axiosClient.get("/adviser");
          if (response.status === 200) {
            setAdviser(() => response.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getAdviser();
    }

    if (user && user.role === ROLE.SUBJECT_TEACHER) {
      const getSubTeacher = async () => {
        try {
          const response = await axiosClient.get("/subject/teacher");
          if (response.status === 200) {
            setSubTeacher(() => response.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getSubTeacher();
    }
  }, [user]);

  useEffect(() => {
    const url = location.pathname.trim().split("/");
    setCurrentPath(() => url[1]);
  }, [location]);

  const AdviserName = () => {
    if (adviser) {
      return (
        <h1 className="mt-2 text-sm font-semibold text-gray-600">
          {UpperCaseWords(adviser.first_name)}{" "}
          {adviser.middle_name !== "N/A"
            ? adviser.middle_name[0].toUpperCase() + "."
            : ""}{" "}
          {UpperCaseWords(adviser.last_name)}{" "}
          {adviser.suffix !== "N/A" ? adviser.suffix : ""}
        </h1>
      );
    }
  };

  return (
    <div className="py-2 px-12 border-b flex justify-between">
      <div className="flex">
        <Link to={"/"} className="p-0">
          <img src="/img/GSCNHS.png" className="object-fit w-1/2" alt="" />
        </Link>
        <div className="hidden mt-2 -ml-12 text-gray-700 md:block">
          <p className="text-xs">GENERAL SANTOS CITY NATIONAL HIGH SCHOOL</p>
          <p className="text-xs">304642</p>
          <p className="text-xs">Rizal Street, Barangay Calumpang, GSC </p>
        </div>
      </div>
      <div className="mt-4">
        {!user ? (
          <div className="space-x-6">
            <Link to={"/login"} className="text-lg">
              Login
            </Link>
            <Link to={"/register"} className="text-lg">
              Register
            </Link>
          </div>
        ) : (
          <div className="flex space-x-24">
            <div>
              {user && (
                <div className="hidden md:flex space-x-10 mt-0.5 uppercase text-gray-500">
                  <Link
                    to={"/attendance"}
                    className={`${
                      currentPath === PATHNAME.ATTENDANCE
                        ? "h-fit py-1 px-2 rounded-md text-white bg-green-400"
                        : "h-fit py-1 px-2 bg-white text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Attendance
                  </Link>
                  {user.role === ROLE.ADVISER && (
                    <>
                      <Link
                        to={"/student"}
                        className={`${
                          currentPath === PATHNAME.STUDENT
                            ? "h-fit py-1 px-2 rounded-md text-white bg-green-400"
                            : "h-fit py-1 px-2 bg-white text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        Student
                      </Link>
                      <Link
                        to={"/report"}
                        className={`${
                          currentPath === PATHNAME.REPORT
                            ? "h-fit py-1 px-2 rounded-md text-white bg-green-400"
                            : "h-fit py-1 px-2 bg-white text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        Report
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="flex space-x-3">
                {adviser && (
                  <h1 className="mt-2 text-sm font-semibold text-gray-600">
                    {adviser.first_name}{" "}
                    {adviser.middle_name !== "N/A"
                      ? adviser.middle_name[0].toUpperCase() + "."
                      : ""}{" "}
                    {adviser.last_name}{" "}
                    {adviser.suffix !== "N/A" ? adviser.suffix : ""}
                  </h1>
                )}
                {subTeacher && (
                  <h1 className="mt-2 text-sm font-semibold text-gray-600">
                    {subTeacher.subject}
                  </h1>
                )}
                <img
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  src="/img/person.svg"
                  className="cursor-pointer mt-1"
                  alt=""
                />
              </div>
              {showProfileDropdown && (
                <div
                  onMouseLeave={() => setShowProfileDropdown(false)}
                  className="origin-top-right absolute right-0 mr-12 mt-1 w-72 z-10 rounded-md shadow-lg"
                >
                  <div className="rounded-md border shadow-xs text-start bg-white">
                    {adviser && user.role === ROLE.ADVISER && (
                      <div className="flex px-3 py-2 border-b bg-gray-50">
                        <span className="mr-2 mt-1">
                          <img src="/img/person.svg" alt="" />
                        </span>
                        <AdviserName />
                      </div>
                    )}
                    {subTeacher && user.role === ROLE.SUBJECT_TEACHER && (
                      <div className="flex px-3 py-2 border-b bg-gray-50">
                        <span className="mr-2 mt-1">
                          <img src="/img/person.svg" alt="" />
                        </span>
                        {subTeacher.subject}
                      </div>
                    )}
                    {/* {user.role === ROLE.ADVISER && (
                      <div className="p-2 border-b hover:bg-gray-100">
                        <Link
                          to={"/subject/teacher"}
                          className="w-full flex text-gray-500 hover:text-gray-700"
                        >
                          <span className="mr-2 mt-1">
                            <img src="/img/person-gear.svg" alt="" />
                          </span>
                          Subject Teacher
                        </Link>
                      </div>
                    )} */}
                    <div className="p-2 hover:bg-gray-100">
                      <Link
                        to={"/"}
                        onClick={handleLogout}
                        className="w-full flex text-red-400 hover:text-red-600"
                      >
                        <span className="mr-2 mt-1">
                          <img src="/img/logout.svg" alt="" />
                        </span>
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
