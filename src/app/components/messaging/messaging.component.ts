import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { LoadingComponent } from '../loading/loading.component';
import { SecondToolbarComponent } from '../second-toolbar/second-toolbar.component';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SecondToolbarComponent,
  ],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss',
})
export class MessagingComponent implements OnInit, OnDestroy {
  @Input({ required: true }) containerId: string;

  messageContent: string;
  messages: Message[] = [];
  loading = true;
  messagesLoaded = false;
  trial: TrialDetails | null;
  trialId: string;
  notifier$ = new Subject();
  userProfile: UserProfile | null = null;
  messagingContainerName = 'messages-container';

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
          this.messages = [...this.messages];
          if (this.isScrolledNearBottom()) {
            // Only scroll down if already near bottom
            // Otherwise user is scrolled up to read a message
            setTimeout(this.scrollToBottom, 50, this.messagingContainerName);
          }
        }
      });
    this.$UserService.user$
      .pipe(takeUntil(this.notifier$))
      .subscribe((userProfile) => (this.userProfile = userProfile));
  }

  ngOnInit(): void {
    this.messagingContainerName = `messages-container-${this.containerId}`;
    this.scrollToBottom(this.messagingContainerName);
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
        setTimeout(this.scrollToBottom, 50, this.messagingContainerName);
      },
      error: (err) => console.error(err),
    });
  }

  isScrolledNearBottom(): boolean {
    let container = document
      .getElementsByClassName(this.messagingContainerName)
      .item(0);
    if (!container) return false;
    let scrollHeight = container.scrollHeight - container.clientHeight;
    return container.scrollTop - scrollHeight >= -20;
  }

  scrollToBottom(containerName: string) {
    let container = document.getElementsByClassName(containerName).item(0);
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }

  trackMessages(_: number, message: Message): string {
    return message.id;
  }
}
