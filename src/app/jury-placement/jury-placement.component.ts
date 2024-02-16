import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { JurorCardComponent } from '../shared/components/juror-card/juror-card.component';
import { JurorEditComponent } from '../shared/components/juror-edit/juror-edit.component';
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
  ],
  templateUrl: './jury-placement.component.html',
  styleUrl: './jury-placement.component.scss',
})
export class JuryPlacementComponent {
  data: JuryData = new JuryData();
  private dragging: boolean;

  constructor(
    public dialog: MatDialog,
    public $StorageService: StorageService
  ) {
    this.loadData();
  }

  private loadData() {
    var data = this.$StorageService.getData(LocalStorageKeys.jury);
    if (data) {
      this.data = JSON.parse(data);
      var jurors: Juror[] = [];
      for (var juror of this.data.selected) {
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
    const yOffset = 50;
    var position = { x: 0, y: 0 };
    for (var i = 0; i < jurors.length; i++) {
      var juror = jurors[i];
      juror.position = { x: position.x, y: position.y };
      position.y += yOffset;
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
    var data = event.source.data as Juror;
    data.position.x += event.distance.x;
    data.position.y += event.distance.y;
    this.saveData();
  }

  jurorClicked(juror: Juror) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    var dialogRef = this.openEditDialog(juror);
    dialogRef.afterClosed().subscribe(() => {
      this.saveData();
    });
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
