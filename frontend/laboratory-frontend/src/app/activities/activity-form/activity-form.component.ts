import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity-form',
  standalone: false,
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss'
})
export class ActivityFormComponent implements OnInit {
  activityForm: FormGroup;
  isEditing = false;
  activityId: string | null = null;
  isLoading = false;
  availableOrganizers: any[] = [];
  availableParticipants: any[] = [];
  currentUserId: string = '';

  activityTypes = [
    { value: 'conference', label: 'Conference' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'training', label: 'Training' },
    { value: 'research_mission', label: 'Research Mission' }
  ];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      organizers: [[]],
      participants: [[]]
    });
  }

  ngOnInit() {
    // Get current user ID
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || '';
    
    this.loadUsers();
    this.activityId = this.route.snapshot.paramMap.get('id');
    if (this.activityId) {
      this.isEditing = true;
      this.loadActivity(this.activityId);
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // For organizers: exclude current user, administrators, and associated_members
        this.availableOrganizers = users.filter((user: any) => 
          ['faculty_researcher', 'phd_researcher'].includes(user.role) && 
          user._id !== this.currentUserId
        );

        // For participants: exclude only current user
        this.availableParticipants = users.filter((user: any) => 
          user._id !== this.currentUserId
        );
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadActivity(id: string) {
    this.isLoading = true;
    this.activityService.getActivityById(id).subscribe({
      next: (activity) => {
        // Format date for input
        const formattedDate = new Date(activity.date).toISOString().slice(0, 16);
        
        this.activityForm.patchValue({
          title: activity.title,
          type: activity.type,
          description: activity.description,
          date: formattedDate,
          location: activity.location,
          organizers: activity.organizers.map((organizer: any) => organizer._id),
          participants: activity.participants.map((participant: any) => participant._id)
        });

        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading activity', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this.isLoading = true;
      const activityData = {
        ...this.activityForm.value,
        date: new Date(this.activityForm.value.date).toISOString()
      };

      const request = this.isEditing
        ? this.activityService.updateActivity(this.activityId!, activityData)
        : this.activityService.createActivity(activityData);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Activity ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/activities']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditing ? 'updating' : 'creating'} activity`,
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    }
  }
}