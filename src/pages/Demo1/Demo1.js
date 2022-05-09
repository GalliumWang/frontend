import React from 'react';
import styles from './Demo1.module.scss';
import ShopItem from '../../component';

const PRIDE_URL = '/images/pride.jpg';

function Demo1() {
  return (
    <div className={styles.main}>
      <ShopItem title="傲慢与偏见" imgUrl="images/pride.jpg" prize={23} />
    </div>
  );
}

export default Demo1;
