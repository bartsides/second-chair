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
import { Juror } from '../models/juror';

interface DialogData {
  juror: Juror;
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
  styles: `
    .notes { width: 100%; }
    textarea { 
      width: 100%;
      min-height: 200px;
    }
  `,
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
