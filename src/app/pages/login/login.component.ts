import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ErrorMessageComponent,
    FormsModule,
    LoadingComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loading = false;
  loginFail = false;
  form: FormGroup;

  get formValid(): boolean {
    return this.form?.valid ?? false;
  }

  get justRegistered(): boolean {
    return this.$UserService.newUser;
  }

  constructor(
    fb: FormBuilder,
    private $AuthService: AuthService,
    private $UserService: UserService,
    private router: Router
  ) {
    this.form = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.$AuthService.refreshToken('/trials').subscribe();
  }

  login() {
    this.loading = true;

    this.$AuthService
      .login(this.form.value.email, this.form.value.password, '/trials')
      .subscribe((res) => {
        this.loading = false;
        if (!res) this.loginFail = false;
      });
  }

  register() {
    this.router.navigateByUrl('/register');
  }
}
