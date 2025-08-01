import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {
  
  constructor(private router: Router) {}

  // Méthodes de navigation (optionnelles, pour usage futur)
  navigateToHome() {
    this.router.navigate(['/public']);
  }

  navigateToActivities() {
    this.router.navigate(['/public/activities']);
  }

  navigateToPublications() {
    this.router.navigate(['/public/publications']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}