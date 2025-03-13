import { DEFAULT_ROW_VALUES } from './../constants/index';
import {
  TableDataType,
  OutlayRowUpdateRequest,
  RecalculatedRows,
} from '@/types';

export const removeRowById = (
  rows: TableDataType[],
  targetId: number
): TableDataType[] => {
  return rows
    .filter(row => row.id !== targetId)
    .map(row => ({
      ...row,
      child: row.child ? removeRowById(row.child, targetId) : [],
    }));
};

export const updateTreeWithNewChild = (
  rows: TableDataType[],
  targetId: number,
  newRow: TableDataType
): TableDataType[] => {
  return rows.map(row => {
    if (row.id === targetId) {
      const updatedChild = row.child ? [...row.child, newRow] : [newRow];
      return { ...row, child: updatedChild };
    }

    if (row.child && row.child.length > 0) {
      return {
        ...row,
        child: updateTreeWithNewChild(row.child, targetId, newRow),
      };
    }

    return row;
  });
};

export const updateRowRecursively = (
  rows: TableDataType[],
  rowId: number,
  updatedData: any
): TableDataType[] => {
  return rows.map(row => {
    if (row.id === rowId) {
      return { ...row, ...updatedData };
    }
    if (row.child && row.child.length > 0) {
      return {
        ...row,
        child: updateRowRecursively(row.child, rowId, updatedData),
      };
    }
    return row;
  });
};

export const findRowRecursively = (
  rows: TableDataType[],
  rowId: number
): TableDataType | undefined => {
  for (const row of rows) {
    if (row.id === rowId) return row;
    if (row.child && row.child.length > 0) {
      const found = findRowRecursively(row.child, rowId);
      if (found) return found;
    }
  }
  return undefined;
};

export const createDefaultRow = (rowId: number): TableDataType => {
  return {
    id: Date.now(),
    parentId: rowId,
    ...DEFAULT_ROW_VALUES,
    child: [],
    isNew: true
  };
};

export const handleRowSave = async (
  rowId: number,
  updatedData: OutlayRowUpdateRequest,
  localData: TableDataType[],
  onSaveRow: (
    rowId: number,
    data: OutlayRowUpdateRequest
  ) => Promise<RecalculatedRows | undefined>
): Promise<TableDataType[] | undefined> => {
  try {
    const data = await onSaveRow(rowId, updatedData);

    if (data) {
      return updateRowRecursively(localData, rowId, data.current);
    }
    return undefined;
  } catch (error) {
    console.error('Error updating row:', error);
    return undefined;
  }
};
