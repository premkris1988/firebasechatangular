import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fireBaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        userName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.confirmPassword('password', 'confirmPassword'),
      }
    );
  }
  confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.confirmPassword) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPassword: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  get fc() {
    return this.signUpForm.controls;
  }
  onSubmit() {

    const dataObj = {
      userName: this.signUpForm.get('userName').value,
      email: this.signUpForm.get('email').value,
      password: this.signUpForm.get('password').value,
      createdAt:new Date().toISOString()
    };
    this.fireBaseService.addUser(dataObj)
    .then((docRef)=> {
      this.fireBaseService.isLoggedIn =true;
      this.router.navigate(['/home']);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }
}
