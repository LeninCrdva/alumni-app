import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  activeMenuItem: string = localStorage.getItem('activeMenuItem') || 'Dashboard';

  constructor(private router: Router) { }

  setActiveMenuItem(menuItem: string, route: string): void {
    this.activeMenuItem = menuItem;
    localStorage.setItem('activeMenuItem', menuItem);

    this.router.navigate(["system/career-manager/" + route]);
  }

}
