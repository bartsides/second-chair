import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { StorageService } from './shared/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  themes: string[] = ['dark-theme', 'light-theme'];
  useDarkTheme = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private $StorageService: StorageService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.setThemeByUserPreference();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.setThemeByUserPreference();
      });
  }

  private setThemeByUserPreference() {
    var darkMode =
      !window.matchMedia || window.matchMedia('(prefers-color-scheme: dark)');
    this.setTheme(this.themes[darkMode ? 0 : 1]);
  }

  setTheme(theme: string) {
    this.useDarkTheme = theme == this.themes[0];
    this.document.body.classList.add(theme);
    this.document.body.classList.remove(
      this.useDarkTheme ? this.themes[1] : this.themes[0]
    );
  }

  clearData() {
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear all data',
        message: 'Are you sure you want to clear all data?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res === 'Yes') {
        this.$StorageService.clearData();
        var url = this.router.url;
        this.router
          .navigateByUrl('refresh', { skipLocationChange: true })
          .then(() => this.router.navigateByUrl(url));
      }
    });
  }
}
