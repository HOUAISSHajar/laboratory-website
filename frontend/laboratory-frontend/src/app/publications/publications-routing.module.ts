import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicationListComponent } from './publication-list/publication-list.component';
import { PublicationDetailComponent } from './publication-detail/publication-detail.component';
import { PublicationFormComponent } from './publication-form/publication-form.component';

const routes: Routes = [
  { path: '', component: PublicationListComponent },
  { path: 'new', component: PublicationFormComponent },
  { path: 'edit/:id', component: PublicationFormComponent },
  { path: ':id', component: PublicationDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationsRoutingModule { }