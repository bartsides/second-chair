import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingComponent } from '../../components/loading/loading.component';
import { UserProfile } from '../../models/user-profile';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile;
  loading = false;
  form: FormGroup;

  get formValid(): boolean {
    return this.form?.valid ?? false;
  }

  constructor(private fb: FormBuilder, private $UserService: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.$UserService.getUserProfile().subscribe((res) => {
      this.loading = false;
      this.userProfile = res?.userProfile;
      this.initForm();
    });
  }

  initForm() {
    this.form = this.fb.group({
      firstName: [this.userProfile?.firstName, [Validators.required]],
      lastName: [this.userProfile?.lastName, [Validators.required]],
      firms: [this.userProfile?.firms ?? []],
    });
  }

  save() {
    if (!this.form.value || !this.form.valid) return;
    this.loading = true;
    this.$UserService.user$.next(this.form.value);
    this.$UserService
      .addUpdateUserProfile(this.form.value.firstName, this.form.value.lastName)
      .subscribe(() => (this.loading = false));
  }
}
