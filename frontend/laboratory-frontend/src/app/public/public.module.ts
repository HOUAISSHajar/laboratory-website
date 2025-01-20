
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
// Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'ngx-bootstrap/carousel'; // We'll use this for the carousel

@NgModule({
  declarations: [
    HomeComponent,
    PublicLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PublicRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CarouselModule.forRoot()
  ]
})
export class PublicModule { }
