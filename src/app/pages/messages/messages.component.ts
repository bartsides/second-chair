import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import Message from '../../models/message';
import { TrialDetails } from '../../models/trial-details';
import { UserProfile } from '../../models/user-profile';
import { MessageService } from '../../services/message.service';
import { TrialService } from '../../services/trial.service';
import { UserService } from '../../services/user.service';

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
  userProfile: UserProfile | null = null;

  isCurrentUser(message: Message): boolean {
    if (!this.userProfile || !message) return false;
    return this.userProfile.userId == message.addedById;
  }

  constructor(
    private $MessageService: MessageService,
    private $TrialService: TrialService,
    private $UserService: UserService
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
    this.$MessageService.messages$
      .pipe(takeUntil(this.notifier$))
      .subscribe((message) => {
        if (
          message.trialId == this.trialId &&
          this.messages.every((m) => m.id != message.id)
        ) {
          this.messages.push(message);
        }
      });
    this.$UserService.user$
      .pipe(takeUntil(this.notifier$))
      .subscribe((userProfile) => (this.userProfile = userProfile));
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  send() {
    if (this.trial) {
      this.$MessageService
        .sendMessage(crypto.randomUUID(), this.trial.id, this.message)
        .subscribe({ error: (err) => console.error(err) });
      this.message = '';
    }
  }

  loadMessages() {
    this.$MessageService.getMessages(this.trialId).subscribe({
      next: (res) => {
        this.messages = res?.messages ?? [];
        this.messagesLoaded = true;
      },
      error: (err) => console.error(err),
    });
  }
}
