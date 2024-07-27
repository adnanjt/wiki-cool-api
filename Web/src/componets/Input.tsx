import React, { useState, useEffect  } from "react";
import "../styles/grid.css";
import { Layout, Flex } from "antd";
import { Input as AntInput } from "antd";

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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    setDate(value);
    if (dateRegex.test(value)) {
      setDateError("");
    } else {
      setDateError("Date must be in format YYYY/MM/DD");
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setLanguage(value);
    if (value === "en" || value === "es") {
      setLanguageError("");
    } else {
      setLanguageError("Language must be either 'en' or 'es'");
    }
  };

  const handleSubmit = () => {
    if (!dateError && !languageError) {
      onSubmit();
    }
  };

  return (
    <div>
      <Flex>
      <div className="wiki-inputs">
        <div className="input-container">
          <label htmlFor="date">Date (YYYY/MM/DD): </label>
          <AntInput
            type="text"
            id="date"
            value={date}
            onChange={handleDateChange}
            className={`input-field ${dateError ? "error" : ""}`}
          />
          {dateError && <div className="error-message">{dateError}</div>}
        </div>
        <div className="input-container">
          <label htmlFor="language">Language (en or es): </label>
          <AntInput
            type="text"
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className={`input-field ${languageError ? "error" : ""}`}
          />
          {languageError && <div className="error-message">{languageError}</div>}
        </div>
        <div className="input-container" >
          <button className="submit-button" onClick={handleSubmit} disabled={!!dateError || !!languageError}>
            Submit
          </button>
        </div>
      </div>
      </Flex>
    </div>
    
  );
};

export default Input;
