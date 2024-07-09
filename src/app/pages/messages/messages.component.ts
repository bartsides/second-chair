import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MessagingComponent } from '../../components/messaging/messaging.component';
import { SecondToolbarComponent } from '../../components/second-toolbar/second-toolbar.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [SecondToolbarComponent, MessagingComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnDestroy {
  notifier$ = new Subject();

  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
}
