import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrialDetails } from '../../models/trial-details';

interface DialogData {
  trial: TrialDetails;
  addMode: boolean;
}

@Component({
  selector: 'app-trial-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './trial-add.component.html',
  styleUrl: './trial-add.component.scss',
})
export class TrialAddComponent {
  trial: TrialDetails;
  addMode = false;

  constructor(
    public dialogRef: MatDialogRef<TrialAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.trial = data.trial;
    if (data.addMode) this.addMode = true;
  }

  close() {
    this.dialogRef.close(this.trial);
  }
}
