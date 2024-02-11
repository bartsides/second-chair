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
import { Juror } from '../../models/juror';

interface DialogData {
  juror: Juror;
  addMode: boolean;
}

@Component({
  selector: 'app-juror-edit',
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
  templateUrl: './juror-edit.component.html',
  styleUrl: './juror-edit.component.scss',
})
export class JurorEditComponent {
  juror: Juror;
  addMode = false;

  constructor(
    public dialogRef: MatDialogRef<JurorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.juror = data.juror;
    if (data.addMode) this.addMode = true;
  }

  close() {
    this.dialogRef.close(this.juror);
  }
}
