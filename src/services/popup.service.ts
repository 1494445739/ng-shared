import { Injectable } from '@angular/core';
import { Observable, AsyncSubject, Subject, Subscription } from 'rxjs/Rx';
import { MessagerService, MessageClient, IMessage } from './messager.service';

export enum PopupType {
  alert, confirm
}
export declare interface PopupOptions {
  title?: string;
  btnText?: string | string[];
  countdown?: number;
}
export declare interface IPopupTask {
  message: string;
  attach: { [key: string]: any };
  answer$: AsyncSubject<IMessage>;
}

@Injectable()
export class PopupService {
  private receiver: MessageClient;
  private sender: MessageClient;
  private queue: Function[];
  private currentAnswer: (boolean) => void;

  constructor (private msgSerive: MessagerService) {
    this.queue = [];
    this.sender = this.msgSerive.register();
    this.receiver = this.msgSerive.register();

    this.sender.receiver.subscribe((msg: IMessage) => {
      this.currentAnswer(msg.ok);
      this.next();
    });
  }

  private send(message: string, type: PopupType, options: PopupOptions): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const exec = () => {
        this.sender.send(this.receiver.id, message, { type, options });
        return (ok: boolean) => { resolve(ok); };
      };
      this.queue.push(exec);

      this.run();
    });
  }
  private next () {
    if (this.queue.length > 0) {
      this.currentAnswer = this.queue.shift()();
    } else {
      this.currentAnswer = null;
    }
  }
  private run () {
    if (!this.currentAnswer) {
      this.next();
    }
  }

  alert(message: string, options?: PopupOptions) {
    options = options || {};
    if (typeof options.countdown === 'undefined') {
      options.countdown = 5;
    }
    return this.send(message, PopupType.alert, options);
  }
  confirm(message: string, options?: PopupOptions) {
    options = options || {};
    return this.send(message, PopupType.confirm, options);
  }
  get receiverClient () {
    return this.receiver;
  }
}

