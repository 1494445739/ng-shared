import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import { Query, Result, DataModel } from '../models/models';
import { clone } from 'lodash';
import { Observable } from 'rxjs/Rx';

export abstract class BaseService<T extends DataModel> {
  protected abstract getUrl: string;
  protected abstract listUrl: string;
  protected abstract addUrl: string;
  protected abstract editUrl: string;
  protected abstract deleteUrl: string;

  protected headers: Headers;

  constructor (protected http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  protected convertParams(data: DataModel): URLSearchParams {
    const urlParams = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      if (data.hasOwnProperty(key)) {
        urlParams.append(key, data[key]);
      }
    });

    return urlParams;
  }

  protected _get <U = DataModel | DataModel[]> (url: string, query: Query): Observable<Result<U>> {
    return this.http.get(url, { params: query })
      .map((result: Response) => {
        const body = result.json() as Result<U>;
        return body;
      });
  }
  protected _post<U, R>(url: string, data: U): Observable<Result<R>> {
    const headers = clone(this.headers);
    const params = this.convertParams(data);

    return this.http.post(url, params, { headers })
      .map((result: Response) => {
        return result.json() as Result<R>;
      });
  }

  get (query: Query): Observable<Result<T>> {
    return this._get<T>(this.getUrl, query);
  }
  list (query: Query): Observable<Result<T[]>> {
    return this._get<T[]>(this.listUrl, query);
  }
  add (data: T): Observable<Result<string>> {
    return this._post<T, string>(this.addUrl, data);
  }
  edit (data: T): Observable<Result<string>> {
    return this._post<T, string>(this.editUrl, data);
  }
  delete (data: T): Observable<Result<string>> {
    return this._post<T, string>(this.deleteUrl, data);
  }
}
