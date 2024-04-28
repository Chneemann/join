import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBtnComponent } from '../../shared/components/buttons/form-btn/form-btn.component';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, FormBtnComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData = {
    mail: '',
    password: '',
  };

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
    }
  }

  guestLogin() {
    this.getUserIdInLocalStorage();
    window.location.reload();
  }

  getUserIdInLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify('5EX7gnwPPGEDbN186Rdw'));
  }
}
