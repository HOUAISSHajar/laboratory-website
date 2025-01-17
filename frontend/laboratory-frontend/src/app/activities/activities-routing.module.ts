import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';

const routes: Routes = [
  { path: '', component: ActivityListComponent },
  { path: 'new', component: ActivityFormComponent },
  { path: 'edit/:id', component: ActivityFormComponent },
  { path: ':id', component: ActivityDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesRoutingModule { }