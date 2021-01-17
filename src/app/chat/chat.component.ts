import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  selectedUser: any;
  chatRoomId: string;
  messageText: string;
  chatList: any;
  applicableChats = [];
  private _subscription: Subscription;
  constructor(
    private fireBaseService: FirebaseService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activateRoute.firstChild?.params.subscribe((params) => {
      this.chatRoomId = params['id'];
    });
    this.fireBaseService.getUserById(this.chatRoomId).subscribe((user) => {
      this.fireBaseService.selectedUserInfo.next(user);
    });
    this._subscription = this.fireBaseService.selectedUserInfo.subscribe(
      (item) => {
        if (item) {
          this.selectedUser = item;
          this.chatRoomId = this.selectedUser.id;
          this.fireBaseService.getUserChats(this.fireBaseService.loggedInUserInfo.userId).subscribe((loggeduserChat) =>{
            this.fireBaseService.getUserChats(this.chatRoomId).subscribe((userChats) => {
              this.applicableChats = [];
              let combinedChat = [...loggeduserChat,...userChats];
              console.log(combinedChat);

              combinedChat.forEach((item: any) => {
                if (
                  item.id === this.fireBaseService.loggedInUserInfo.userId ||
                  item.id === this.chatRoomId
                ) {
                  item.messages.forEach((message: any) => {
                    this.applicableChats.push(message);
                  });
                }
              });
              this.chatList = this.applicableChats.sort(this.sortFunction);
            });
          });
         
        }
      }
    );
    this.scrollBottom();
  }

  sortFunction(a, b) {
    var dateA = new Date(a.createdAt).getTime();
    var dateB = new Date(b.createdAt).getTime();
    return dateA > dateB ? 1 : -1;
  }
  sendChat() {
    const collection = this.fireBaseService
      .check(this.chatRoomId)
      .get()
      .subscribe((data:any) => {
        if(data.exists){
          this.fireBaseService
          .sendMessage(this.chatRoomId, this.selectedUser.id, this.messageText)
          .then((item) => {
            console.log(item);
          });
        }
        else{
          this.fireBaseService
          .create(this.chatRoomId, this.selectedUser.id, this.messageText);
          
        }
      
      });
 
    // this.fireBaseService
    //   .sendMessage(this.chatRoomId, this.selectedUser.id, this.messageText)
    //   .then((item) => {
    //     console.log(item);
    //   });
  }
  private scrollBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }
}
