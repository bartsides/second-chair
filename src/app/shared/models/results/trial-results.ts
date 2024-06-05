import { TrialDetails } from '../trial-details';
import { TrialSummary } from '../trial-summary';

export class GetTrialsQueryResult {
  trialSummaries: TrialSummary[];
}

export class GetTrialQueryResult {
  trialDetails: TrialDetails;
}
