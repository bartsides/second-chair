import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { TrialDetails } from '../shared/models/trial-details';
import { TrialService } from '../shared/services/trial.service';

@Component({
  selector: 'app-trial',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SecondToolbarComponent,
  ],
  templateUrl: './trial.component.html',
  styleUrl: './trial.component.scss',
})
export class TrialComponent implements OnInit, OnDestroy {
  trial: TrialDetails | undefined | null = null;
  form: FormGroup;
  notifier$ = new Subject();

  loadingTrial = false;

  get formValid(): boolean {
    return this.form?.valid ?? false;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private $TrialService: TrialService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.$TrialService.loadingTrial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((loadingTrial) => (this.loadingTrial = loadingTrial));
    this.$TrialService.trial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((trial) => {
        this.trial = trial;
        this.initForm();
      });
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  initForm() {
    if (!this.trial) return;
    this.form = this.fb.group({
      id: [this.trial.id, [Validators.required]],
      name: [this.trial.name, [Validators.required]],
    });
  }

  save() {
    if (!this.trial) return;

    // TODO: Validate form
    console.log('saving trial', this.form.valid, this.trial, this.form.value);
    //this.$TrialService.updateTrial(this.trial).subscribe();
  }
}
