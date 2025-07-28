import { Component, OnInit } from '@angular/core';
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

  constructor(
    private projectService: ProjectService,
    private publicationService: PublicationService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.loadRecentProjects();
    this.loadRecentPublications();
    this.loadUpcomingEvents();
  }

  private loadRecentProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.recentProjects = projects.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.recentProjects = [];
      }
    });
  }

  private loadRecentPublications() {
    this.publicationService.getAllPublications().subscribe({
      next: (publications) => {
        this.recentPublications = publications.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading publications:', error);
        this.recentPublications = [];
      }
    });
  }

  private loadUpcomingEvents() {
    this.activityService.getAllActivities().subscribe({
      next: (activities) => {
        // Filtrer les événements futurs
        const now = new Date();
        this.upcomingEvents = activities
          .filter((activity: any) => new Date(activity.date) >= now)
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.upcomingEvents = [];
      }
    });
  }
}