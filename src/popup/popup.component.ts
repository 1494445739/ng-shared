import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { PopupService, PopupType, PopupOptions } from '../services/popup.service';
import { MessageClient, IMessage } from '../services/messager.service';

let popupServiceInstance: PopupService;

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html'
})
export class PopupComponent implements OnInit {
  private msgClient: MessageClient;
  public visible = false;
  public title = '提示';
  public message = '';
  public okText = '确定';
  public cancelText = '取消';
  public type = PopupType.alert;
  public timer = 0;

  public get remindType() { return PopupType; }
  public answer: (arg: boolean) => void;

  constructor(private service: PopupService) {
    popupServiceInstance = service;
  }

  ngOnInit() {
    this.msgClient = this.service.receiverClient;
    this.msgClient.receiver.subscribe((msg) => {
      this.visible = true;
      this.message = msg.message;
      this.type = <PopupType>msg.type;

      this.answer = this.type === PopupType.alert ? this.setAlert(msg) : this.setConfirm(msg);
    });
  }
  private setAlert(msg: IMessage): (arg: boolean) => void {
    const options = <PopupOptions>msg.options;

    this.title = options.title || '提示';
    let btnText = '关闭';
    if (typeof options.btnText === 'string' && options.btnText.trim().length > 0) {
      btnText = options.btnText;
    } else if (options.btnText instanceof Array
              && typeof options.btnText[0] === 'string'
              && options.btnText[0].trim().length > 0) {
      btnText = options.btnText[0];
    }
    this.okText = btnText;

    let timerSubscription: Subscription = null;
    const answer = (ok: boolean) => {
      this.visible = false;
      this.msgClient.send(msg.from, '', { ok });
      if (timerSubscription) {
        timerSubscription.unsubscribe();
      }
    };
    if (!isNaN(options.countdown) && options.countdown > 1) {
      const cd = Math.ceil(options.countdown);
      this.timer = cd;
      timerSubscription = Observable.interval(1000).subscribe((num) => {
        this.timer = cd - num - 1;
        if (this.timer <= 0) {
          answer(true);
        }
      });
    } else {
      this.timer = 0;
    }
    return answer;
  }
  private setConfirm(msg: IMessage): (arg: boolean) => void {
    const options = <PopupOptions>msg.options;

    this.title = options.title || '提示';
    let okText = '确定';
    let cancelText = '取消';
    if (options.btnText instanceof Array) {
      if (typeof options.btnText[0] === 'string' && options.btnText[0].trim().length > 0) {
        okText = options.btnText[0];
      }
      if (typeof options.btnText[1] === 'string' && options.btnText[1].trim().length > 0) {
        cancelText = options.btnText[1];
      }
    }
    this.okText = okText;
    this.cancelText = cancelText;
    this.timer = 0;

    const answer = (ok: boolean) => {
      this.visible = false;
      this.msgClient.send(msg.from, '', { ok });
    };
    return answer;
  }

  onOkClick() {
    this.answer(true);
  }
  onCancelClick() {
    this.answer(false);
  }
}

export const Alert = (message: string, options?: PopupOptions) => {
  return popupServiceInstance.alert(message, options);
};
export const Confirm = (message: string, options?: PopupOptions) => {
  return popupServiceInstance.confirm(message, options);
};
