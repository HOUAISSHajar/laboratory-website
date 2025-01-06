import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { AuthGuard } from '../core/guards/auth.guard';

// const routes: Routes = [
//   {
//     path: 'projects',
//     children: [
//       { path: '', component: ProjectListComponent },
//       { path: 'new', component: ProjectFormComponent },
//       { path: 'edit/:id', component: ProjectFormComponent },
//       { path: ':id', component: ProjectDetailComponent }
//     ]
//   }
// ];
const routes: Routes = [
  { path: '', component: ProjectListComponent }, // This is important
  { path: 'new', component: ProjectFormComponent },
  { path: 'edit/:id', component: ProjectFormComponent },
  { path: ':id', component: ProjectDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }