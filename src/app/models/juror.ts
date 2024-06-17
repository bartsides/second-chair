export interface Juror {
  id: string;
  trialId: string;
  firstName: string;
  lastName: string;
  stoplight: string;
  notes: string;
  selected: string;
  number: number;
  positionX: number | null;
  positionY: number | null;
}
