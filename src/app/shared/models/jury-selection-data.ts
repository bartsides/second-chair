import { Juror } from './juror';

export class JurySelectionData {
  pool: Juror[] = [];
  selected: Juror[] = [];
  notSelected: Juror[] = [];
  totalStrikes: number = 3;
  plaintiffStrikes: number = 0;
  defendantStrikes: number = 0;
}
