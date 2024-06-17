export class TrialDetails {
  id: string;
  name: string;
  strikes: Strikes;
  defendantNumbered: boolean;
}

export class Strikes {
  total: number;
  plaintiff: number;
  defendant: number;
}
