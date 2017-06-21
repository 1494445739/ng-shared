import { Injectable } from '@angular/core';
import {
  Http, Request, RequestOptionsArgs, Response, RequestOptions, ConnectionBackend,
  Headers, ResponseType, XHRBackend
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare var BASEPATH: string;

@Injectable()
export class CustomHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }
  /* request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
  return this.intercept(super.request(url, options));
  } */
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = BASEPATH + url;
    return this.intercept(super.get(url, options));
  }
  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    url = BASEPATH + url;
    return this.intercept(super.post(url, body, options));
  }
  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    url = BASEPATH + url;
    return this.intercept(super.put(url, body, options));
  }
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = BASEPATH + url;
    return this.intercept(super.put(url, options));
  }
  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err) => {
      this.handleError(err);
      throw err;
    });
  }
  handleError(err) {
    // 根据status和type来判断是跨域错误
    // 由于302响应无法被捕获,出现跨域时即认为是session失效的重定向
    // if (err.status === 0 && err.type === ResponseType.Error) {
    //     location.reload();
    // }
  }
}

export const CustomHttpProvider = {
  provide: Http,
  useFactory(backend: XHRBackend, defaultOptions: RequestOptions) {
    return new CustomHttp(backend, defaultOptions);
  },
  deps: [XHRBackend, RequestOptions]
};
