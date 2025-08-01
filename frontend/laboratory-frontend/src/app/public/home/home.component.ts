import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { PublicationService } from '../../core/services/publication.service';
import { ActivityService } from '../../core/services/activity.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  recentProjects: any[] = [];
  recentPublications: any[] = [];
  upcomingEvents: any[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private publicationService: PublicationService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.loadHomeData();
  }

  private loadHomeData() {
    this.isLoading = true;

    // Charger les projets récents
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        // Prendre les 3 projets les plus récents
        this.recentProjects = projects
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.recentProjects = [];
      }
    });

    // Charger les publications récentes
    this.publicationService.getAllPublications().subscribe({
      next: (publications) => {
        // Prendre les 3 publications les plus récentes
        this.recentPublications = publications
          .sort((a: any, b: any) => b.year - a.year || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading publications:', error);
        this.recentPublications = [];
      }
    });

    // Charger les événements à venir
    this.activityService.getAllActivities().subscribe({
      next: (activities) => {
        const now = new Date();
        // Filtrer les événements futurs et non archivés
        this.upcomingEvents = activities
          .filter((activity: any) => new Date(activity.date) > now && !activity.isArchived)
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.upcomingEvents = [];
        this.isLoading = false;
      }
    });
  }

  // Méthodes de navigation
  navigateToPublications() {
    this.router.navigate(['/public/publications']);
  }

  navigateToActivities() {
    this.router.navigate(['/public/activities']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Méthodes utilitaires pour les templates
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'ongoing': 'status-ongoing',
      'completed': 'status-completed',
      'pending': 'status-pending'
    };
    return statusClasses[status] || 'status-default';
  }

  getTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      'conference': 'campaign',
      'seminar': 'school',
      'workshop': 'build',
      'training': 'fitness_center',
      'research_mission': 'explore'
    };
    return typeIcons[type] || 'event';
  }

  formatAuthors(authors: any[]): string {
    if (!authors || authors.length === 0) return 'No authors';
    if (authors.length === 1) return `${authors[0].firstName} ${authors[0].lastName}`;
    if (authors.length === 2) return `${authors[0].firstName} ${authors[0].lastName} & ${authors[1].firstName} ${authors[1].lastName}`;
    return `${authors[0].firstName} ${authors[0].lastName} et al.`;
  }
}