export type EntityResponse = {
  id?: number;
  rowName?: string;
};

export type OutlayRowRequest = {
  equipmentCosts?: number;
  estimatedProfit?: number;
  machineOperatorSalary?: number;
  mainCosts?: number;
  materials?: number;
  mimExploitation?: number;
  overheads?: number;
  parentId?: number;
  rowName?: string;
  salary?: number;
  supportCosts?: number;
};

export type OutlayRowUpdateRequest = {
  equipmentCosts?: number;
  estimatedProfit?: number;
  machineOperatorSalary?: number;
  mainCosts?: number;
  materials?: number;
  mimExploitation?: number;
  overheads?: number;
  rowName?: string;
  salary?: number;
  supportCosts?: number;
};

export type RecalculatedRows = {
  changed?: Array<RowResponse>;
  current?: RowResponse;
};

export type RowResponse = {
  equipmentCosts?: number;
  estimatedProfit?: number;
  id?: number;
  machineOperatorSalary?: number;
  mainCosts?: number;
  materials?: number;
  mimExploitation?: number;
  overheads?: number;
  rowName?: string;
  salary?: number;
  supportCosts?: number;
  total?: number;
};

export type TreeResponse = {
  id?: number;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  child: Array<TreeResponse>;
  machineOperatorSalary?: number;
  mimExploitation?: number;
  materials?: number;
  mainCosts?: number;
  supportCosts?: number;
  total?: number;
};

export type TableDataType = TreeResponse;
