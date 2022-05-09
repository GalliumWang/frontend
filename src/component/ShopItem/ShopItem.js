import { React, useEffect, useState, useCallback } from 'react';
import { Card, Button } from 'antd';
import { InputNumber, Rate } from 'antd';
import styles from './ShopItem.module.scss';
import * as localForage from 'localforage';
import { nanoid } from 'nanoid';

var store = localForage.createInstance({
  name: 'demo1',
});

const getCurrentTime = () => {
  let currentdate = new Date();
  let datetime =
    currentdate.getFullYear() +
    '/' +
    currentdate.getDate() +
    '/' +
    (currentdate.getMonth() + 1) +
    ' ' +
    currentdate.getHours() +
    ':' +
    currentdate.getMinutes() +
    ':' +
    currentdate.getSeconds();
  return datetime;
};

export default function ShopItem({ title, imgUrl, prize }) {
  const [shopNumber, setShopNumber] = useState(1);

  const changeShopNumber = useCallback((value) => {
    setShopNumber(value);
  }, []);

  const buyItem = useCallback(() => {
    let time = getCurrentTime();
    store.setItem(nanoid(), [title, prize, shopNumber, time]);
    console.log('Buy', title, prize, shopNumber, time);
  }, [shopNumber]);

  return (
    <Card title={title} className={styles.card}>
      <img src={imgUrl} alt="pride cover" className={styles.cover} />
      <Rate allowHalf defaultValue={3.5} className={styles.rate} />
      <p className={styles.description}>价格：{prize} 元</p>
      <div className={styles.numberContainer}>
        <span className={styles.numberLabel}>数量</span>
        <InputNumber
          min={1}
          max={999}
          defaultValue={1}
          className={styles.numberInput}
          onChange={changeShopNumber}
        />
      </div>

      <Button type="primary" onClick={buyItem}>
        购买
      </Button>
    </Card>
  );
}
