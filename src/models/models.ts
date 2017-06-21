export interface Query {
  [key: string]: any;
}
export interface PageQuery extends Query {
  pageIndex: number;
  pageSize: number;
}

export interface Result<T> {
  status: 'ok' | 'error';
  data: string | T;
  itemsCount?: number;
}

export interface PageChangeEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

export interface DataModel {
  [key: string]: any;
}