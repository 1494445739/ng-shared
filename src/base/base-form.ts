import { OnInit, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { clone } from 'lodash';
import { Observable } from 'rxjs/Rx';

import { Query, DataModel, Result } from '../models/models';
import { BaseService } from './base-service';
import { Alert, Confirm } from '../popup';


export abstract class BaseFormComponent<T extends DataModel> implements OnInit, AfterViewChecked {
  protected abstract viewForm: NgForm;
  protected abstract currentForm: NgForm;
  model: T;
  protected abstract defaultModel: T;
  protected primaryKey = 'id';
  pending = false;
  private _validation = true;
  get validation () { return this._validation; }
  set validation (val: boolean) {
    this._validation = val;
  }

  constructor(protected router: Router,
    protected route: ActivatedRoute,
    protected service: BaseService<T>) {
    }

  ngOnInit() {
    this.model = clone<T>(this.defaultModel);
    this.init();
  }
  protected init() {
    this.pending = true;
    this.route.params.switchMap((params: Params) => {
      const key = params[this.primaryKey];
      if (key && key.length > 0) {
        const query = { [this.primaryKey]: key };
        return this.service.get(query).map(result => {
          if (result.status === 'ok') {
            return result.data as T;
          } else {
            throw result.data as string;
          }
        });
      } else {
        return Observable.of(clone(this.defaultModel));
      }
    }).subscribe(data => {
      this.model = data;
      this.pending = false;
    }, err => {
      Alert(err);
      this.pending = false;
    });
  }

  submit () {
    const primaryKeyValue = this.model[this.primaryKey];
    const isEdit = primaryKeyValue && primaryKeyValue !== 0 && primaryKeyValue.toString().length > 0;

    this.pending = true;
    let observable: Observable<Result<string>>;
    if (!isEdit) {
      observable = this.service.add(this.model);
    } else {
      observable = this.service.edit(this.model);
    }

    observable.subscribe(result => {
      if (result.status === 'ok') {
        Alert('提交成功!').then(_ => this.close());
      } else {
        Alert(result.data as string);
      }
      this.pending = false;
    }, err => {
      Alert(err);
      this.pending = false;
    });
  }
  close () {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onVisibleChange (visible: boolean) {
    if (!visible) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  /* form validate */
  formErrors: { [key: string]: string } = { };
  validationMessages: { [key: string]: any } = { };
  ngAfterViewChecked() {
    if (this.validation) {
      this.formChanged();
    }
  }
  formChanged() {
    if (this.currentForm === this.viewForm) { return; }
    this.viewForm = this.currentForm;
    if (this.viewForm) {
      this.viewForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.viewForm) { return; }
    const form = this.viewForm.form;

    for (const field in this.validationMessages) {
      if (this.validationMessages.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          this.formErrors[field] = messages[Object.keys(control.errors)[0]];
        }
      }
    }
  }
}
