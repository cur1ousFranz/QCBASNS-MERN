import React from "react";
import { Link } from "react-router-dom";
import {
  PATHNAME,
  SELECTED_SIDEBAR_LIST_STYLE,
  SIDEBAR_LIST_STYLE,
} from "../../constants/Constant";

export default function Sidebar({ menu }) {
  return (
    <div className="h-screen w-52">
      {/* <button
        data-drawer-target="sidebar"
        data-drawer-toggle="sidebar"
        aria-controls="sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button> */}

      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
        <div className="py-6 flex justify-center">
          <img src="/img/logo.png" className="object-fit w-1/2" alt="" />
        </div>
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to={"/student"}
              className={
                menu === PATHNAME.STUDENT
                  ? SELECTED_SIDEBAR_LIST_STYLE
                  : SIDEBAR_LIST_STYLE
              }
            >
              <img src="/img/students.svg" alt="" />
              <span className="flex-1 ml-3 whitespace-nowrap">Students</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/attendance"}
              className={
                menu === PATHNAME.ATTENDANCE
                  ? SELECTED_SIDEBAR_LIST_STYLE
                  : SIDEBAR_LIST_STYLE
              }
            >
              <img src="/img/attendance.svg" alt="" />
              <span className="flex-1 ml-3 whitespace-nowrap">Attendance</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/report"}
              className={
                menu === PATHNAME.REPORT
                  ? SELECTED_SIDEBAR_LIST_STYLE
                  : SIDEBAR_LIST_STYLE
              }
            >
              <img src="/img/report.svg" alt="" />
              <span className="flex-1 ml-3 whitespace-nowrap">Report</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/message"}
              className={
                menu === PATHNAME.MESSAGE
                  ? SELECTED_SIDEBAR_LIST_STYLE
                  : SIDEBAR_LIST_STYLE
              }
            >
              <img src="/img/message.svg" alt="" />
              <span className="flex-1 ml-3 whitespace-nowrap">Message</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
