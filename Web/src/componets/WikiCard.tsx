import React from 'react';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;

interface WikiCardProps {
  title: string;
  description: string;
  source: string;
}

const WikiCard: React.FC<WikiCardProps> = ({title, description,  source}) => (
  <>
    <Card
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
    
  </Card>
  </>
);

export default WikiCard;
