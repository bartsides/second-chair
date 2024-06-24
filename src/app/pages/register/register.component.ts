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
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import {
  mustContainDigit,
  mustContainLowercase,
  mustContainNonAlphanumeric,
  mustContainUppercase,
} from '../../util/validators';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  loading = false;
  form: FormGroup;

  get formValid(): boolean {
    return this.form?.valid ?? false;
  }

  constructor(
    fb: FormBuilder,
    private $AuthService: AuthService,
    private $UserService: UserService,
    private router: Router
  ) {
    this.form = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          mustContainDigit(),
          mustContainLowercase(),
          mustContainUppercase(),
          mustContainNonAlphanumeric(),
        ],
      ],
    });
  }

  register() {
    this.loading = true;

    this.$AuthService
      .register(this.form.value.email, this.form.value.password)
      .subscribe((res) => {
        this.loading = false;
        if (res) {
          this.$UserService.newUser = true;
          this.router.navigateByUrl('/login');
        }
      });
  }
}
