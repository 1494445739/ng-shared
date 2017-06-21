import { OnInit } from '@angular/core';
import { Query, PageQuery, DataModel, PageChangeEvent } from '../models/models';
import { BaseService } from './base-service';
import { Alert, Confirm } from '../popup';

export abstract class BaseListComponent<T extends DataModel> implements OnInit {
  private _pagination = true;
  get pagination () { return this._pagination; }
  set pagination (val: boolean) {
    this._pagination = val;
  }
  list: T[];
  itemsCount: number;
  query: Query | PageQuery;
  pending = false;
  protected primaryKey = 'id';

  constructor(protected service: BaseService<T>) { }

  ngOnInit() {
    this.init();
    this.search();
  }
  protected init () {
    this.list = [];
    this.itemsCount = 0;
    if (!this.query) {
      if (this.pagination) {
        this.query = {
          pageIndex: 1,
          pageSize: 10
        };
      } else {
        this.query = {};
      }
    }
  }

  search () {
    this.service.list(this.query).subscribe(
      result => {
        if (result.status === 'ok') {
          this.list = result.data as T[];
          if (this.pagination) {
            this.itemsCount = result.itemsCount;
          }
        } else {
          Alert(result.data as string);
        }
      },
      err => {
        Alert(err);
      }
    );
  }
  delete (model: T) {
    Confirm('确认要删除吗?').then(ok => {
      if (!ok) { return; }

      this.service.delete(model).subscribe(success => {
        if (success) {
          Alert('删除成功!').then(_ => this.search());
        } else {
          Alert('操作失败!');
        }
      }, err => {
        Alert(err);
      });
    });
  }
  pageChange (event: PageChangeEvent) {
    if (this.pagination) {
      this.query.pageIndex = event.page + 1;  // primeNg的分页控件从0开始计数,后台接口从1开始计数，所以加1
      this.search();
    }
  }
}
