import { Injectable } from '@angular/core';
import { Observable, AsyncSubject, Subject, Subscription } from 'rxjs/Rx';


export declare interface IMessage {
  from: string;
  to: string;
  message: string;
  [key: string]: any;
}
export declare interface MessageClient {
  id: string;
  send: (target: string, msg: string, attach?: { [key: string]: any }) => boolean;
  receiver: Observable<IMessage>;
}

@Injectable()
export class MessagerService {
  private newId = (i => () => (i++).toString())(1);
  private clients: Map<string, Subject<IMessage>>;

  constructor () {
    this.clients = new Map();
  }
  private send (msg: IMessage): boolean {
    if (this.clients.has(msg.to)) {
      this.clients.get(msg.to).next(msg);
      return true;
    } else {
      return false;
    }
  }
  register(): MessageClient {
    const id = this.newId();
    const receiver = new Subject<IMessage>();
    const send = (target: string, msg: string, attach?: { [key: string]: any }) => {
      let iMsg = { from: id, to: target, message: msg };
      if (attach) {
        iMsg = Object.assign(attach, iMsg) as IMessage;
      }
      return this.send(iMsg);
    };
    this.clients.set(id, receiver);

    const client: MessageClient = {
      id,
      send,
      receiver: receiver.asObservable()
    };
    return client;
  }
  unregister(id: string): boolean {
    if (this.clients.has(id)) {
      const client = this.clients.get(id);
      client.complete();
    }
    return this.clients.delete(id);
  }
}

