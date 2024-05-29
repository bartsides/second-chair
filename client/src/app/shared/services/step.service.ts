import { Injectable } from '@angular/core';
import { Steps } from '../config/steps';
import { CurrentStep } from '../models/current-step';

@Injectable({ providedIn: 'root' })
export class StepService {
  private steps = Steps;

  getCurrentStep(stepTitle: string | undefined): CurrentStep | undefined {
    if (!stepTitle) return undefined;

    for (let i = 0; i < this.steps.length; i++) {
      let step = this.steps[i];
      if (step.title === stepTitle) {
        let previous = i > 0 ? this.steps[i - 1] : undefined;
        let next = i < this.steps.length - 1 ? this.steps[i + 1] : undefined;
        return {
          previous,
          current: step,
          next,
        };
      }
    }

    return undefined;
  }
}
