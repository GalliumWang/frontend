import styles from './App.module.scss';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Demo1, Demo2, Demo3, Demo4, Demo5 } from './pages';

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
      '示例一',
      'g1',
      null,
      [getItem('前台', 'demo1'), getItem('后台', 'demo2')],
      'group'
    ),
    getItem('示例二', 'g2', null, [getItem('订单状态', 'demo3')], 'group'),
  ]),
  getItem('审批系统', 'sub2', <AppstoreOutlined />, [
    getItem('审批流程一', 'demo4'),
    getItem('审批流程二', 'demo5'),
  ]),
  getItem('校园通行码系统', 'sub3', <AppstoreOutlined />, [
    getItem('审批人审批', 'demo113'),
    getItem('流程进度', 'demo114'),
  ]),
];

const pages = {
  demo1: <Demo1 />,
  demo2: <Demo2 />,
  demo3: <Demo3 />,
  demo4: <Demo4 />,
  demo5: <Demo5 />,
};

function App() {
  useEffect(() => {
    console.log('app start');
  });

  const [selectedPage, setSelectedPage] = useState('demo1');

  const changeSelectedPage = ({ key }) => {
    setSelectedPage(key);
  };

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
        onClick={changeSelectedPage}
      />
      <div className={styles['active-page']}>{pages[selectedPage]}</div>
    </div>
  );
}

export default App;
