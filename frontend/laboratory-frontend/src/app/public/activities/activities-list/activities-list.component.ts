

import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../../core/services/activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activities-list',
  standalone: false,
  
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss'
})
export class ActivitiesListComponent implements OnInit {
  activities: any[] = [];
  filteredActivities: any[] = [];
  isLoading = true;
  selectedType: string = 'all';
  activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'conference', label: 'Conferences' },
    { value: 'seminar', label: 'Seminars' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'training', label: 'Training Sessions' },
    { value: 'research_mission', label: 'Research Missions' }
  ];

  constructor(
    private activityService: ActivityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    this.isLoading = true;
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.filterActivities();
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading activities', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  filterActivities() {
    if (this.selectedType === 'all') {
      this.filteredActivities = this.activities;
    } else {
      this.filteredActivities = this.activities.filter(
        activity => activity.type === this.selectedType
      );
    }
  }

  onTypeChange() {
    this.filterActivities();
  }
}