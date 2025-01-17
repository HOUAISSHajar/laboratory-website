import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'projects', 
        loadChildren: () => import('./projects/projects.module')
          .then(m => m.ProjectsModule) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'publications',
        loadChildren: () => import('./publications/publications.module').then(m => m.PublicationsModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // ... other routes ...
      {
        path: 'activities',
        loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule)
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
