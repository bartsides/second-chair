import { Exhibit } from './exhibit';

export class EvidenceData {
  plaintiffEvidence: Exhibit[] = [];
  defendantEvidence: Exhibit[] = [];
  defendantNumbered: boolean = true;
}
