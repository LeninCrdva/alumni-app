import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { Component, ElementRef, Renderer2, OnInit, Input, HostListener } from '@angular/core';
import { UserService } from '../../data/service/UserService'
import { AssetService } from '../../data/service/Asset.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NuevoAdministradorModalComponent } from '../../pages/admin/nuevo-administrador-modal/nuevo-administrador-modal.component';
import { AdministradorService } from '../../data/service/administrador.service';
import { Administrador } from '../../data/model/administrador';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GraduadoService } from '../../data/service/graduado.service';
import { Graduado3 } from '../../data/model/graduado';
import { EmpresarioService } from '../../data/service/empresario.service';
import { Empresario2 } from '../../data/model/empresario';
import { NuevoGraduadoModalComponent } from '../../pages/alumni/nuevo-graduado-modal/nuevo-graduado-modal.component';
import { NuevoEmpresarioModalComponent } from '../../pages/company/nuevo-empresario-modal/nuevo-empresario-modal.component';
@Component({
  selector: 'app-layout-system',
  templateUrl: './layout-system.component.html',
  styleUrls: ['./layout-system.component.css']
})
export class LayoutSystemComponent implements OnInit {
  showAdminOptions = false;
  showResponsableOptions = false;
  showEmpresarioOptions = false;
  showAlumniOptions = false;
  showResponsableCarreraOptions = false;
  nuevoGraduado: Graduado3 = new Graduado3();
  nuevoAdministrador: Administrador = new Administrador();
  sidebarVisible = false;

  activeMenuItem: string = localStorage.getItem('activeMenuItem') || 'Inicio';

  rolType: string = '';
  activeDropdown: string | null = null;
  public name: string | null = localStorage.getItem('name');
  //imagenes//
  public previsualizacion?: string;
  public archivos: any = []
  public loading?: boolean
  public rutaimagen: string = '';
  public urlImage: string = '';
  public username: string = '';
  public inforest: any = [];
  public getRuta: string = '';
  public deleteimage: any = localStorage.getItem('rutaimagen');
  public mensajevalidado: string = '';
  //Prueba empresario 
  usuarioEmpresario: string = localStorage.getItem('name') || '';
  nuevoEmpresario: Empresario2 = new Empresario2();
  usuarioGuardado: string = localStorage.getItem('name') || '';
  darkMode: boolean = localStorage.getItem('darkMode') === 'true';

  //modal
  constructor(private sanitizer: DomSanitizer,
    private assetService: AssetService,
    private el: ElementRef,
    private renderer: Renderer2,
    private usuarioService: UserService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    private empresaservice: EmpresarioService,
    private router: Router,
    private administradorService: AdministradorService,
    private graduadoservice: GraduadoService) { }

  ngOnInit() {
    // NOTE: START SLIDER BAR
    this.setupSidebarDropdown();
    this.setupSidebarCollapse();
    this.setupProfileDropdown();
    this.loadUserDataByUsername();
    // NOTE: END SLIDER BAR
    this.cerrarSesion();
    this.checkUserRole();
    this.checkSession();
    this.changeStyleMode();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', String(this.darkMode));
    this.changeStyleMode();
  }

