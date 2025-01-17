import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PublicationsRoutingModule } from './publications-routing.module';
import { PublicationListComponent } from './publication-list/publication-list.component';
import { PublicationDetailComponent } from './publication-detail/publication-detail.component';
import { PublicationFormComponent } from './publication-form/publication-form.component';
// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
@NgModule({
  declarations: [
    PublicationListComponent,
    PublicationDetailComponent,
    PublicationFormComponent
  ],
  imports: [
    CommonModule,
    PublicationsRoutingModule,
    ReactiveFormsModule,
    // Material Modules
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule
  ]
})
export class PublicationsModule { }
