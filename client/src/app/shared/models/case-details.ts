export class CaseDetails {
  id: string;
  name: string;
  strikes: Strikes;
}

export class Strikes {
  total: number;
  plaintiff: number;
  defendant: number;
}
