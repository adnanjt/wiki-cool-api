import React, { useState } from 'react';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Tag } from 'antd';

const { Meta } = Card;

interface WikiCardProps {
  title: string;
  description: string;
  source: string;
  contentUrl: string;
}
// TODO 
const WikiCard: React.FC<WikiCardProps> = ({title, description,  source, contentUrl}) => 
  {
    const [read, setRead] = useState(false);
    // event: React.MouseEvent<HTMLAnchorElement>
    const handleLanguageChange = (): void => {
    // const value: string = (event.target as HTMLAnchorElement).getAttribute('data-language')?.toLowerCase() || '';

      if(!read) {
        setRead(true);
      }
    };

    // const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //   const value: string = event.target.value.toLowerCase();
    //   setLanguage(value);
      
    //   if (languageCodes.includes(value)) {
    //     if (value === "en" || value === "es") {
    //       setLanguageError("");
    //     } else {
    //       setLanguageError("Language must be either 'en' or 'es'");
    //     }
    //   } else {
    //     setLanguageError("Invalid language code");
    //   }
    // };
    
    return (<>
      <Card
      hoverable
      style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src={source}
        />
      }
      actions={[
        <SettingOutlined key="setting" />,
        // <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
        title={title}
        description={description}
      />
      <div><a href={contentUrl} target="_blank" rel="noopener noreferrer" onClick={handleLanguageChange}  >Read more</a> {read && <Tag color="lime" id={`read-` + title} bordered={false}>read</Tag>}</div>
      
      
    </Card>
    </>)
  }
;

export default WikiCard;
