//@ts-ignore
import styles from './ToastNotification.module.scss';

import React from 'react';

//mui imports
import { Typography } from '@mui/material';

//third party imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastNotificationProps {
  message: string;
  statusCode?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  statusCode,
}) => {
  React.useEffect(() =>  {
    if (message) {
      const toastId = `error-${Date.now()}`;
      toast.error(
        <>
          <Typography>{message}</Typography>
          <Typography>{statusCode}</Typography>
        </>, {
          toastId
        }
      );
    }
  }, [message]);

  return (
    <ToastContainer
      className={styles.toast}
      toastClassName={styles.toast}
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};
