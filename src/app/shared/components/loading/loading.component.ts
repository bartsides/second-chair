import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [LoadingDialogComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent implements OnInit, OnDestroy {
  private dialog: MatDialogRef<LoadingDialogComponent>;

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dialog = this.matDialog.open(LoadingDialogComponent, {
        panelClass: 'transparent',
        disableClose: true,
      });
    });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.dialog.close();
    });
  }
}
