import { Point } from '@angular/cdk/drag-drop';

export interface Juror {
  firstName: string;
  lastName: string;
  stoplight: string;
  notes: string;
  number: number;
  position: Point;
}
