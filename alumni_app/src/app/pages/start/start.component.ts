import { Component, OnInit, HostListener, Renderer2, ElementRef } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
import { MailService } from '../../data/service/mail.service';
import { MailRequest } from '../../data/model/Mail/MailRequest';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  private readonly ROLE_WITHOUT_REGISTER = 'ROLE_WITHOUT_REGISTER';
  private readonly EMPRESARIO = 'EMPRESARIO';
  private readonly GRADUADO = 'GRADUADO';

  mailRequest: MailRequest = new MailRequest();

  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router, private mailService: MailService) { }

  // Note: Animaciones
  options_Anim1: AnimationOptions = {
    path: '../../../assets/anims/Anim_1.json',
  };

  options_Anim2: AnimationOptions = {
    path: '../../../assets/anims/Anim_2.json',
  };
  options_Anim3: AnimationOptions = {
    path: '../../../assets/anims/Anim_3.json',
  };


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
  

  loginAsResponsableCarreraOrAdmin(): void {
    localStorage.setItem('userRole', this.ROLE_WITHOUT_REGISTER);
    this.router.navigate(['/account/login']);
  }
  loginAsEmpresario(): void {
    localStorage.setItem('userRole', this.EMPRESARIO);
    this.router.navigate(['/account/login']);
  }

  loginAsGraduado(): void {
    localStorage.setItem('userRole', this.GRADUADO);
    this.router.navigate(['/account/login']);
  }
  private navigateToRegister(): void {
    this.router.navigate(['/register'], { queryParams: { role: localStorage.getItem('userRole') } });
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  ngOnInit(): void {
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
  onSubmit(): void {
    this.mailRequest.to = 'info.alumni.est@gmail.com';
    this.mailService.contactUs(this.mailRequest).subscribe(response => {

      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Tu mensaje ha sido enviado exitosamente.',
        confirmButtonText: 'OK'
      });
      this.mailRequest.name = '';
      this.mailRequest.from = '';
      this.mailRequest.subject = '';
      this.mailRequest.caseEmail = '';
    }, error => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar mensaje',
        text: 'Ha ocurrido un error al intentar enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.',
        confirmButtonText: 'OK'
      });
    });
  }
}