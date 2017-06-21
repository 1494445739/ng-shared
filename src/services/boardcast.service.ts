import { Injectable } from '@angular/core';
import { Observable, AsyncSubject, Subject, Subscription } from 'rxjs/Rx';

export interface IBoardcast {
  message: string;
  [key: string]: any;
}

@Injectable()
export class BoardcastService {
  private channels: Map<string, Subject<IBoardcast>>;

  constructor () {
    this.channels = new Map();
  }
  private getChannel (name: string): Subject<IBoardcast> {
    if (!this.channels.has(name)) {
      const channel = new Subject<IBoardcast>();
      this.channels.set(name, channel);
    }
    return this.channels.get(name);
  }
  getSender (name: string): (message: IBoardcast) => void {
    const channel = this.getChannel(name);
    const sender = (message: IBoardcast): void => {
      channel.next(message);
    };
    return sender;
  }
  getReceiver (name: string): Observable<IBoardcast> {
    const channel = this.getChannel(name);
    return channel.asObservable();
  }
}

