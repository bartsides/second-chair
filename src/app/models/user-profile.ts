import { FirmSummary } from './firm-summary';

export class UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  firms: FirmSummary[];
  currentFirm: FirmSummary;
}
