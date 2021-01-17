import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements OnInit {
  userId:string;
  mobileView :boolean = false;
  constructor(private fireBaseService: FirebaseService) { }

  ngOnInit(): void {    
 
  }
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   if(event.target.innerWidth === 735)
  //   {
  //     this.mobileView =true;
  //   }
  // }
  onContact(value){
    this.mobileView = (value) ? true :false;
  }
}
