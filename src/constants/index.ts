import { TableDataType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

// Constants
export const DEFAULT_ROW_VALUES = {
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
export const TABLE_COLUMNS: ColumnDef<TableDataType>[] = [
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