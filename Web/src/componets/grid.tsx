import React, { useEffect, useState } from "react";
// import axios from "axios";
import "../styles/grid.css";
import {Wiki} from "../models/models"
import { Card } from 'antd';
import WikiCard from './WikiCard'

interface InputProps {
  items: Wiki[] | null;
}

const tabList = [
  {
    key: 'tab1',
    tab: 'tab1',
  },
  {
    key: 'tab2',
    tab: 'tab2',
  },
];

const contentList: Record<string, React.ReactNode> = {
  tab1: <p>content1</p>,
  tab2: <p>content2</p>,
};

const tabListNoTitle = [
  {
    key: 'article',
    label: 'article',
  },
  {
    key: 'app',
    label: 'app',
  },
  {
    key: 'project',
    label: 'project',
  },
];



const Grid: React.FC<InputProps> = ({ items }) => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1');
  const [activeTabKey2, setActiveTabKey2] = useState<string>('app');

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
  };


  const itemsPerPage = 5;


  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  
  
  const totalPages = items? Math.ceil(items.length / itemsPerPage): 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items? items.slice(startIndex, endIndex) : [];

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };


  const contentListNoTitle: Record<string, React.ReactNode> = {
    article: <><div
    className="grid-container"
    style={{ gridTemplateColumns: `repeat(3, 1fr)` }}
  >
    {currentItems.map((item, index) => (
      <div key={index} className="grid-item">
        {<> <WikiCard title={item.title} description={item.description} source={item.image?.source? item.image.source: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}/></>}
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
  </div></>,
    app: <p>app content</p>,
    project: <p>project content</p>,
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
