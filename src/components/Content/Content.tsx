//@ts-ignore
import styles from './Content.module.scss';

import { Box, Grid2, Typography } from '@mui/material';
import { ReportTable } from '../ReportTable/ReportTable';

export function Content() {
  return (
    <>
      <Grid2 className={`${styles.container} ${styles.contentTop}`}>
        <Box className={styles.textContainer}>
          <Typography className={styles.text}>
            Строительно-Монтажные работы
          </Typography>
        </Box>
      </Grid2>
      <Grid2 className={`${styles.container} ${styles.contentDown}`}>
        <ReportTable />
      </Grid2>
    </>
  );
}
