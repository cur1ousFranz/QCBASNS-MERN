import React, { useState } from "react";

export default function Search({ handleSearch }) {
  const [search, setSearch] = useState("");

  const handleClickSearch = (e) => {
    e.preventDefault();
    handleSearch(search);
  };
  return (
    <form
      onSubmit={handleClickSearch}
      className="flex pl-2 rounded-md bg-gray-100"
    >
      <input
        onClick={(e) => {
          setSearch(e.target.value);
        }}
        type="text"
        className="px-2 py-1 focus:outline-none bg-gray-100"
        placeholder="Search semester"
      />
      <button className="px-2 cursor-pointer hover:bg-gray-200">
        <img onClick={handleClickSearch} src="/img/search.svg" alt="" />
      </button>
    </form>
  );
}
