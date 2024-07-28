import React, { useEffect, useState } from "react";
// import axios from "axios";
import "../styles/grid.css";
import {Wiki} from "../models/models"
import { Card } from 'antd';
import WikiCard from './WikiCard'

interface InputProps {
  items: Wiki[] | null;
}

const tabListNoTitle = [
  {
    key: 'tfa',
    label: 'featured article',
  },
  {
    key: 'mostread',
    label: `day most read`,
  },
  {
    key: 'image',
    label: 'featured image',
  },
  {
    key: 'news',
    label: 'news',
  },
  {
    key: 'onthisday',
    label: 'events',
  },
];



const Grid: React.FC<InputProps> = ({ items }) => {
  // const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1');
  const [activeTabKey2, setActiveTabKey2] = useState<string>('mostread');

  // const onTab1Change = (key: string) => {
  //   setActiveTabKey1(key);
  // };
  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
  };





  // const getContentForTap: DatePickerProps['onChange'] = (date, dateString) => {
  //   // console.log(date, dateString);
  //   const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  //   setDate(dateString as string);
  //   if (dateRegex.test(dateString as string)) {
  //     setDateError("");
  //   } else {
  //     setDateError("Date must be in format YYYY/MM/DD");
  //   }
  // };
  // tabListNoTitle[1]["key"]

  const getContentForTap = (tapKey: string): JSX.Element => {
    console.log(tapKey)
    // const items
    const itemsPerPage = 5;


    const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    const categorizedItems = items? items.filter((item) => item.type === tapKey): []
    
    const totalPages = categorizedItems? Math.ceil(categorizedItems.length / itemsPerPage): 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = categorizedItems? categorizedItems.slice(startIndex, endIndex) : [];
    
    const handlePrevious = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
  
    const handleNext = () => {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    return (
      <>
        <div
          className="grid-container"
          style={{ gridTemplateColumns: `repeat(3, 1fr)` }}
        >
          {currentItems
            .map((item, index) => (
              <div key={index}>
                <WikiCard
                  title={item.title}
                  description={item.description}
                  source={item.image?.source || "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                  contentUrl={item.contentUrl}
                  related={item.related? item.related: ""}
                />
              </div>
            ))}
          
        </div>
        <br/>
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
      </>
    );
  };


  const contentListNoTitle: Record<string, React.ReactNode> = {
    tfa: getContentForTap(tabListNoTitle[0]["key"]),
    mostread: getContentForTap(tabListNoTitle[1]["key"]),
    image: getContentForTap(tabListNoTitle[2]["key"]),
    news: getContentForTap(tabListNoTitle[3]["key"]),
    onthisday: getContentForTap(tabListNoTitle[4]["key"]),
  };


  return (
    <div>
      <>
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey2}
          tabBarExtraContent={<a href="#">More</a>}
          onTabChange={onTab2Change}
          tabProps={{
            size: 'middle',
          }}
        >
          {contentListNoTitle[activeTabKey2]}

        </Card>

      </>

      {/* <div
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
      </div> */}
    </div>
  );
};

export default Grid;
