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
import { CaseDetails } from '../../models/case-details';

interface DialogData {
  case: CaseDetails;
  addMode: boolean;
}

@Component({
  selector: 'app-case-edit',
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
  templateUrl: './case-edit.component.html',
  styleUrl: './case-edit.component.scss',
})
export class CaseEditComponent {
  case: CaseDetails;
  addMode = false;

  constructor(
    public dialogRef: MatDialogRef<CaseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.case = data.case;
    if (data.addMode) this.addMode = true;
  }

  close() {
    this.dialogRef.close(this.case);
  }
}
