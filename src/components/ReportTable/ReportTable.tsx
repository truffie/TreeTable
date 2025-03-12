//api calls import
import { getRows, createRow, deleteRow, updateRow } from '../../api/index';

//types import
import {
  TableDataType,
  OutlayRowRequest,
  OutlayRowUpdateRequest,
  RecalculatedRows,
} from '@/types';

//mui import
import { ColumnDef } from '@tanstack/react-table';

//hooks import
import { useEffect, useState, useCallback } from 'react';
import Table from '../Table/Table';

//toast import
import { ToastNotification } from '../ToastNotification/ToastNotification';
import { Typography } from '@mui/material';

// Constants
const DEFAULT_ROW_VALUES = {
  rowName: '',
  equipmentCosts: 0,
  estimatedProfit: 0,
  overheads: 0,
  salary: 0,
  machineOperatorSalary: 0,
  mainCosts: 0,
  materials: 0,
  mimExploitation: 0,
  supportCosts: 0,
};

// Columns
const TABLE_COLUMNS: ColumnDef<TableDataType>[] = [
  {
    header: 'Уровень',
    accessorKey: 'level',
    cell: info => info.renderValue(),
  },
  {
    header: 'Наименование работы',
    accessorKey: 'rowName',
  },
  {
    header: 'Основная з/п',
    accessorKey: 'salary',
  },
  {
    header: 'Оборудование',
    accessorKey: 'equipmentCosts',
  },
  {
    header: 'Накладные расходы',
    accessorKey: 'overheads',
  },
  {
    header: 'Сметная прибыль',
    accessorKey: 'estimatedProfit',
  },
];

export function ReportTable() {
  const [fetchedData, setFetchedData] = useState<TableDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastStatusCode, setToastStatusCode] = useState<number | undefined>(
    undefined
  );

  const handleError = useCallback((message: string, statusCode?: number) => {
    setToastMessage(message);
    setToastStatusCode(statusCode);
    
    setTimeout(() => {
      setToastMessage('');
      setToastStatusCode(undefined);
    }, 100); 
  }, []);

  const getTreeRows = useCallback(async () => {
    try {
      setIsLoading(true);
      const rows = await getRows();
      setFetchedData(rows as TableDataType[]);
    } catch (error: any) {
      console.error('Failed to fetch rows:', error);
      handleError(
        error.message || 'Failed to download data',
        error.status || error.statusCode
      );
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    getTreeRows();
  }, [getTreeRows]);

  const handleAddSubRow = useCallback(
    async (parentId: number): Promise<RecalculatedRows | undefined> => {
      try {
        const rowData: OutlayRowRequest = {
          parentId,
          ...DEFAULT_ROW_VALUES,
        };
        return await createRow(rowData);
      } catch (error: any) {
        console.error('Error adding row:', error);
        handleError(
          `Oops...: ${error.message}`,
          error.status || error.statusCode
        );
        return undefined;
      }
    },
    [handleError]
  );

  const handleDeleteRow = useCallback(
    async (rowId: number): Promise<void> => {
      try {
        await deleteRow(rowId.toString());
      } catch (error: any) {
        console.error('Error deleting row:', error);
        handleError(
          `Oops...: ${error.message}`,
          error.status || error.statusCode
        );
      }
    },
    [handleError]
  );

  const handleSave = useCallback(
    async (
      rowId: number,
      updatedData: OutlayRowUpdateRequest
    ): Promise<RecalculatedRows | undefined> => {
      try {
        return await updateRow(rowId.toString(), updatedData);
      } catch (error: any) {
        console.error('Error updating row:', error);
        handleError(
          `Oops...: ${error.message}`,
          error.status || error.statusCode
        );
        return undefined;
      }
    },
    [handleError]
  );

  if (isLoading && fetchedData.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: '#fff',
        }}
      >
        <Typography variant="h3"> Loading...</Typography>
      </div>
    );
  }

  return (
    <>
      <Table
        columns={TABLE_COLUMNS}
        data={fetchedData}
        onSaveRow={handleSave}
        onAddSubRow={handleAddSubRow}
        onDeleteRow={handleDeleteRow}
      />
      <ToastNotification message={toastMessage} />
    </>
  );
}
