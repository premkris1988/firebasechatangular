import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../models/user-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userLogin: UserLogin;
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fireBaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  onSubmit() {
    const dataObj = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    this.fireBaseService.tryLogin(dataObj).subscribe(
      (response) => {
        if(response.length === 0){
          alert('User authentication failed')
          return;
        }
        this.fireBaseService.isLoggedIn = true;
        sessionStorage.setItem('loggedIn',this.fireBaseService.isLoggedIn.toString());
        sessionStorage.setItem('userInfo', JSON.stringify(response[0]));
        this.fireBaseService.loggedInUserInfo = response[0];
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error adding document: ', error);
      }
    );
  }
}
