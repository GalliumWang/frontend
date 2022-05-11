import { React, useCallback, useEffect, useState } from 'react';
import styles from './Demo4.module.scss';
import { Table, Tag, Space, Button } from 'antd';
import * as localForage from 'localforage';
import { nanoid } from 'nanoid';
import { getCurrentTime } from '../../utils';

var store = localForage.createInstance({
  name: 'demo3',
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
];

function Demo3() {
  const [data, setData] = useState([]);
  const [componentKey, setComponentKey] = useState(Math.random());
  useEffect(() => {
    getOrderList().then((orderList) => {
      let data = [];
      for (const [key, value] of Object.entries(orderList)) {
        if (key !== 'OrderStatus')
          data.push({
            key,
            title: value[0],
            prize: value[1],
            number: value[2],
            time: value[3],
          });
      }
      let orderStatus = orderList['OrderStatus'];

      setData(data);
    });
  }, [componentKey]);

  const createOrder = () => {
    store.setItem(nanoid(), ['乱世佳人', 28, 1, getCurrentTime()]);
    store.setItem('OrderStatus', 'Processing');
    setComponentKey(Math.random());
  };

  const completeOrder = () => {
    store.setItem('OrderStatus', 'Success');
    setComponentKey(Math.random());
  };

  const clearOrder = () => {
    store.clear();
    setComponentKey(Math.random());
  };

  return (
    <div className={styles.main}>
      <Button type="primary" onClick={() => createOrder()}>
        创建示例订单
      </Button>
      <Button onClick={() => clearOrder()}>删除示例订单</Button>
      <Button
        className={styles['complete-button']}
        onClick={() => completeOrder()}
      >
        完成示例订单
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Demo3;
