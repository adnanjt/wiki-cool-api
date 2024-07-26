import React, { useEffect, useState } from "react";
// import axios from "axios";
import "../styles/grid.css";
import {Wiki} from "../models/models"

interface InputProps {
  items: Wiki[];
}

const Grid: React.FC<InputProps> = ({ items }) => {
  const itemsPerPage = 5;


  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  
  
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




  return (
    <div>
      <div
        className="grid-container"
        style={{ gridTemplateColumns: `repeat(3, 1fr)` }}
      >
        {currentItems.map((item, index) => (
          <div key={index} className="grid-item">
            {<div>{item.title}</div>}
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
