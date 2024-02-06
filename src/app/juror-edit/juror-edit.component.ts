import { Component, Inject } from '@angular/core';
import { Juror } from '../models/juror';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

interface DialogData {
  juror: Juror;
}

@Component({
  selector: 'app-juror-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './juror-edit.component.html',
  styles: ``,
})
export class JurorEditComponent {
  juror: Juror;

  constructor(
    public dialogRef: MatDialogRef<JurorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.juror = data.juror;
  }

  close() {
    this.dialogRef.close();
  }
}
