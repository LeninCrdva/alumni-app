import { Component, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XmlserviceService } from '../../../data/service/xmlservice.service';
import { componentxml } from '../../../data/model/componentxml';

@Component({
  selector: 'app-content-builder',
  templateUrl: './content-builder.component.html',
  styleUrl: './content-builder.component.css'
})
export class ContentBuilderComponent {
  @ViewChild('textInput', { static: false }) textInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private xmlService: XmlserviceService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  xmlcontent: componentxml = { tipo: '', xml_file: '', foto_portada: new Uint8Array() };
  contentpage: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];

      if (id) {
        this.xmlService.getById(id).subscribe(result => {
          this.xmlcontent = result;
          // Reemplazar el prefijo "programamisional/" si existe en `tipo`
          this.xmlcontent.tipo = this.xmlcontent.tipo.replace('programamisional - ', '');
          this.textInput.nativeElement.innerHTML = this.xmlcontent.xml_file;
        });
      }
    });

    this.toggleMenu('.navbar', '#menu-icon');
  }

  
  private toggleMenu(navId: string, burgerId: string): void {
    const nav = this.el.nativeElement.querySelector(navId);
    const burgerBtn = this.el.nativeElement.querySelector(burgerId);
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('show-icon');
      nav.classList.toggle('open');
    });
  }

  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const header = this.el.nativeElement.querySelector('header');
    if (window.scrollY > 0) {
      this.renderer.addClass(header, 'abajo');
    } else {
      this.renderer.removeClass(header, 'abajo');
    }

    this.handleScroll();
  }

  private handleScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
  
    if (sections.length === 0 || navLinks.length === 0) {
      return;
    }
  
    sections.forEach(sec => {
      const top = window.scrollY;
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
  
      if (top >= offset && top < offset + height) {
        navLinks.forEach(links => {
          this.renderer.removeClass(links, 'active');
        });
        const activeLink = this.el.nativeElement.querySelector(`header nav a[href*=${id}]`);
        if (activeLink) {
          this.renderer.addClass(activeLink, 'active');
        }
      }
    });
  }
}