  changeStyleMode(): void {
    if (this.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  checkSession(): void {
    const isLoggedIn = localStorage.getItem('name');
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.router.navigate(['/account/login']);
      });
    }
  }

  redirectToProfile(): void {
    //  localStorage.setItem('authorities', JSON.stringify(authorities));
    const userRole = localStorage.getItem('authorities')?.match(/[a-zA-Z_]+/)?.[0];
    console.log('es de la autoridad 1', userRole);
    console.log("Rol: " + userRole);
    switch (userRole) {
      case 'ADMINISTRADOR':
        this.router.navigate(['/system/admin/perfil-admin']);
        break;
      case 'EMPRESARIO':
        this.router.navigate(['/system/company/perfil']);
        break;
      case 'GRADUADO':
        this.router.navigate(['system/alumni/perfil']);
        break;
    }
  }

  redirectToUpdateProfile(): void {
    const userRole = localStorage.getItem('authorities')?.match(/[a-zA-Z_]+/)?.[0];

    console.log("Rol: " + userRole);
    switch (userRole) {
      case 'ADMINISTRADOR':
        this.router.navigate(['/system/admin/update-perfil']);
        break;
      case 'EMPRESARIO':
        this.router.navigate(['/system/company/update-perfil']);
        break;
      case 'GRADUADO':
        this.router.navigate(['system/alumni/update-perfil']);
        break;
    }
  }

  loadUserDataByUsername() {
    const username = localStorage.getItem('name');  // Obtén el nombre de usuario de donde lo tengas guardado
    if (username) {
      this.usuarioService.getUserByUsername(username).subscribe(
        (response) => {

          //console.log('Datos del usuario por nombre:', response);
          localStorage.setItem('user_data', JSON.stringify(response));
          localStorage.setItem('url_imagen', response.urlImagen);
          localStorage.setItem('ruta_imagen', response.rutaImagen);
          const storedRutaImagen = localStorage.getItem('ruta_imagen');
          const storedUrlImagen = localStorage.getItem('url_imagen');
          if (storedRutaImagen && storedUrlImagen) {
            this.rutaimagen = storedRutaImagen;
            this.urlImage = storedUrlImagen;
          } else {
            // Manejar el caso en el que la información no esté disponible en localStorage
            console.error('La información de imagen no está disponible en localStorage.');
          }

          // console.log('lo que se guardo en cache',localStorage.getItem('user_data'));

        },
        (error) => {
          console.error('Error al obtener datos del usuario por nombre:', error);
          // Puedes manejar el error aquí, por ejemplo, mostrar un mensaje al usuario
        }
      );
    }
  }

  setActiveMenuItem(menuItem: string): void {
    this.activeMenuItem = menuItem;
    localStorage.setItem('activeMenuItem', menuItem);
  }

  capturarFile(event: any): any {

    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(imagen);

    })
    this.archivos.push(archivoCapturado)
    // 
    // console.log(event.target.files);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();

      reader.readAsDataURL($event);

      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };

      reader.onerror = error => {
        resolve({
          base: null
        });
      };
    } catch (e) {
      console.error('Error al extraer base64:', e);
      resolve({
        base: null
      });
    }
  });

  deleteFile(rutakey: string) {
    this.assetService.delete(rutakey).subscribe(r => {
      console.log("archivo eliminado")
    })
  }

  clearImage(): any {
    this.previsualizacion = '';
    this.archivos = [];
  }

  cerrarSesion() {
    setTimeout(() => {
      Swal.fire({
        icon: 'info',
        title: 'Sesión Expirada',
        text: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        localStorage.clear();
        this.router.navigate(['/inicio-sesion']);
      });
    }, 3600000);
  }

  cerrarSesionconclick() {
    Swal.fire({
      icon: 'info',
      title: 'Sesión Cerrada',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      localStorage.clear();
      this.router.navigate(['/inicio-sesion']);
    });
  }

  private checkUserRole() {
    const userRole = localStorage.getItem('authorities')?.match(/[a-zA-Z_]+/)?.[0];
    //console.log('prueba de rol', userRole);

    if (userRole === 'ADMINISTRADOR') {
      this.showAdminOptions = true;
      this.rolType = 'Admin';
      this.nuevoAdministrador.usuario = this.usuarioGuardado;
      // console.log('El usuario es', this.nuevoAdministrador);
      this.administradorService.checkAdministradorExists(this.nuevoAdministrador.usuario).subscribe(
        (exists) => {
          //   console.log(`¿Existe administrador? ${exists}`);
          if (!exists) {
            const config = {
              initialState: {
                nuevoAdministrador: this.nuevoAdministrador,
              },
              ignoreBackdropClick: true,
              keyboard: false,
            };
            this.bsModalRef = this.modalService.show(NuevoAdministradorModalComponent, config);

            this.bsModalRef.content.onClose.subscribe((result: string) => {
              if (result === 'guardadoExitoso') {
                // console.log('Guardado exitoso, puedes realizar acciones adicionales si es necesario.');
              }
            });
          } //else {
          //console.error('Ya existe un administrador con este nombre. Elige otro nombre.');
          // }
        },
        (error) => {
          console.error('Error al verificar la existencia del administrador:', error);
        }
      );

    } else if (userRole === 'EMPRESARIO') {
      this.showEmpresarioOptions = true;
      this.rolType = 'Empresario';
      this.nuevoEmpresario.usuario = this.usuarioGuardado; // Cambiado de this.usuarioEmpresario
      // console.log('El usuario es', this.nuevoEmpresario);
      this.empresaservice.getEmpresarioByUsuario(this.usuarioEmpresario).subscribe(
        empresario => {
          if (empresario) {
            this.empresaservice.setEmpresario(empresario);
          } else {
            console.log('No se encontró el empresario.');
          }
        },
        error => {
          // Maneja errores en la petición HTTP
          console.error('Error al obtener el empresario:', error);
        }
      );
      this.empresaservice.checkEmpresarioExists(this.nuevoEmpresario.usuario).subscribe(
        (exists) => {
          localStorage.setItem('exempresario', exists.toString());
          //   console.log(`¿Existe empresario? ${exists}`);
          if (!exists) {
            const config = {
              initialState: {
                nuevoEmpresario: this.nuevoEmpresario,
              },
              ignoreBackdropClick: true,
              keyboard: false,
            };
            this.bsModalRef = this.modalService.show(NuevoEmpresarioModalComponent, config);

            this.bsModalRef.content.onClose.subscribe((result: string) => {
              if (result === 'guardadoExitoso') {
                //       console.log('Guardado exitoso, puedes realizar acciones adicionales si es necesario.');
              }
            });
          }
        },
        (error) => {
          console.error('Error al verificar la existencia del empresario:', error);
        }
      );

    } else if (userRole === 'GRADUADO') {
      this.showAlumniOptions = true;
      this.rolType = 'Alumni';
      this.nuevoGraduado.usuario = this.usuarioGuardado;
      // console.log('El usuario es', this.nuevoGraduado);
      this.graduadoservice.checkGraduadoExists(this.nuevoGraduado.usuario).subscribe(
        (exists) => {
          //   console.log(`¿Existe graduado? ${exists}`);
          if (!exists) {
            const config = {
              initialState: {
                nuevoGraduado: this.nuevoGraduado,
              },
              ignoreBackdropClick: true,
              keyboard: false,
            };
            this.bsModalRef = this.modalService.show(NuevoGraduadoModalComponent, config);

            this.bsModalRef.content.onClose.subscribe((result: string) => {
              if (result === 'guardadoExitoso') {
                //       console.log('Guardado exitoso, puedes realizar acciones adicionales si es necesario.');
              }
            });
          }
        },
        (error) => {
          console.error('Error al verificar la existencia del graduado:', error);
        }
      );
    } else if (userRole === 'RESPONSABLE_CARRERA') {
      this.showResponsableCarreraOptions = true;
      this.rolType = 'Responsable de Carrera';
    } else {
      console.error('Rol no reconocido:', userRole);
      // Puedes manejar el escenario cuando el rol no es reconocido
    }
  }

  // NOTE: SLIDER BAR
  private setupSidebarDropdown() {
    const allDropdown = this.el.nativeElement.querySelectorAll('#sidebar .side-dropdown');
    const sidebar = this.el.nativeElement.querySelector('#sidebar');

    allDropdown.forEach((item: any) => {
      const a = item.parentElement.querySelector('a:first-child');
      this.renderer.listen(a, 'click', (event) => {
        event.preventDefault();

        if (!a.classList.contains('active')) {
          allDropdown.forEach((i: any) => {
            const aLink = i.parentElement.querySelector('a:first-child');
            aLink.classList.remove('active');
            i.classList.remove('show');
          });
        }

        a.classList.toggle('active');
        item.classList.toggle('show');
      });
    });
  }

  private setupSidebarCollapse() {
    const toggleSidebar = this.el.nativeElement.querySelector('nav .toggle-sidebar');
    const allSideDivider = this.el.nativeElement.querySelectorAll('#sidebar .divider');
    const sidebar = this.el.nativeElement.querySelector('#sidebar');
    const allDropdown = this.el.nativeElement.querySelectorAll('#sidebar .side-dropdown');

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      this.sidebarVisible = false;
      sidebar.classList.add('hide');
    }

    if (sidebar.classList.contains('hide')) {
      allSideDivider.forEach((item: any) => {
        item.textContent = '-';
      });

      allDropdown.forEach((item: any) => {
        const a = item.parentElement.querySelector('a:first-child');
        a.classList.remove('active');
        item.classList.remove('show');
      });
    } else {
      allSideDivider.forEach((item: any) => {
        item.textContent = item.dataset.text;
      });
    }

    this.renderer.listen(toggleSidebar, 'click', () => {
      this.sidebarVisible = !this.sidebarVisible;
      sidebar.classList.toggle('hide', !this.sidebarVisible);

      if (sidebar.classList.contains('hide')) {
        allSideDivider.forEach((item: any) => {
          item.textContent = '-';
        });

        allDropdown.forEach((item: any) => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        });
      } else {
        allSideDivider.forEach((item: any) => {
          item.textContent = item.dataset.text;
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseleave', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach((item: any) => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        });
        allSideDivider.forEach((item: any) => {
          item.textContent = '-';
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseenter', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach((item: any) => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        });
        allSideDivider.forEach((item: any) => {
          item.textContent = item.dataset.text;
        });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const profileElement = this.el.nativeElement.querySelector('.profile');
    const dropdownElement = this.el.nativeElement.querySelector('.profile-link');
    if (!profileElement.contains(event.target) && dropdownElement.classList.contains('show')) {
      this.toggleDropdown();
    }
  }

  private setupProfileDropdown() {
    const profile = this.el.nativeElement.querySelector('nav .profile');

    this.renderer.listen(profile, 'click', () => {
      this.toggleDropdown();
    });
  }

  private toggleDropdown() {
    const dropdownProfile = this.el.nativeElement.querySelector('nav .profile-link');
    dropdownProfile.classList.toggle('show');
  }
}