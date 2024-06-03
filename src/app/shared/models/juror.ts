export interface Juror {
  id: string;
  caseId: string;
  firstName: string;
  lastName: string;
  stoplight: string;
  notes: string;
  selected: string;
  number: number;
  positionX: number | null;
  positionY: number | null;
}
