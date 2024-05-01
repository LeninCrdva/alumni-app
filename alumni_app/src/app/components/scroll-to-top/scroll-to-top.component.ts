import { Component, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css']
})
export class ScrollToTopComponent implements OnInit {
  private scrollProgress: HTMLElement | null;
  private progressValue: HTMLElement | null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.scrollProgress = null;
    this.progressValue = null;
  }

  ngOnInit(): void {
    this.scrollProgress = this.el.nativeElement.querySelector('#progress');
    this.progressValue = this.el.nativeElement.querySelector('#progress-value');
    this.calcScrollValue();

    // Listener para el evento de scroll
    this.renderer.listen('window', 'scroll', () => {
      this.calcScrollValue();
    });

    // Listener para el evento de carga de la ventana
    this.renderer.listen('window', 'load', () => {
      this.calcScrollValue();
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    this.calcScrollValue();
  }

  private calcScrollValue(): void {
    if (!this.scrollProgress || !this.progressValue) {
      return;
    }

    const pos = document.documentElement.scrollTop;
    const calcHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollValue = Math.round((pos * 100) / calcHeight);

    if (pos > 100) {
      this.renderer.setStyle(this.scrollProgress, 'display', 'grid');
    } else {
      this.renderer.setStyle(this.scrollProgress, 'display', 'none');
    }

    this.scrollProgress.addEventListener('click', () => {
      document.documentElement.scrollTop = 0;
    });

    this.renderer.setStyle(
      this.scrollProgress,
      'background',
      `conic-gradient(#193e94 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`
    );
  }
}