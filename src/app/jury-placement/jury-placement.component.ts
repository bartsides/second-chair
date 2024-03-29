import { CdkDrag, CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { JurorCardComponent } from '../shared/components/juror-card/juror-card.component';
import { JurorEditComponent } from '../shared/components/juror-edit/juror-edit.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { Juror } from '../shared/models/juror';
import { JuryData } from '../shared/models/jury-data';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-jury-placement',
  standalone: true,
  imports: [
    CdkDrag,
    JurorCardComponent,
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

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public $StorageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  private loadData() {
    let data = this.$StorageService.getData(LocalStorageKeys.jury);
    if (data) {
      this.data = JSON.parse(data);
      let jurors: Juror[] = [];
      for (let juror of this.data.selected) {
        if (!juror.position) jurors.push(juror);
      }
      this.setJurorPositions(jurors);
    }
  }

  private saveData() {
    this.$StorageService.saveData(
      LocalStorageKeys.jury,
      JSON.stringify(this.data)
    );
  }

  setJurorPositions(jurors: Juror[]) {
    if (!jurors.length) return;
    let position = { x: 0, y: 0 };
    for (let i = 0; i < jurors.length; i++) {
      let juror = jurors[i];
      juror.position = { x: position.x, y: position.y };
      position.y += this.stickyGridSize;
    }
    this.saveData();
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
    juror.position.x += event.distance.x;
    juror.position.y += event.distance.y;
    this.lockToGrid(juror.position);
    event.source.setFreeDragPosition(juror.position);
    this.saveData();
  }

  lockToGrid(position: Point) {
    position.x = this.roundToGrid(position.x);
    position.y = this.roundToGrid(position.y);
  }

  roundToGrid(num: number): number {
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
    dialogRef.afterClosed().subscribe(() => this.saveData());
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
