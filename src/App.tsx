import '@styles/_reset.scss';
import './App.style.scss';

import { Grid2 } from '@mui/material';

import { Header } from './components/Header/Header';
import { VerticalMenu } from './components/VerticalMenu/VerticalMenu';
import { Content } from './components/Content/Content';
import { ToastContainer } from 'react-toastify';

export function App() {
  return (
    <>
      <Header />
      <Grid2
        container
        wrap="nowrap"
        component={'main'}
        className="content"
        columns={24}
      >
        <Grid2
          size={4}
          minWidth={100}
          container
          direction="column"
          bgcolor="gray"
        >
          <VerticalMenu />
        </Grid2>
        <Grid2 size={20} container direction="column" bgcolor="GrayText">
          <Content />
        </Grid2>
      </Grid2>
      <ToastContainer />
    </>
  );
}
