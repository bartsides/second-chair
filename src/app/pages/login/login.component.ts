import { Component } from '@angular/core';
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
import { LoadingComponent } from '../../components/loading/loading.component';
import { AuthService } from '../../services/auth.service';

/*  // TODO: Password validations that match server rules
    "PasswordTooShort": [
      "Passwords must be at least 6 characters."
    ],
    "PasswordRequiresNonAlphanumeric": [
      "Passwords must have at least one non alphanumeric character."
    ],
    "PasswordRequiresDigit": [
      "Passwords must have at least one digit ('0'-'9')."
    ],
    "PasswordRequiresLower": [
      "Passwords must have at least one lowercase ('a'-'z')."
    ]
      */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
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
  form: FormGroup;

  get formValid(): boolean {
    return this.form?.valid ?? false;
  }

  constructor(
    private $AuthService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  login() {
    this.loading = true;

    this.$AuthService
      .login(this.form.value.email, this.form.value.password)
      .subscribe((res) => {
        if (res) {
          this.router.navigateByUrl('trials');
        }
      });
  }
}
