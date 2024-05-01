import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-whats-app-btn',
  templateUrl: './whats-app-btn.component.html',
  styleUrl: './whats-app-btn.component.css'
})
export class WhatsAppBtnComponent {
  scrollPosition = 0;
  whatsAppMessage = "";
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.scrollPosition = window.scrollY;
    this.updateButtonPosition();
  }

  updateButtonPosition(): void {
    const stickyButton = document.getElementById('sticky-button');
    if (this.scrollPosition > 60) {
      stickyButton!.style.bottom = '100px';
    } else {
      stickyButton!.style.bottom = '50px';
    }
  }
}
