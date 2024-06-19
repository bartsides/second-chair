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
import { FirmDetails } from '../../models/firm-details';

interface DialogData {
  firm: FirmDetails;
  addMode: boolean;
}

@Component({
  selector: 'app-firm-add',
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
  templateUrl: './firm-add.component.html',
  styleUrl: './firm-add.component.scss',
})
export class FirmAddComponent {
  firm: FirmDetails;
  addMode = false;

  constructor(
    public dialogRef: MatDialogRef<FirmAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.firm = data.firm;
    if (data.addMode) this.addMode = true;
  }

  close() {
    this.dialogRef.close(this.firm);
  }
}
