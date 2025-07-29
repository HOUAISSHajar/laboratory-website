
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
  announcements = [
    { image: 'assets/images/announcement1.jpg', title: 'Announcement 1' },
    { image: 'assets/images/announcement2.jpg', title: 'Announcement 2' },
    // Add more announcements
  ];

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
    this.projectService.getAllProjects().subscribe(
      projects => this.recentProjects = projects.slice(0, 3)
    );
  }

  private loadRecentPublications() {
    this.publicationService.getAllPublications().subscribe(
      publications => this.recentPublications = publications.slice(0, 3)
    );
  }

  private loadUpcomingEvents() {
    this.activityService.getAllActivities().subscribe(
      activities => this.upcomingEvents = activities.slice(0, 3)
    );
  }
}