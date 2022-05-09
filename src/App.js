import styles from './App.module.scss';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Demo1 from './pages';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('购物流程', 'sub1', <MailOutlined />, [
    getItem(
      'Item 1',
      'g1',
      null,
      [getItem('示例 1', 'demo1'), getItem('示例 2', 'demo2')],
      'group'
    ),
    getItem(
      'Item 2',
      'g2',
      null,
      [getItem('Option 3', '3'), getItem('Option 4', '4')],
      'group'
    ),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [
      getItem('Option 7', '7'),
      getItem('Option 8', '8'),
    ]),
  ]),
];

const pages = {
  demo1: <Demo1 />,
};

function openSelectedPage({ item, key, keyPath, domEvent }) {
  console.log({ item, key, keyPath, domEvent });
}

function App() {
  useEffect(() => {
    console.log('app start');
  });

  const [selectedPage, setSelectedPage] = useState('demo1');

  return (
    <div className={styles['App']}>
      <Menu
        style={{
          width: 256,
        }}
        defaultSelectedKeys={['demo1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
        onClick={openSelectedPage}
      />
      <div className={styles['active-page']}>{pages[selectedPage]}</div>
    </div>
  );
}

export default App;
