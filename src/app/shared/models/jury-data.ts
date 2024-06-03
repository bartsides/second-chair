import { Juror } from './juror';

export class JuryData {
  pool: Juror[] = [];
  selected: Juror[] = [];
  notSelected: Juror[] = [];
}
