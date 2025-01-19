import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages/messages.component';
// Import all required Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    ReactiveFormsModule,
    // Add all Material modules
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class MessagesModule { }
