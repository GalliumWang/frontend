import { React, useCallback, useEffect, useState } from 'react';
import styles from './Demo3.module.scss';
import { Table, Tag, Space, Button, Steps } from 'antd';
import * as localForage from 'localforage';
import { nanoid } from 'nanoid';
import { getCurrentTime } from '../../utils';
import Icon, {
  ReloadOutlined,
  UserOutlined,
  SolutionOutlined,
  MoneyCollectOutlined,
  SmileOutlined,
} from '@ant-design/icons';

const { Step } = Steps;

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
  {
    title: '订单状态',
    key: 'status',
    dataIndex: 'status',
    render: (status) => (
      <Steps current={status === 'verification' ? 1 : status === 'pay' ? 2 : 3}>
        <Step title="创建订单" icon={<UserOutlined />} />
        <Step title="验证支付信息" icon={<SolutionOutlined />} />
        <Step title="扣款" icon={<MoneyCollectOutlined />} />
        <Step title="完成" icon={<SmileOutlined />} />
      </Steps>
    ),
  },
];

function Demo3() {
  const [data, setData] = useState([]);
  const [componentKey, setComponentKey] = useState(Math.random());
  useEffect(() => {
    getOrderList().then((orderList) => {
      console.log(orderList);
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
      if (data.length) {
        data[0].status = orderStatus;
      }
      setData(data);
    });
  }, [componentKey]);

  const clearOrder = () => {
    store.clear();
    setComponentKey(Math.random());
  };

  const createOrder = () => {
    store.clear();
    store.setItem(nanoid(), ['乱世佳人', 28, 1, getCurrentTime()]);
    store.setItem('OrderStatus', 'verification');
    setComponentKey(Math.random());
  };

  const completeOrder = () => {
    const proceedDict = {
      verification: 'pay',
      pay: 'finish',
      finish: 'finish',
    };
    store.getItem('OrderStatus').then((currentStatus) => {
      store.setItem('OrderStatus', proceedDict[currentStatus]);
    });
    // setComponentKey(Math.random());
  };

  return (
    <div className={styles.main}>
      <div className={styles['button-container']}>
        <Button type="primary" onClick={() => createOrder()}>
          创建示例订单
        </Button>
        <Button onClick={() => clearOrder()}>删除示例订单</Button>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => setComponentKey(Math.random())}
        />
      </div>
      <Table columns={columns} dataSource={data} />
      <div
        className={styles['hidden-complete-button']}
        onClick={completeOrder}
      ></div>
    </div>
  );
}

export default Demo3;
