import { Exhibit } from './exhibit';

export interface EvidenceData {
  plaintiffEvidence: Exhibit[];
  defendantEvidence: Exhibit[];
  defendantNumbered: boolean;
}
