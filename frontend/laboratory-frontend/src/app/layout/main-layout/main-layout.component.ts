import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isAdmin = false;
  userRole = '';
  currentUser: User | null = null;
  userDisplayName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to current user changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.isAdmin = user.role === 'administrator';
        this.userRole = user.role;
        this.userDisplayName = `${user.firstName} ${user.lastName}`;
      }
    });
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'administrator': 'Administrator',
      'faculty_researcher': 'Faculty Researcher',
      'phd_researcher': 'PhD Researcher',
      'associated_member': 'Associated Member'
    };
    return roleMap[role] || role;
  }
}