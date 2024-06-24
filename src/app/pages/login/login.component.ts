import { Component } from '@angular/core';
import {
  AbstractControl,
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
export class LoginComponent {
  loading = false;
  loginFail = false;
  form: FormGroup;

  get formValid(): boolean {
    return this.form?.valid ?? false;
  }

  get password(): AbstractControl {
    return this.form.controls['password'];
  }

  get passwordHasError(): boolean {
    let password = this.password;
    if (!password) return false;
    return password.invalid && (password.dirty || password.touched);
  }

  constructor(
    fb: FormBuilder,
    private $AuthService: AuthService,
    private router: Router
  ) {
    this.form = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
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
