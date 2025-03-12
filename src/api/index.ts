import {
  OutlayRowRequest,
  OutlayRowUpdateRequest,
  RecalculatedRows,
  TreeResponse,
} from '@/types';
import axios from 'axios';

const BASE_URL = 'http://185.244.172.108:8081/';

const ENTITY = {
  id: 150469,
  rowName: 'bc7a3fdc-af79-40f0-924a-b8f0e203ee93',
};

export const getRows = async () => {
  return axios
    .get<TreeResponse[]>(`${BASE_URL}v1/outlay-rows/entity/${ENTITY.id}/row/list`)
    .then(response => response.data);
};

export const createRow = async (rowData: OutlayRowRequest) => {
  return axios
    .post<RecalculatedRows>(
      `${BASE_URL}v1/outlay-rows/entity/${ENTITY.id}/row/create`,
      rowData
    )
    .then(response => response.data);
};

export const updateRow = async (
  rID: string,
  updateData: OutlayRowUpdateRequest
) => {
  return axios
    .post<RecalculatedRows>(
      `${BASE_URL}v1/outlay-rows/entity/${ENTITY.id}/row/${rID}/update`,
      updateData
    )
    .then(response => response.data);
};

export const deleteRow = async (rID: string) => {
  return axios
    .delete<RecalculatedRows>(
      `${BASE_URL}v1/outlay-rows/entity/${ENTITY.id}/row/${rID}/delete`
    )
    .then(response => response.data);
};
