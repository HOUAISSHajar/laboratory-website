
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'; // Add this for ngModel
// Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ActivitiesListComponent } from './activities/activities-list/activities-list.component';
import { ActivityDetailComponent } from './activities/activity-detail/activity-detail.component'; // We'll use this for the carousel
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field'; // Add this
import { MatSelectModule } from '@angular/material/select'; // Add this
import { MatInputModule } from '@angular/material/input'; // Add this
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicationsListComponent } from './publications/publications-list/publications-list.component';
import { PublicationDetailComponent } from './publications/publication-detail/publication-detail.component';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    HomeComponent,
    PublicLayoutComponent,
    ActivitiesListComponent,
    ActivityDetailComponent,
    PublicationsListComponent,
    PublicationDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatChipsModule,
    CarouselModule.forRoot()
  ]
})
export class PublicModule { }
