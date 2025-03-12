//@ts-ignore
import styles from './Table.module.scss';

import {
  createDefaultRow,
  findRowRecursively,
  removeRowById,
  updateRowRecursively,
  updateTreeWithNewChild,
} from '../../helpers/tableHelpers';

//types import
import {
  TableDataType,
  RecalculatedRows,
  OutlayRowUpdateRequest,
} from '@/types';

//mui import
import { Box, Input } from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

//hooks import
import { useCallback, useEffect, useState } from 'react';

export default function Table({
  columns,
  data,
  onAddSubRow,
  onDeleteRow,
  onSaveRow,
}: {
  columns: ColumnDef<TableDataType>[];
  data: TableDataType[];
  onAddSubRow: (rowId: number) => Promise<RecalculatedRows | undefined>;
  onSaveRow: (
    rowId: number,
    updatedData: OutlayRowUpdateRequest
  ) => Promise<RecalculatedRows | undefined>;
  onDeleteRow: (rowId: number) => void;
}) {
  //states
  const [localData, setLocalData] = useState<TableDataType[]>(data);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [unsavedRows, setUnsavedRows] = useState<Set<number>>(new Set());

  //effects
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  //handlers
  const handleDelete = (rowId: number) => {
    onDeleteRow(rowId);
    setLocalData(prev => removeRowById(prev, rowId));
    setUnsavedRows(prev => {
      const updated = new Set(prev);
      updated.delete(rowId);
      return updated;
    });
  };
  const handleAddChild = useCallback(
    async (rowId: number) => {
      if (editingRowId === rowId || unsavedRows.has(rowId)) {
        return;
      }
      try {
        const data = await onAddSubRow(rowId);
        if (data?.current) {
          const newRow = createDefaultRow(data);

          setLocalData(prev => updateTreeWithNewChild(prev, rowId, newRow));
          setEditingRowId(newRow.id as number);
          setUnsavedRows(prev => new Set(prev).add(newRow.id as number));
        }
      } catch (error) {
        console.error('Error adding child row:', error);
      }
    },
    [editingRowId, onAddSubRow, unsavedRows]
  );
  const handleDoubleClick = useCallback(
    (rowId: number) => {
      if (editingRowId === null) {
        setEditingRowId(rowId);
      }
    },
    [editingRowId]
  );
  //TODO add validation
  const handleSave = useCallback(
    async (rowId: number, updatedData: OutlayRowUpdateRequest) => {
      try {
        const prevData = findRowRecursively(localData, rowId);
        const data = await onSaveRow(rowId, { ...prevData, ...updatedData });

        if (data) {
          setLocalData(prev => {
            const updatedData = updateRowRecursively(
              prev,
              rowId,
              data.current as TableDataType
            );
            return updatedData;
          });
        }

        setUnsavedRows(prev => {
          const updated = new Set(prev);
          updated.delete(rowId);
          return updated;
        });

        setEditingRowId(null);
      } catch (error) {
        console.error('Error updating row:', error);
      }
    },
    [localData, onSaveRow]
  );
  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      rowId: number,
      fieldName: string,
      currentValue: string
    ) => {
      if (e.key === 'Enter') {
        const currentRow = findRowRecursively(localData, rowId);
        if (currentRow) {
          const updatedData = {
            ...currentRow,
            [fieldName]: currentValue,
          } as OutlayRowUpdateRequest;

          handleSave(rowId, updatedData);
        }
      }
    },
    [localData, handleSave]
  );

  //config
  const table = useReactTable({
    data: localData,
    columns,
    state: {
      expanded: true,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => row.child,
  });

  return (
    <table className={styles.table}>
      <thead className={styles.head}>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => {
          const isEditing = editingRowId === row.original.id;
          const isUnsaved = unsavedRows.has(row.original.id as number);

          return (
            <tr
              key={row.id}
              onDoubleClick={() => handleDoubleClick(row.original.id as number)}
              className={isEditing ? styles.editingRow : ''}
            >
              {row.getVisibleCells().map(cell => {
                if (cell.column.id === 'level') {
                  const hasChildren = row?.original?.child?.length > 0;
                  const canAddChild = !isEditing && !isUnsaved;

                  return (
                    <td
                      key={cell.id}
                      className={styles.treeCell}
                      style={{ width: `${row.depth * 48}px` }}
                    >
                      {row.depth > 0 && (
                        <div
                          style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 30,
                            left: 31 + (row.depth - 1) * 24,
                            width: 17,
                            height: 1,
                            backgroundColor: '#ddd',
                          }}
                        />
                      )}
                      {hasChildren && (
                        <div
                          style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 42,
                            bottom: 0,
                            height: 30,
                            left: 30 + row.depth * 24,
                            width: 1,
                            backgroundColor: '#ddd',
                          }}
                        />
                      )}
                      {row.parentId && (
                        <div
                          style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 0,
                            bottom: 32,
                            left: 30 + (row.depth - 1) * 24,
                            width: 1,
                            backgroundColor: '#ddd',
                          }}
                        />
                      )}
                      <div
                        className={styles.treeToggle}
                        style={{ marginLeft: `${row.depth * 24}px` }}
                      >
                        <Box
                          className={`${styles.fileIcon} ${
                            !canAddChild ? styles.disabled : ''
                          }`}
                          onClick={() =>
                            canAddChild &&
                            handleAddChild(row.original.id as number)
                          }
                        />
                        <Box
                          className={styles.hoverIcon}
                          sx={{ display: 'none' }}
                          onClick={() =>
                            handleDelete(row.original.id as number)
                          }
                        />
                      </div>
                    </td>
                  );
                }

                return (
                  <td key={cell.id}>
                    {isEditing ? (
                      <Input
                        type="text"
                        defaultValue={cell.getValue() as string}
                        className={styles.editingCell}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          handleKeyDown(
                            e,
                            row.original.id as number,
                            cell.column.id,
                            e.currentTarget.value
                          )
                        }
                        autoFocus={cell.column.id === 'rowName'}
                      />
                    ) : (
                      <div>{cell.getValue() as string}</div>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
