// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-main-layout',
//   standalone: false,
  
//   templateUrl: './main-layout.component.html',
//   styleUrl: './main-layout.component.scss'
// })
// export class MainLayoutComponent {

// }

//-------------------------------------------------------------------------------------------------------------------//
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-main-layout',
  standalone: false,
  
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.role === 'administrator';
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


/////-----------------------------------------------------------------------------
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatSidenav } from '@angular/material/sidenav';
// import { Router } from '@angular/router';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-main-layout',
//   templateUrl: './main-layout.component.html',
//   styleUrls: ['./main-layout.component.scss']
// })
// export class MainLayoutComponent implements OnInit {
//   @ViewChild('sidenav') sidenav!: MatSidenav;
//   isAdmin = false;

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     const currentUser = this.authService.getCurrentUser();
//     this.isAdmin = currentUser?.role === 'administrator';
//   }

//   toggleSidebar() {
//     this.sidenav.toggle();
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }
// }
