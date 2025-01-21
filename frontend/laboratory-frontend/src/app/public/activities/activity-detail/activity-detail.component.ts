
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../../core/services/activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activity-detail',
  standalone: false,
  
  templateUrl: './activity-detail.component.html',
  styleUrl: './activity-detail.component.scss'
})
export class ActivityDetailComponent implements OnInit {
  activity: any = null;
  isLoading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit() {
    const activityId = this.route.snapshot.paramMap.get('id');
    if (activityId) {
      this.loadActivity(activityId);
    }
  }

  loadActivity(id: string) {
    this.isLoading = true;
    this.activityService.getActivityById(id).subscribe({
      next: (data) => {
        this.activity = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Activity not found or error loading activity details';
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getActivityTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      conference: 'Conference',
      seminar: 'Seminar',
      workshop: 'Workshop',
      training: 'Training Session',
      research_mission: 'Research Mission'
    };
    return types[type] || type;
  }

  goBack() {
    this.location.back();
  }
}