import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Output() contact = new EventEmitter();
  constructor(private route:Router) { }

  ngOnInit(): void {
  }
  onContactsClick(){
    this.contact.emit(true);
  }
  onSignout(){
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }
}
