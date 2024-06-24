import { FirmSummary } from './firm-summary';

export class UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  firms: FirmSummary[];
  currentFirm: FirmSummary;
}
