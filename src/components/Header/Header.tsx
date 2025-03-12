//@ts-ignore
import styles from './Header.module.scss';
import { Box, Icon, List, ListItem, Typography } from '@mui/material';

export function Header() {

  return (
    <Box component="header" className={styles.container}>
      <Icon className={styles['icon-menu']}></Icon>
      <Icon className={styles['icon-arrow-left']}></Icon>
      <List className={styles.list}>
        <ListItem className={styles['list__item-active']}>
          <Typography>Просмотр</Typography>
        </ListItem>
        <ListItem className={styles['list__item']}>
          <Typography>Управление</Typography>
        </ListItem>
      </List>
    </Box>
  );
}
