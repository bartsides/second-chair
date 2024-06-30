import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FirmAddComponent } from '../../components/firm-add/firm-add.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { FirmDetails } from '../../models/firm-details';
import { FirmSummary } from '../../models/firm-summary';
import { UserProfile } from '../../models/user-profile';
import { AuthService } from '../../services/auth.service';
import { FirmService } from '../../services/firm.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-firms',
  standalone: true,
  imports: [LoadingComponent, MatButtonModule],
  templateUrl: './firms.component.html',
  styleUrl: './firms.component.scss',
})
export class FirmsComponent implements OnInit, OnDestroy {
  loading = false;
  userProfile: UserProfile | null;
  notifier$ = new Subject();

  constructor(
    private $AuthService: AuthService,
    private $FirmService: FirmService,
    private $UserService: UserService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.$UserService.loadingUser$
      .pipe(takeUntil(this.notifier$))
      .subscribe((res) => (this.loading = res));
    this.$UserService.user$
      .pipe(takeUntil(this.notifier$))
      .subscribe((res) => (this.userProfile = res));
    this.$UserService.getUserProfile().subscribe();
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  addFirm() {
    let firm: FirmDetails = <FirmDetails>{
      id: crypto.randomUUID(),
      name: '',
    };
    let dialogRef = this.openEditDialog(firm, true);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((res: FirmDetails) => {
        if (res && res.name) {
          this.$FirmService.addFirm(res.id, res.name).subscribe({
            next: () => {
              this.userProfile?.firms.push(firm);
              this.changeFirm(res);
            },
            error: (err) => console.error(err),
          });
        }
      });
  }

  private openEditDialog(
    firm: FirmDetails,
    addMode: boolean = false
  ): MatDialogRef<FirmAddComponent, any> {
    return this.dialog.open(FirmAddComponent, {
      data: { firm, addMode },
      minWidth: '70%',
    });
  }

  changeFirm(firm: FirmSummary | FirmDetails) {
    this.loading = true;
    this.$FirmService.changeFirm(firm.id).subscribe({
      next: () => {
        this.$AuthService.refreshToken().subscribe({
          next: (res) => {
            this.loading = false;
            if (res) {
              this.router.navigateByUrl('/trials');
            } else {
              console.error('Error refreshing token');
            }
          },
          error: (err) => console.error(err),
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Unable to change firms', err);
      },
    });
  }
}
