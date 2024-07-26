import "./styles.css";
import Grid from "./componets/grid";
import Input from "./componets/Input"
import useApiHook from "./hook/useWikiApiHook"
import React, { useState, useEffect } from "react";
import {Wiki} from "./models/models"

const App: React.FC = () => {
  // 2024/07/06
  // en
  const [date, setDate] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [inputHasError, setInputHasError] = useState<boolean>(true);
  const [data, setData] = useState<Wiki[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    if(!inputHasError) {
      const { data, loading, error } = useApiHook<Wiki[]>(
        `http://localhost:3001/feed?language=${language}&date=${date}`,
        { timeout: 20000 } 
      );
      setData(data);
      setLoading(loading);
      setError(error);

    }


  }, [inputHasError, setData, setLoading, setError]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  // if (data) {
  //   return (
  //     <div>
  //       {data.map((post) => (
  //         <div key={post.id}>
  //           <h3>{post.title}</h3>
  //           <p>{post.body}</p>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  // return null;


  return (
    <div className="App">
      <h1>This is a web viewer for wikipedia</h1>
      <Input date={date} setDate={setDate} language={language} setLanguage={setLanguage} setHasError={setInputHasError} />
      {loading? <div>Loading...</div>: <div></div>}
      {error? <div>There is an error: {error}</div>: <div></div>}
      {!error && !loading && data? <Grid items={data}></Grid>: <div></div>}
      
    </div>
  );
}

export default App;
