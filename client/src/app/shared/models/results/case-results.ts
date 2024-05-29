import { CaseDetails } from '../case-details';
import { CaseSummary } from '../case-summary';

export class GetCasesQueryResult {
  caseSummaries: CaseSummary[];
}

export class GetCaseQueryResult {
  caseDetails: CaseDetails;
}
