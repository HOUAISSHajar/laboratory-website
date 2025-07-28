
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-messages',
  standalone: false,
  
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  inboxMessages: any[] = [];
  sentMessages: any[] = [];
  users: any[] = [];
  messageForm: FormGroup;
  selectedTabIndex = 0;
  loading = false;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.messageForm = this.fb.group({
      receiverId: ['', Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  //open message dialog
  openMessageDialog(message: any, isSentMessage: boolean) {
    if (!isSentMessage && !message.isRead) {
      this.markAsRead(message._id);
    }
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: { message, isSentMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'delete') {
          this.deleteMessage(result.messageId);
        } else if (result.action === 'resend') {
          // Update the form with the resend data
          this.messageForm.patchValue({
            receiverId: result.data.receiverId,
            subject: result.data.subject,
            content: result.data.content
          });
          // Call the existing sendMessage method
          this.sendMessage();
        }
      }
    });
  }
  //delete message dialog
  deleteMessage(messageId: string) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.snackBar.open('Message deleted successfully', 'Close', { duration: 3000 });
        this.loadMessages(); // Reload messages after deletion
      },
      error: (error) => {
        this.snackBar.open('Error deleting message', 'Close', { duration: 3000 });
      }
    });
  }


  ngOnInit() {
    this.loadMessages();
    this.loadUsers();
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getInboxMessages().subscribe({
      next: (messages) => {
        this.inboxMessages = messages;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading messages', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });

    this.messageService.getSentMessages().subscribe({
      next: (messages) => {
        this.sentMessages = messages;
      }
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      }
    });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      this.loading = true;
      this.messageService.sendMessage(this.messageForm.value).subscribe({
        next: () => {
          this.snackBar.open('Message sent successfully', 'Close', { duration: 3000 });
          this.messageForm.reset();
          this.loadMessages();
          this.loading = false;
          this.selectedTabIndex = 2; // Switch to Sent tab after sending
        },
        error: (error) => {
          this.snackBar.open('Error sending message', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  markAsRead(messageId: string) {
    this.messageService.markAsRead(messageId).subscribe({
      next: () => {
        const message = this.inboxMessages.find(m => m._id === messageId);
        if (message) {
          message.isRead = true;
        }
      }
    });
  }
}