
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private snackBar: MatSnackBar
  ) {
    this.messageForm = this.fb.group({
      receiverId: ['', Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required]
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
// export class MessagesComponent implements OnInit {
//   inboxMessages: any[] = [];
//   sentMessages: any[] = [];
//   users: any[] = [];
//   messageForm: FormGroup;
//   activeTab = 'inbox';
//   loading = false;

//   constructor(
//     private messageService: MessageService,
//     private userService: UserService,
//     private fb: FormBuilder,
//     private snackBar: MatSnackBar
//   ) {
//     this.messageForm = this.fb.group({
//       receiverId: ['', Validators.required],
//       subject: ['', Validators.required],
//       content: ['', Validators.required]
//     });
//   }

//   ngOnInit() {
//     this.loadMessages();
//     this.loadUsers();
//   }

//   loadMessages() {
//     this.loading = true;
//     this.messageService.getInboxMessages().subscribe({
//       next: (messages) => {
//         this.inboxMessages = messages;
//         this.loading = false;
//       },
//       error: (error) => {
//         this.snackBar.open('Error loading messages', 'Close', { duration: 3000 });
//         this.loading = false;
//       }
//     });

//     this.messageService.getSentMessages().subscribe({
//       next: (messages) => {
//         this.sentMessages = messages;
//       }
//     });
//   }

//   loadUsers() {
//     this.userService.getAllUsers().subscribe({
//       next: (users) => {
//         this.users = users;
//       }
//     });
//   }

//   sendMessage() {
//     if (this.messageForm.valid) {
//       this.loading = true;
//       this.messageService.sendMessage(this.messageForm.value).subscribe({
//         next: () => {
//           this.snackBar.open('Message sent successfully', 'Close', { duration: 3000 });
//           this.messageForm.reset();
//           this.loadMessages();
//           this.loading = false;
//         },
//         error: (error) => {
//           this.snackBar.open('Error sending message', 'Close', { duration: 3000 });
//           this.loading = false;
//         }
//       });
//     }
//   }

//   markAsRead(messageId: string) {
//     this.messageService.markAsRead(messageId).subscribe({
//       next: () => {
//         const message = this.inboxMessages.find(m => m._id === messageId);
//         if (message) {
//           message.isRead = true;
//         }
//       }
//     });
//   }
// }
// export class MessagesComponent implements OnInit {
//   inboxMessages: any[] = [];
//   sentMessages: any[] = [];
//   users: any[] = [];
//   messageForm: FormGroup;
//   selectedTabIndex = 0; // Add this line
//   loading = false;

//   constructor(
//     private messageService: MessageService,
//     private userService: UserService,
//     private fb: FormBuilder,
//     private snackBar: MatSnackBar
//   ) {
//     this.messageForm = this.fb.group({
//       receiverId: ['', Validators.required],
//       subject: ['', Validators.required],
//       content: ['', Validators.required]
//     });
//   }

//   ngOnInit() {
//     this.loadMessages();
//     this.loadUsers();
//   }

//   // Add this method
//   onTabChange(event: any) {
//     this.selectedTabIndex = event.index;
//   }

//   loadMessages() {
//     this.loading = true;
//     this.messageService.getInboxMessages().subscribe({
//       next: (messages) => {
//         this.inboxMessages = messages;
//         this.loading = false;
//       },
//       error: (error) => {
//         this.snackBar.open('Error loading messages', 'Close', { duration: 3000 });
//         this.loading = false;
//       }
//     });

//     this.messageService.getSentMessages().subscribe({
//       next: (messages) => {
//         this.sentMessages = messages;
//       }
//     });
//   }

//   loadUsers() {
//     this.userService.getAllUsers().subscribe({
//       next: (users) => {
//         this.users = users;
//       }
//     });
//   }

//   sendMessage() {
//     if (this.messageForm.valid) {
//       this.loading = true;
//       this.messageService.sendMessage(this.messageForm.value).subscribe({
//         next: () => {
//           this.snackBar.open('Message sent successfully', 'Close', { duration: 3000 });
//           this.messageForm.reset();
//           this.loadMessages();
//           this.loading = false;
//         },
//         error: (error) => {
//           this.snackBar.open('Error sending message', 'Close', { duration: 3000 });
//           this.loading = false;
//         }
//       });
//     }
//   }

//   markAsRead(messageId: string) {
//     this.messageService.markAsRead(messageId).subscribe({
//       next: () => {
//         const message = this.inboxMessages.find(m => m._id === messageId);
//         if (message) {
//           message.isRead = true;
//         }
//       }
//     });
//   }
// }
