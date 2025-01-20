
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-message-dialog',
  standalone: false,
  
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.scss'
})

export class MessageDialogComponent {
  messageForm: FormGroup;
  isEditing: boolean = false;
  isSentMessage: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.isSentMessage = data.isSentMessage;
    this.messageForm = this.fb.group({
      receiverId: [{ value: data.message.receiver?._id, disabled: true }],
      subject: [{ value: data.message.subject, disabled: true }],
      content: [{ value: data.message.content, disabled: true }]
    });
  }

  enableEditing() {
    this.isEditing = true;
    this.messageForm.enable();
  }

  onSubmit() {
    if (this.messageForm.valid) {
      this.dialogRef.close({
        action: 'resend',
        data: this.messageForm.value
      });
    }
  }

  onDelete() {
    this.dialogRef.close({
      action: 'delete',
      messageId: this.data.message._id
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}