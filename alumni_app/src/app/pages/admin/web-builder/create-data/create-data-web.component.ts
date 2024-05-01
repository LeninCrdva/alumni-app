import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { TextEditorComponent } from '../../text-editor/text-editor.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageHandlerService } from '../../../../data/ImageHandler.service';
import { AlertsServicexml } from '../../../../data/service/AlertsServicexml';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { XmlserviceService } from '../../../../data/service/xmlservice.service';

 
@Component({
  selector: 'app.create-datas',
  templateUrl: './create-data-web.component.html',
  styleUrl: './create-data-web.component.css'
})
export class CreateDataWebComponent {

  @ViewChild(TextEditorComponent) textEditorComponent!: TextEditorComponent;


  @ViewChild('btnRegresar') btnRegresar!: any;

  editarClicked = false;

  validateForm: FormGroup;

  idEdit: number = 0;

  originalContent: string = '';

  public archivoXML: any = [];

  puedeActualizar = false;

  previsualizacion: string = '';
  archivos: any[] = [];

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private router: Router,
    private webBuilderService: XmlserviceService,
    public imageHandlerService: ImageHandlerService,
    private alertService: AlertsServicexml,
    private routerActive: ActivatedRoute
  ) {
    this.validateForm = this.fb.group({
      tipo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.routerActive.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.editarClicked = true;
        this.cargarDatos(id);
      }
      else {
        this.editarClicked = false;

        this.imageHandlerService.clearImage();
        this.validateForm.patchValue({
          fecha_publicacion: new Date().toISOString().split('T')[0]
        });
      }
    });
  }

  cargarDatos(id: number): void {
    this.idEdit = id;

    this.webBuilderService.getById(id).pipe(
      switchMap(xmlItem => {
        return of(xmlItem);
      }),
      catchError(error => {
        console.error('Error al obtener datos:', error);
        return of(null);
      })
    ).subscribe(xmlItem => {
      if (xmlItem) {

        this.validateForm.patchValue({
          tipo: xmlItem.tipo,
        });

        this.imageHandlerService.previsualizacion = 'data:image/png;base64,' + xmlItem.foto_portada;
        this.textEditorComponent.textInput.nativeElement.innerHTML = xmlItem.xml_file;
        this.originalContent = xmlItem.xml_file;
      }
    });
  }

  crearCopia() {
    this.textEditorComponent.downloadContent();
  }

  hasContentChanged(): boolean {
    const currentContent = this.textEditorComponent.getContent();
    return this.originalContent !== currentContent;
  }

  onSubmit() {
    // Note: Si el editor de código (El que muestra el codigo en el edito) está activo, desactivarlo para guardar el contenido correctamente.
    if (this.textEditorComponent.showCodeActive) {
      this.textEditorComponent.toggleShowCode();
    }

    if (this.editarClicked) {
      this.onUpdateClick();
    } else {
      this.createNewData();
    }
  }
  Regresarclik(): void {
    this.editarClicked = false;
    this.router.navigate(['system/admin/gestion-web-builder']);
  }

  createNewData() {
    if (this.validateForm.valid && this.imageHandlerService.archivos.length > 0) {
      const formData = new FormData();

      Object.keys(this.validateForm.value).forEach(key => {
        formData.append(key, this.validateForm.value[key]);
      });

      const xmlContent = this.textEditorComponent.getContent();
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      formData.append('xml_file', blob, 'contenido.xml');

      const imagen = this.imageHandlerService.archivos[0];
      formData.append('foto_portada', imagen);

      // Note: Animación de guardando
      const button = this.elRef.nativeElement.querySelector('.button');
      this.renderer.addClass(button, 'active');

      this.webBuilderService.create(formData).subscribe(
        result => {
          this.idEdit = result.id as number;
          this.editarClicked = true;
          this.cargarAnimacion('Creado correctamente.', true, button);
        },
        error => {
          this.cargarAnimacion('Error al crear.', false, button);
        }
      );
    } else {
      this.alertService.showInputsValidations(this.renderer);
      this.alertService.mostrarAlertaSweet();
    }
  }

  onUpdateClick() {
    if (!this.validateForm.valid) {
      this.alertService.showInputsValidations(this.renderer);

      this.alertService.mostrarAlertaSweet();
      return;
    }

    if (this.validateForm.dirty || this.imageHandlerService.archivos.length > 0 || this.hasContentChanged()) {
      const formData = new FormData();

      Object.keys(this.validateForm.value).forEach(key => {
        formData.append(key, this.validateForm.value[key]);
      });

      if (this.imageHandlerService.archivos.length > 0) {
        const imagen = this.imageHandlerService.archivos[0];
        formData.append('foto_portada', imagen);
      }

      const xmlContent = this.textEditorComponent.getContent();
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      formData.append('xml_file', blob, 'contenido.xml');

      this.originalContent = xmlContent;

      // Note: Animación de guardando
      const button = this.elRef.nativeElement.querySelector('.button');
      this.renderer.addClass(button, 'active');

      this.webBuilderService.update(this.idEdit, formData).subscribe(
        result => {
          this.cargarAnimacion('Actualizado correctamente.', true, button);
          this.imageHandlerService.archivos = [];
        },
        error => {
          this.alertService.mostrarSweetAlert(false, 'Error al actualizar.');
          this.cargarAnimacion('Error al actualizar.', false, button);
        }
      );
    } else {
      this.alertService.mostrarAlertaSweet('No se detectaron cambios para actualizar.');
    }
  }

  cargarAnimacion(mensajeResult: string, resultado: boolean, button: any) {
    setTimeout(() => {
      this.renderer.removeClass(button, 'active');
      this.puedeActualizar = false;
      const icon = button.querySelector('i');
      const span = button.querySelector('span');

      this.renderer.removeClass(icon, 'bx-cloud-download');
      this.renderer.addClass(icon, 'bx-check-circle');

      this.renderer.setProperty(span, 'innerText', 'Completado');

      //  Note: Mostrar mensaje de éxito
      this.alertService.mostrarSweetAlert(resultado, mensajeResult, this.btnRegresar, true);

      setTimeout(() => {
        this.puedeActualizar = true;
        this.renderer.removeClass(icon, 'bx-check-circle');
        this.renderer.addClass(icon, 'bx-cloud-download');

        this.renderer.setProperty(span, 'innerText', (resultado) ? 'Actualizar' : 'Guardar');
      }, 3000);
    }, 2000);
  }

  capturarArchivoXML(event: any): void {
    const archivoCapturado = event.target.files[0];
    if (archivoCapturado && archivoCapturado.type === "application/xml") {
      this.archivoXML = archivoCapturado;
    } else {
      Swal.fire("Error", "El archivo debe ser un XML.", "error");
    }
  }

  visualizarPagina() {
    const url = `/#/inicio/component/${this.idEdit}`;
    window.open(url, '_blank');
  }
}