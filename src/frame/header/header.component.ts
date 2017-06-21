import { Component, OnInit, AfterContentInit, Input, Output, ContentChild, TemplateRef,
  EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'f-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, AfterContentInit {
  @Input() hidden: boolean = false;
  @Input() title: string;
  @Input() username: string;
  @Output() exitClick: EventEmitter<any> = new EventEmitter();
  @ContentChild('usermenuTemplate') usermenuTemplate: TemplateRef<any>;
  greet: string;
  userMenuShow: boolean;

  constructor () { }

  ngOnInit () {
    this.userMenuShow = false;
    Observable.interval(1000 * 600).startWith(0).subscribe(_ => this.setGreet());
  }
  ngAfterContentInit() {

  }

  private setGreet() {
    const hour = (new Date).getHours();
    this.greet = ((hour >= 6 && hour < 11) ? '上午' :  (hour <= 13 ? '中午' : (hour <= 18 ? '下午' : '晚上'))) + '好';
  }
  showUserMenu () {
    this.userMenuShow = !this.userMenuShow;
  }
  doExitClick() {
    this.exitClick.emit();
  }
}
