import { React, useCallback, useEffect, useState } from 'react';
import styles from './Demo2.module.scss';
import { Table, Tag, Space, Button } from 'antd';
import * as localForage from 'localforage';

var store = localForage.createInstance({
  name: 'demo1',
});

const getOrderList = async () => {
  const orderKeys = await store.keys();
  let orderList = {};
  for (let key of orderKeys) {
    let value = await store.getItem(key);
    orderList[key] = value;
  }
  return orderList;
};

function Demo2() {
  const deleteOrder = useCallback((orderKey) => {
    store.removeItem(orderKey);
    setComponentKey(Math.random());
  });

  const [data, setData] = useState([]);
  const [componentKey, setComponentKey] = useState(Math.random());

  useEffect(() => {
    getOrderList().then((orderList) => {
      let data = [];
      for (const [key, value] of Object.entries(orderList)) {
        data.push({
          key,
          title: value[0],
          prize: value[1],
          number: value[2],
          time: value[3],
        });
      }
      setData(data);
    });
  });

  const columns = [
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '单价',
      dataIndex: 'prize',
      key: 'prize',
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'address',
    },
    {
      title: '订单创建时间',
      key: 'time',
      dataIndex: 'time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => deleteOrder(record.key)}>
            删除订单
          </Button>
        </Space>
      ),
    },
  ];

  // const data = [
  //   {
  //     key: '1',
  //     title: 'John Brown',
  //     prize: 23,
  //     number: 3,
  //     time: 'placeholder',
  //   },
  // ];

  return (
    <div className={styles.main}>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Demo2;
