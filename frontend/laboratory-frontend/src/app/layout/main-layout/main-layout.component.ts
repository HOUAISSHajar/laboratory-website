import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

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
export class MainLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // États du composant
  isAdmin = false;
  userRole = '';
  currentUser: User | null = null;
  userDisplayName = '';
  sidebarCollapsed = false;
  isMobile = false;
  mobileMenuOpen = false;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    // Subscribe aux changements d'utilisateur
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.isAdmin = user.role === 'administrator';
          this.userRole = user.role;
          this.userDisplayName = `${user.firstName} ${user.lastName}`;
        }
      });

    // Subscribe aux changements de route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        // Fermer le menu mobile après navigation
        if (this.isMobile) {
          this.mobileMenuOpen = false;
        }
      });

    // Initialiser l'état de la sidebar selon la taille d'écran
    this.initializeSidebarState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  /**
   * Vérifie la taille de l'écran et ajuste les états
   */
  private checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Si on passe de mobile à desktop ou vice versa
    if (wasMobile !== this.isMobile) {
      this.initializeSidebarState();
    }
  }

  /**
   * Initialise l'état de la sidebar selon la taille d'écran
   */
  private initializeSidebarState() {
    if (this.isMobile) {
      this.mobileMenuOpen = false;
      this.sidebarCollapsed = false;
    } else {
      // Récupérer l'état sauvegardé ou utiliser une valeur par défaut
      const savedState = localStorage.getItem('sidebarCollapsed');
      this.sidebarCollapsed = savedState ? JSON.parse(savedState) : false;
    }
  }

  /**
   * Toggle la sidebar (mobile et desktop)
   */
  toggleSidebar() {
    if (this.isMobile) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      // Sauvegarder l'état
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
    }
  }

  /**
   * Toggle le collapse de la sidebar (desktop seulement)
   */
  toggleSidebarCollapse() {
    if (!this.isMobile) {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
    }
  }

  /**
   * Ferme le menu mobile
   */
  closeMobileMenu() {
    if (this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  /**
   * Vérifie si une route est active
   */
  isActiveRoute(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  /**
   * Déconnexion avec animation améliorée
   */
  logout() {
    // Animation de déconnexion plus fluide
    const userInfo = document.querySelector('.user-info');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userInfo) {
      userInfo.classList.add('fade-out');
    }
    if (userAvatar) {
      userAvatar.classList.add('scale-out');
    }

    // Affichage d'un message de déconnexion (optionnel)
    this.showLogoutMessage();

    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    }, 400);
  }

  /**
   * Affiche un message de déconnexion temporaire
   */
  private showLogoutMessage() {
    // Vous pouvez implémenter une notification toast ici
    console.log('Déconnexion en cours...');
  }

  /**
   * Retourne le nom d'affichage du rôle avec traduction
   */
  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'administrator': 'Administrator',
      'faculty_researcher': 'Faculty Researcher',
      'phd_researcher': 'PhD Researcher',
      'associated_member': 'Associated Member'
    };
    return roleMap[role] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Retourne la couleur du badge selon le rôle avec palette étendue
   */
  getRoleBadgeColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      'administrator': '#ef4444',      // Rouge pour admin
      'faculty_researcher': '#3b82f6', // Bleu pour faculty
      'phd_researcher': '#10b981',     // Vert pour PhD
      'associated_member': '#f59e0b'   // Orange pour associé
    };
    return colorMap[role] || '#6b7280';
  }

  /**
   * Retourne l'icône appropriée selon le rôle
   */
  getRoleIcon(role: string): string {
    const iconMap: { [key: string]: string } = {
      'administrator': 'admin_panel_settings',
      'faculty_researcher': 'school',
      'phd_researcher': 'psychology',
      'associated_member': 'people'
    };
    return iconMap[role] || 'person';
  }

  /**
   * Navigation programmée avec animation améliorée
   */
  navigateTo(route: string) {
    // Ajouter une classe d'animation avant la navigation
    const content = document.querySelector('.content-wrapper');
    if (content) {
      content.classList.add('page-transition');
    }

    // Fermer le menu utilisateur si ouvert
    const userMenu = document.querySelector('.mat-mdc-menu-panel');
    if (userMenu) {
      userMenu.classList.add('menu-closing');
    }

    setTimeout(() => {
      this.router.navigate([route]);
      if (content) {
        content.classList.remove('page-transition');
      }
    }, 200);
  }

  /**
   * Gestion du click sur l'overlay mobile
   */
  onOverlayClick() {
    this.closeMobileMenu();
  }

  /**
   * Empêche la propagation du click sur la sidebar
   */
  onSidebarClick(event: Event) {
    event.stopPropagation();
  }

  /**
   * Retourne les statistiques de navigation avec des données réelles
   */
  getNavigationStats() {
    // Cette fonction peut être connectée à votre service de données
    return {
      unreadMessages: 3,
      pendingProjects: 1,
      newActivities: 5,
      totalNotifications: 9
    };
  }

  /**
   * Gestion des raccourcis clavier étendus
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    // Ctrl/Cmd + B pour toggle la sidebar
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      this.toggleSidebarCollapse();
    }

    // Escape pour fermer le menu mobile
    if (event.key === 'Escape' && this.isMobile && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }

    // Ctrl/Cmd + Shift + L pour déconnexion rapide
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
      event.preventDefault();
      this.logout();
    }

    // Alt + P pour aller au profil (si disponible)
    if (event.altKey && event.key === 'p' && 
        (this.userRole === 'faculty_researcher' || this.userRole === 'phd_researcher')) {
      event.preventDefault();
      this.navigateTo('/profile');
    }
  }

  /**
   * Animation d'entrée pour les éléments de navigation
   */
  getNavItemStyle(index: number) {
    return {
      'animation-delay': `${index * 0.05}s`,
      'animation-fill-mode': 'both'
    };
  }

  /**
   * Retourne le titre de la page actuelle avec traduction
   */
  getCurrentPageTitle(): string {
    const titleMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard Overview',
      '/projects': 'Research Projects',
      '/publications': 'Publications & Papers',
      '/activities': 'Academic Activities',
      '/users': 'User Management',
      '/contacts': 'Contact Messages',
      '/messages': 'Internal Messages',
      '/profile': 'User Profile'
    };

    const currentPath = this.currentRoute.split('?')[0]; // Enlever les query params
    return titleMap[currentPath] || 'FSAC Laboratory';
  }

  /**
   * Retourne les initiales de l'utilisateur pour l'avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  /**
   * Vérifie si l'utilisateur a des permissions spéciales
   */
  hasPermission(permission: string): boolean {
    const permissions: { [key: string]: string[] } = {
      'manage_users': ['administrator'],
      'view_contacts': ['administrator'],
      'edit_profile': ['faculty_researcher', 'phd_researcher'],
      'create_projects': ['administrator', 'faculty_researcher'],
      'publish_content': ['administrator', 'faculty_researcher', 'phd_researcher']
    };

    return permissions[permission]?.includes(this.userRole) || false;
  }

  /**
   * Formatage de la date de dernière connexion
   */
  getLastLoginFormatted(): string {
    // Cette fonction peut être connectée à votre service d'authentification
    return 'Today at 10:30 AM';
  }

  /**
   * Retourne le statut en ligne de l'utilisateur
   */
  getUserOnlineStatus(): 'online' | 'away' | 'offline' {
    // Cette fonction peut être connectée à votre service de présence
    return 'online';
  }

  /**
   * Gestion du thème sombre/clair (extension future)
   */
  toggleTheme() {
    // Implémentation future pour le mode sombre
    const isDark = document.body.classList.contains('dark-theme');
    document.body.classList.toggle('dark-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }
}