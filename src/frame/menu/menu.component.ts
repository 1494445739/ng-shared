import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';

export interface MenuItem {
  name: string;
  icon: string;
  children?: MenuItem[];
  childrenShow?: boolean;
  route: string;
}

@Component({
  selector: 'f-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  @Input() hidden: boolean = false;
  @Input() databind: MenuItem[];
  @ContentChild('menuTemplate') menuTemplate: TemplateRef<any>;

  constructor() { }
  ngOnInit() {
  }
}
