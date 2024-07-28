import React, { useState, useEffect  } from "react";
import "../styles/grid.css";
import { Layout, Flex, Button, Input as AntInput, Select, Space, DatePicker, Tooltip } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface InputProps {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  setHasError: (hasError: boolean) => void;
  onSubmit: () => void;
}

const Input: React.FC<InputProps> = ({ date, setDate, language, setLanguage, setHasError, onSubmit  }) => {
  const [dateError, setDateError] = useState<string>("");
  const [languageError, setLanguageError] = useState<string>("");

  useEffect(() => {
    setHasError(!!dateError || !!languageError);
  }, [dateError, languageError, setHasError]);

  // const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  // };

  const handleDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    // console.log(date, dateString);
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    setDate(dateString as string);
    if (dateRegex.test(dateString as string)) {
      setDateError("");
    } else {
      setDateError("Date must be in format YYYY/MM/DD");
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const languageCodes = [
      "bn", "de", "el", "en", "he", "hu", "ja", "la", "sd", "sv", "ur", "zh",
      "bs", "da", "es", "fi", "fr", "ko", "no", "pl", "pt", "ru", "sco", "vi",
      "ar"
    ];

    const value = event.target.value.toLowerCase();
    setLanguage(value);
    if (languageCodes.includes(value) || value ==="") {
      setLanguageError("");
    } else {
      setLanguageError("Language must be Supported by Wikipedia.");
    }
  };

  const handleSubmit = () => {
    if (!dateError && !languageError) {
      onSubmit();
    }
  };
// Todo figure out want languages are suported and translatable so I can just autocomplete the input maybe ? 
  return (
    <div>
      <Flex>
        <Tooltip title="Select a date and language to find featured content on Wikipedia">
          <QuestionCircleOutlined style={{ fontSize: '24px', color: 'white', marginRight: '20px', marginLeft: '20px' }} />
        </Tooltip>
      

        <Space direction="vertical" size="middle">
          <Space.Compact size="large">
            <DatePicker style={{ width: '100%' }} type="text" id="date"
              format="YYYY/MM/DD" 
              onChange={handleDateChange}
              // className={`${dateError ? "error" : ""}`} 
              placeholder="(YYYY/MM/DD)" />
              {dateError && <div className="error-message">{dateError}</div>}
            <AntInput type="text"
              id="language"
              maxLength={2}
              value={language}
              onChange={handleLanguageChange}
              className={`input-field ${languageError ? "error" : ""}`} placeholder="Language: en" />
              {languageError && <div className="error-message">{languageError}</div>}
            <Button type="primary" className="submit-button" onClick={handleSubmit} disabled={!!dateError || !!languageError}>
              Submit
            </Button>
          </Space.Compact>
        </Space>
      </Flex>
    </div>
    
  );
};

export default Input;
