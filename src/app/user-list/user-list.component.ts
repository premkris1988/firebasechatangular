import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userId:string;
  userList:any[];
  searchText:string;
  @ViewChild('contact') contact :ElementRef;
  constructor(private fireBaseService:FirebaseService,
    private router:Router,
    private activateRoute :ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.fireBaseService.getUsers().subscribe(
      (response) => {
        this.userList = response.filter(item =>{
          return item.id !== this.fireBaseService.loggedInUserInfo.userId;
        });
      },
      (error) => {
        console.error('Error fetching users: ', error);
      }
    );
  }
  initChat(user){    
    this.fireBaseService.selectedUserInfo.next(user);
    this.router.navigate([`chat/${user.id}`], { relativeTo: this.activateRoute })
  }
  onClose(){
   // this.contact.nativeElement.c;
  }
}
