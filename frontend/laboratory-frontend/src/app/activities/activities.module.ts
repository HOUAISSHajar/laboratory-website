import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    ActivityListComponent,
    ActivityDetailComponent,
    ActivityFormComponent
  ],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    ReactiveFormsModule,
    // Material Modules
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class ActivitiesModule { }
