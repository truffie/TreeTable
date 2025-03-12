import { TableDataType } from '@/types';

export const mockTableData: TableDataType[] = [
  {
    id: 1,
    equipmentCosts: 0,
    estimatedProfit: 0,
    overheads: 0,
    rowName: 'ft',
    salary: 0,
    child: [
      {
        id: 2,
        equipmentCosts: 0,
        estimatedProfit: 0,
        overheads: 0,
        rowName: 'f-fc',
        salary: 0,
        child: [
          {
            id: 3,
            equipmentCosts: 0,
            estimatedProfit: 0,
            overheads: 0,
            rowName: 'fc-fc',
            salary: 0,
            child: [],
          },
          {
            id: 4,
            equipmentCosts: 0,
            estimatedProfit: 0,
            overheads: 0,
            rowName: 'fc-sc',
            salary: 0,
            child: [],
          },
        ],
      },
    ],
  },
];
