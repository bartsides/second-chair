import { Step } from './step';

export interface CurrentStep {
  previous: Step | undefined;
  current: Step | undefined;
  next: Step | undefined;
}
