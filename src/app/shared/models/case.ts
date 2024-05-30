import { EvidenceData } from './evidence-data';
import { JuryData } from './jury-data';

export class Case {
  id: string;
  jury: JuryData;
  evidence: EvidenceData;
}
