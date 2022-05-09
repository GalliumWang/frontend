import React from 'react';
import styles from './Demo1.module.scss';
import ShopItem from '../../component';

const PRIDE_URL = '/images/pride.jpg';

function Demo1() {
  return (
    <div className={styles.main}>
      <ShopItem title="傲慢与偏见" imgUrl="images/pride.jpg" prize={23} />
      <ShopItem
        title="基督山伯爵"
        imgUrl="images/jidushanbojue.jpg"
        prize={30}
      />
      <ShopItem title="乱世佳人" imgUrl="images/withWind.jpg" prize={28} />
    </div>
  );
}

export default Demo1;
