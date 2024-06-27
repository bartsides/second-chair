import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import Message from '../../models/message';
import { TrialDetails } from '../../models/trial-details';
import { MessagesService } from '../../services/messages.service';
import { TrialService } from '../../services/trial.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnDestroy {
  message: string;
  messages: Message[] = [];
  messagesLoaded = false;
  trial: TrialDetails | null;
  trialId: string;
  notifier$ = new Subject();

  constructor(
    private $MessagesService: MessagesService,
    private $TrialService: TrialService
  ) {
    this.$TrialService.trial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((trial) => {
        this.trial = trial;
        if (this.trial) {
          this.trialId = this.trial.id;
          if (!this.messagesLoaded) this.loadMessages();
        }
      });
    this.$MessagesService.messages$
      .pipe(takeUntil(this.notifier$))
      .subscribe((message) => {
        this.messages.push(message);
      });
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  send() {
    if (this.trial) {
      this.$MessagesService
        .sendMessage(crypto.randomUUID(), this.trial.id, this.message)
        .subscribe();
      this.message = '';
    }
  }

  loadMessages() {
    this.$MessagesService.getMessages(this.trialId).subscribe((res) => {
      this.messages = res?.messages ?? [];
      this.messagesLoaded = true;
    });
  }
}
