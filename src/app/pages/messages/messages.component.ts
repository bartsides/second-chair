import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { SecondToolbarComponent } from '../../components/second-toolbar/second-toolbar.component';
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
    LoadingComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SecondToolbarComponent,
    ScrollingModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnDestroy {
  messageContent: string;
  messages: Message[] = [];
  loading = true;
  messagesLoaded = false;
  trial: TrialDetails | null;
  trialId: string;
  notifier$ = new Subject();
  userProfile: UserProfile | null = null;

  get container(): Element | null {
    return document.getElementsByClassName('messages').item(0);
  }

  isCurrentUser(message: Message): boolean {
    if (!this.userProfile || !message) return false;
    return this.userProfile.userId == message.addedById;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
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
          this.messages = [...this.messages];
          if (this.isScrolledNearBottom()) {
            // Only scroll down if already near bottom
            // Otherwise user is scrolled up to read a message
            setTimeout(this.scrollToBottom, 50);
          }
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
    if (this.trial && this.messageContent) {
      this.$MessageService
        .sendMessage(crypto.randomUUID(), this.trial.id, this.messageContent)
        .then()
        .catch((err) => console.error(err));
      this.messageContent = '';
    }
  }

  loadMessages() {
    this.messagesLoaded = true;
    this.$MessageService.getMessages(this.trialId).subscribe({
      next: (res) => {
        this.messages = res?.messages ?? [];
        this.loading = false;
        setTimeout(this.scrollToBottom, 50);
      },
      error: (err) => console.error(err),
    });
  }

  isScrolledNearBottom(): boolean {
    let container = this.container;
    if (!container) return false;

    let scrollHeight = container.scrollHeight - container.clientHeight;
    return container.scrollTop - scrollHeight >= -20;
  }

  private scrollToBottom() {
    let container = this.container;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }

  trackMessages(_: number, message: Message): string {
    return message.id;
  }
}
