import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
  @Input({ required: true }) control: AbstractControl;

  get hasError(): boolean {
    if (!this.control) return false;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessages(): string[] {
    const res: string[] = [];

    if (!this.hasError) return res;

    if (this.control.hasError('mustContainDigit'))
      res.push("Must have at least one digit ('0'-'9').");
    if (this.control.hasError('mustContainLowercase'))
      res.push("Must have at least one lowercase letter ('a'-'z').");
    if (this.control.hasError('mustContainUppercase'))
      res.push("Must have at least one uppercase letter ('A'-'Z').");
    if (this.control.hasError('mustContainNonAlphanumeric'))
      res.push('Must have at least one non alphanumeric character.');
    if (this.control.hasError('minlength')) {
      res.push(
        `Must be at least ${
          this.control.getError('minlength').requiredLength
        } characters long`
      );
    }

    if (!res.length && this.control.hasError('required')) {
      res.push('Required');
    }

    return res;
  }
}
