import "./styles.css";
import Grid from "./componets/grid";
import Input from "./componets/Input"
import useApiHook from "./hook/useWikiApiHook"
import React, { useState, useEffect, useRef } from "react";
import {Wiki} from "./models/models"
import { Flex, Layout,  Row, Col } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#BACCC1',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#8C866C',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#BB9C75',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(50% - 8px)',
};

const App: React.FC = () => {

  // 2024/07/06
  // en
  const [date, setDate] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [inputHasError, setInputHasError] = useState<boolean>(true);
  // const [appMounted, setAppMounted] = useState<boolean>(false);
  // const hasFetched = useRef(false);

  // const [data, setData] = useState<Wiki[] | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>("");

  const { data, loading, error, fetchData } = useApiHook<Wiki[]>(
    `http://localhost:3001/feed?language=${language}&date=${date}`,
    { timeout: 20000 } 
  );

  // useEffect(() => {
  //   setAppMounted(true);
  // }, []);


  const handleSubmit = () => {
    if (!inputHasError) {
      fetchData();
    }
  };

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
    <Flex gap="middle" wrap>
      <Layout style={layoutStyle}>
        <Header className="styled-header" style={headerStyle}>      
          <Row justify="space-between" align="middle">
            <Col>
              <img src="/path/to/your/image.png" alt="Logo" className="header-logo" />
            </Col>
            <Col>
              <h1 className="header-title">Welcome to WikiViewer</h1>
            </Col>
          </Row>
        </Header>
        <Content style={contentStyle}>
          <Input date={date} setDate={setDate} language={language} setLanguage={setLanguage} setHasError={setInputHasError} onSubmit={handleSubmit} />
          {loading? <div>Loading...</div>: <div></div>}
          {error !== null ? <div>There is an error: {error}</div>: <div></div>}
          {error === null && !loading && data? <Grid items={data}></Grid>: <div></div>}
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Flex>
  </div>
  );
}

export default App;