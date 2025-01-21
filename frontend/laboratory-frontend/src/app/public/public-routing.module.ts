
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { ActivitiesListComponent } from './activities/activities-list/activities-list.component';
import { ActivityDetailComponent } from './activities/activity-detail/activity-detail.component';
import {PublicationsListComponent} from './publications/publications-list/publications-list.component';
import {PublicationDetailComponent} from './publications/publication-detail/publication-detail.component';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'activities', component: ActivitiesListComponent },
      { path: 'activities/:id', component: ActivityDetailComponent },
      { path: 'publications', component: PublicationsListComponent },
      { path: 'publications/:id', component: PublicationDetailComponent }

      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }