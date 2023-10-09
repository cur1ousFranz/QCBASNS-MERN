/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";

function Pagination({ pagination, offset = 4, onChange }) {
  const pages = [];

  useEffect(() => {
    if (!pagination.to) {
      // Your pagination logic here
      let from = pagination.current_page - offset;
      if (from < 1) {
        from = 1;
      }

      let to = from + offset * 2;
      if (to >= pagination.last_page) {
        to = pagination.last_page;
      }

      for (let page = from; page <= to; page++) {
        pages.push(page);
      }
    }
  }, []);

  return (
    <ul className="flex list-reset space-x-3 border-gray-200 rounded font-sans">
      <li>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (pagination.current_page !== 1) {
              onChange(pagination.current_page - 1);
            }
          }}
          className={
            pagination.current_page !== 1
              ? "block px-3 py-1 rounded-sm bg-green-400 text-white"
              : "block px-3 py-1 rounded-sm bg-gray-300 text-white"
          }
        >
          Previous
        </a>
      </li>
      {pages.map((page) => (
        <li key={page}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChange(page);
            }}
            className={`block px-3 py-1 ${
              page === pagination.current_page
                ? "text-white border border-green-400"
                : "text-white hover:bg-green-400 border-r border-green-400"
            }`}
          >
            {page}
          </a>
        </li>
      ))}
      <li>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();

            if (pagination.current_page !== pagination.last_page) {
              onChange(pagination.current_page + 1);
            }
          }}
          className={
            pagination.current_page !== pagination.last_page
              ? "block px-3 py-1 rounded-sm bg-green-400 text-white"
              : "block px-3 py-1 rounded-sm bg-gray-300 text-white"
          }
        >
          Next
        </a>
      </li>
    </ul>
  );
}

export default Pagination;
