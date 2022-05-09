import { React, useEffect, useState, useCallback } from 'react';
import { Card, Button } from 'antd';
import { InputNumber, Rate } from 'antd';
import styles from './ShopItem.module.scss';

export default function ShopItem({ title, imgUrl, prize }) {
  const [shopNumber, setShopNumber] = useState(1);

  const changeShopNumber = useCallback((value) => {
    setShopNumber(value);
  }, []);

  const buyItem = useCallback(() => {
    console.log(prize, shopNumber);
  }, [shopNumber]);

  return (
    <Card title={title} className={styles.card}>
      <img src={imgUrl} alt="pride cover" className={styles.cover} />
      <Rate allowHalf defaultValue={4.5} className={styles.rate} />
      <p className={styles.description}>价格：{prize} 元</p>
      <InputNumber
        addonAfter="本"
        min={1}
        max={999}
        defaultValue={1}
        className={styles.numberInput}
        onChange={changeShopNumber}
      />
      <Button type="primary" onClick={buyItem}>
        购买
      </Button>
    </Card>
  );
}
