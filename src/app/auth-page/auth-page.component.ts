import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode: boolean = true;
  error: string = null;

  constructor(
    protected authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, Validators.email),
      password: new FormControl(null, Validators.minLength(6)),
    })
  }

  onSwithcLoginMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if(this.authForm.valid) {
      const formValue = this.authForm.value;
      const email = formValue.email;
      const password = formValue.password;

      let auth$: Observable<AuthResponseData>;

      if(this.isLoginMode) {
        auth$ = this.authService.login(email, password);
      }
      else {
        auth$ = this.authService.signup(email, password);
      }
      auth$.subscribe({
        next: (response) => {
          console.log('Next');
          console.log(response);
          this.error = null;
          this.router.navigate(['/']);
        },
        error: (response) => {
          console.log(response);
          this.error = response;
        },
      })

      this.authForm.reset()
    }
  }
}
