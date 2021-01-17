import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  loggedInUserChat: any;
  selectedUserInfo = new BehaviorSubject<any>(null);
  isLoggedIn: boolean = false;
  loggedInUserInfo: any = JSON.parse(sessionStorage.getItem('userInfo'));
  constructor(private db: AngularFirestore) {}
  addUser(data) {
    return this.db.collection('users').add(data);
  }
  getUserById(id) {
    return this.db.doc(`users/${id}`).valueChanges({ idField: 'id' });
  }
  getUsers(): Observable<any[]> {
    return this.db
      .collection('users', (ref) => ref.orderBy('userName', 'asc'))
      .valueChanges({ idField: 'id' });
  }
  tryLogin(data) {
    return this.db
      .collection('users', (ref) =>
        ref
          .where('email', '==', data.email)
          .limit(1)
          .where('password', '==', data.password)
      )
      .valueChanges({ idField: 'userId' });
  }
  check(chatId) {
    const ref = this.db.collection('chats').doc(chatId);
    return ref;
  }
  create(chatId, userId, content) {
    let createData = {
      userId: this.loggedInUserInfo.userId,
      content:'',
      messages:[],
      createdAt: Date.now(),
    }
    const ref = this.db.collection('chats').doc(chatId).set(createData);
    ref.then(data=>{
      const ref = this.db.collection('chats').doc(chatId);
      let updateData = {
        userId: this.loggedInUserInfo.userId,
        content,
        createdAt: Date.now(),
      }
      return ref.update({
        messages: firebase.default.firestore.FieldValue.arrayUnion(updateData),
      });
    })
  }
  sendMessage(chatId, userId, content) {
    const data = {
      userId: this.loggedInUserInfo.userId,
      content,
      createdAt: Date.now(),
    };
    const ref = this.db.collection('chats').doc(chatId);
    return ref.update({
      messages: firebase.default.firestore.FieldValue.arrayUnion(data),
    });
  }
  getChats(chatId) {
    return this.db
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }
  joinUsers(chats: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chats.pipe(
      switchMap((c: any) => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map((v) => v.userId)));
        console.log(uids);
        // Firestore User Doc Reads
        const userDocs = uids.map((u) =>
          this.db.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map((arr: any) => {
        arr.forEach((v) => (joinKeys[(<any>v).userId] = v));
        chat.messages = chat.messages.map((v) => {
          return { ...v, user: joinKeys[v.userId] };
        });
        console.log(chat);
        return chat;
      })
    );
  }
  getUserChats(selectedUser) {
    return this.db
      .collection(
        'chats',
        (ref) =>
          ref.where('userId', '==',selectedUser)
      )

      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
}
