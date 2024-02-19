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
import { Exhibit } from '../../models/exhibit';

interface DialogData {
  exhibit: Exhibit;
  addMode: boolean;
}

@Component({
  selector: 'app-exhibit-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './exhibit-edit.component.html',
  styleUrl: './exhibit-edit.component.scss',
})
export class ExhibitEditComponent {
  exhibit: Exhibit;
  addMode = false;

  constructor(
    public dialogRef: MatDialogRef<ExhibitEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.exhibit = data.exhibit;
    if (data.addMode) this.addMode = true;
  }

  close() {
    this.dialogRef.close(this.exhibit);
  }
}
