import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router from @angular/router

import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.hasToken()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  login(form: NgForm) {
    const { email, password } = form.value;
    this.authService.login(email, password).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}
