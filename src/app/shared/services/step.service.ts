import { Injectable } from '@angular/core';
import { Steps } from '../config/steps';
import { CurrentStep } from '../models/current-step';

@Injectable({ providedIn: 'root' })
export class StepService {
  private steps = Steps;
  private defaultResult = {
    previous: undefined,
    current: undefined,
    next: undefined,
  };

  getCurrentStep(stepTitle: string | undefined): CurrentStep {
    if (!stepTitle) return this.defaultResult;

    for (var i = 0; i < this.steps.length; i++) {
      var step = this.steps[i];
      if (step.title === stepTitle) {
        var previous = i > 0 ? this.steps[i - 1] : undefined;
        var next = i < this.steps.length - 1 ? this.steps[i + 1] : undefined;
        return {
          previous,
          current: step,
          next,
        };
      }
    }

    return this.defaultResult;
  }
}
