import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CurrentStep } from '../../models/current-step';
import { StepService } from '../../services/step.service';

@Component({
  selector: 'app-second-toolbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterModule],
  templateUrl: './second-toolbar.component.html',
  styleUrl: './second-toolbar.component.scss',
})
export class SecondToolbarComponent implements OnInit {
  @Input({ required: true }) activatedRoute: ActivatedRoute;
  @Input({ required: true }) subject: Subject<unknown>;
  currentStep: CurrentStep | undefined;

  constructor(private $StepService: StepService) {}

  ngOnInit(): void {
    this.activatedRoute.title
      .pipe(takeUntil(this.subject))
      .subscribe(
        (t) => (this.currentStep = this.$StepService.getCurrentStep(t))
      );
  }
}
