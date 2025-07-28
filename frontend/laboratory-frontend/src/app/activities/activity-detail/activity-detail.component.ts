import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity-detail',
  standalone: false,
  templateUrl: './activity-detail.component.html',
  styleUrl: './activity-detail.component.scss'
})
export class ActivityDetailComponent implements OnInit {
  activity: any = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const activityId = this.route.snapshot.paramMap.get('id');
    if (activityId) {
      this.loadActivity(activityId);
    }
  }

  private loadActivity(id: string) {
    this.activityService.getActivityById(id).subscribe({
      next: (data) => {
        this.activity = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading activity', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getTypeDisplayName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'conference': 'Conference',
      'seminar': 'Seminar',
      'workshop': 'Workshop',
      'training': 'Training',
      'research_mission': 'Research Mission'
    };
    return typeMap[type] || type;
  }

  getStatusDisplayName(isArchived: boolean): string {
    return isArchived ? 'Archived' : 'Active';
  }

  getStatusColor(isArchived: boolean): string {
    return isArchived ? 'warn' : 'primary';
  }
}