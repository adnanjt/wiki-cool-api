import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/grid.css";

const Grid = () => {
  const itemsPerPage = 5;
  interface Item {
    id: number;
    name: string;
  }
  const items: Item[] = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
    { id: 6, name: "Item 6" },
    { id: 7, name: "Item 7" },
    { id: 8, name: "Item 8" },
    { id: 9, name: "Item 9" },
    { id: 10, name: "Item 10" },
    { id: 11, name: "Item 11" },
    { id: 12, name: "Item 12" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // const callWikiApi = async (language: string, date: string) => {
  //   try {
  //     const { data } = await axios.post(
  //       "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCf0Xy0OnhxlduyEt3K8zP-sOuu-l_u6uA",
  //       {
  //         q: input,
  //         target: languageCode,
  //       },
  //       { cancelToken: cancelToken.token }
  //     );

  //     return data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   return {};
  // };

  const [date, setDate] = useState<string>("2024/07/06");
  const [language, setLanguage] = useState<string>("en");
  const [dateError, setDateError] = useState<string>("");
  const [languageError, setLanguageError] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (dateRegex.test(value)) {
      setDate(value);
      setDateError("");
    } else {
      setDateError("Date must be in format YYYY/MM/DD");
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    if (value === "en" || value === "es") {
      setLanguage(value);
      setLanguageError("");
    } else {
      setLanguageError("Language must be either 'en' or 'es'");
    }
  };


  return (
    <div>
      <div className="wiki-inputs">
        <div className="input-container">
          {dateError && <div className="error-message">{dateError}</div>}
          <label htmlFor="date">Date (YYYY/MM/DD): </label>
          <input
            type="text"
            id="date"
            value={date}
            onChange={handleDateChange}
            className={`input-field ${dateError ? "error" : ""}`}
          />
        </div>
        <div className="input-container">
          {languageError && <div className="error-message">{languageError}</div>}
          <label htmlFor="language">Language (en or es): </label>
          <input
            type="text"
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className={`input-field ${languageError ? "error" : ""}`}
          />
        </div>

      </div>


      <div
        className="grid-container"
        style={{ gridTemplateColumns: `repeat(3, 1fr)` }}
      >
        {currentItems.map((item, index) => (
          <div key={index} className="grid-item">
            {<div>{item.name}</div>}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Grid;
