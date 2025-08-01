import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Routes publiques (site vitrine)
  {
    path: 'public',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
  },
  
  // Page de login
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  // Routes privées (dashboard)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'publications',
        loadChildren: () => import('./publications/publications.module').then(m => m.PublicationsModule)
      },
      {
        path: 'activities',
        loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule)
      },
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      }
    ]
  },
  
  // Redirections par défaut
  { 
    path: '', 
    redirectTo: '/public', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/public' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }