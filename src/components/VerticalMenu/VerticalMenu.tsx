//@ts-ignore
import styles from './VerticalMenu.module.scss';

import { useState } from 'react';

import { Box, Grid2, Icon, Typography } from '@mui/material';

export function VerticalMenu() {
  const mockedItems = [
    'По проекту',
    'Объекты',
    'РД',
    'МТО',
    'СМР',
    'График',
    'МиМ',
    'Рабочие',
    'Капвложения',
    'Бюджет',
    'Финансирование',
    'Панорамы',
    'Камеры',
    'Поручения',
    'Контрагенты',
  ];

  const [activeTab, setActiveTab] = useState<number | null>(4);

  const openTab = (e: any) => setActiveTab(+e.target.dataset.index);

  return (
    <>
      <Grid2 className={`${styles.container} ${styles.contentTop}`}>
        <Box className={styles.textContainer}>
          <Typography className={styles.text}>Название проекта</Typography>
          <Typography className={styles.text} variant="caption">
            Аббревиатура
          </Typography>
        </Box>
        <Icon className={styles.action}></Icon>
      </Grid2>
      <Grid2 className={`${styles.container} ${styles.contentDown}`}>
        {mockedItems.map((el, index) => (
          <Box
            key={index}
            className={`${styles.itemWrapper} ${
              index === activeTab ? styles.active : ''
            }`}
            onClick={e => openTab(e)}
            data-index={index}
          >
            <Icon className={styles.itemIcon}></Icon>
            <Typography className={`${styles.text}`}>{el}</Typography>
          </Box>
        ))}
      </Grid2>
    </>
  );
}
