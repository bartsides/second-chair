import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { JurorCardComponent } from '../../components/juror-card/juror-card.component';
import { JurorEditComponent } from '../../components/juror-edit/juror-edit.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { SecondToolbarComponent } from '../../components/second-toolbar/second-toolbar.component';
import { Juror } from '../../models/juror';
import { JuryData } from '../../models/jury-data';
import { JurorService } from '../../services/juror.service';
import { TrialService } from '../../services/trial.service';

@Component({
  selector: 'app-jury-placement',
  standalone: true,
  imports: [
    CdkDrag,
    JurorCardComponent,
    LoadingComponent,
    MatButton,
    MatIconModule,
    MatToolbarModule,
    RouterModule,
    SecondToolbarComponent,
  ],
  templateUrl: './jury-placement.component.html',
  styleUrl: './jury-placement.component.scss',
})
export class JuryPlacementComponent implements OnInit, OnDestroy {
  data: JuryData = new JuryData();
  notifier$ = new Subject();
  dragging: boolean;
  private stickyGridSize = 25;

  loadingTrial = false;
  loadingJurors = true;
  get loading(): boolean {
    return this.loadingTrial || this.loadingJurors;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private $TrialService: TrialService,
    private $JurorService: JurorService
  ) {}

  ngOnInit(): void {
    this.$TrialService.loadingTrial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((loadingTrial) => (this.loadingTrial = loadingTrial));
    this.activatedRoute.params
      .pipe(takeUntil(this.notifier$))
      .subscribe((params) => {
        this.$JurorService
          .getJurorsOfTrial(params['trialId'])
          .subscribe((res) => {
            this.data = res.juryData;
            let jurors: Juror[] = [];
            for (let juror of this.data.selected) {
              if (!juror.positionX || !juror.positionY) jurors.push(juror);
            }
            this.setJurorPositions(jurors);
            this.loadingJurors = false;
          });
      });
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  setJurorPositions(jurors: Juror[]) {
    if (!jurors.length) return;
    let position = { x: 0, y: 0 };
    for (let i = 0; i < jurors.length; i++) {
      let juror = jurors[i];
      juror.positionX = position.x;
      juror.positionY = position.y;
      position.y += this.stickyGridSize;
    }
    this.$JurorService.updateJurors(jurors).subscribe();
  }

  resetJurorPositions() {
    this.setJurorPositions(this.data.selected);
  }

  dragStarted() {
    this.dragging = true;
  }

  dragEnded(event: CdkDragEnd) {
    if (event.event.type == 'touchend') this.dragging = false;
    let juror = event.source.data as Juror;
    if (juror.positionX != null && juror.positionY != null) {
      juror.positionX += event.distance.x;
      juror.positionY += event.distance.y;
      this.lockToGrid(juror);
      event.source.setFreeDragPosition({
        x: juror.positionX,
        y: juror.positionY,
      });
    }
    this.$JurorService.updateJuror(juror).subscribe();
  }

  lockToGrid(juror: Juror) {
    juror.positionX = this.roundToGrid(juror.positionX);
    juror.positionY = this.roundToGrid(juror.positionY);
  }

  roundToGrid(num: number | null): number {
    if (num === null) return 0;
    let low = Math.max(0, num - (Math.abs(num) % this.stickyGridSize));
    let high = Math.max(0, low + this.stickyGridSize);
    if (num - low > high - num) return high;
    return low;
  }

  jurorClicked(juror: Juror) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    let dialogRef = this.openEditDialog(juror);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe(() => this.$JurorService.updateJuror(juror).subscribe());
  }

  private openEditDialog(
    juror: Juror,
    addMode: boolean = false
  ): MatDialogRef<JurorEditComponent, any> {
    return this.dialog.open(JurorEditComponent, {
      data: { juror, addMode: addMode },
      minWidth: '70%',
    });
  }
}
