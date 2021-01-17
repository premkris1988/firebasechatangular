import { Directive, HostBinding, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[appSideMenu]'
})
export class SideMenuDirective {

  @HostBinding('class.is-open') click=false;
  constructor() { }


@HostListener('click') onClic(){
this.click=!this.click;
}

}
