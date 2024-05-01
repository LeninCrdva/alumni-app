import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ImageHandlerServicebyte } from '../../../data/service/ImageHandlerServicebyte';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsServicexml } from '../../../data/service/AlertsServicexml';


interface KeyActionMap {
  [key: string]: () => void | boolean; 
}

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.css'
})
export class TextEditorComponent {

  @ViewChild('textInput', { static: false }) textInput!: ElementRef;

  
  fontList = [
    "Arial", "Verdana", "Georgia", "Times New Roman", "Garamond", "Courier New", "monospace", "Lucida Console", "sans-serif", "cursive",
    "Open Sans", "Roboto", "Montserrat", "Lato", "Roboto Slab", "Oswald", "Raleway" 
  ];
  


  validateInputs: FormGroup;

  selectedFont: string = this.fontList[0];

  fontSizeList: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  selectedFontSize: number = 3;
  isFullScreen: boolean = false;

  isEditingImage: boolean = false;
  anchoEnabled: boolean = true;
  altoEnabled: boolean = true;

  activeButton: string | null = null; // Para botones que requieren exclusividad
  activeFormatButtons: { [key: string]: boolean } = {};

  previsualizacion: string = '';
  archivos: any[] = [];


  selectElement2: HTMLElement | null = null;

  @ViewChild('cerrarModal') cerrarModal!: ElementRef;
  @ViewChild('codeModal') codeModal!: ElementRef;
  @ViewChild('openCodeModal') openCodeModal!: ElementRef;
  @ViewChild('imageBtn') imageBtn!: ElementRef;
  showCodeActive: boolean = false;
  isImage: boolean = true;
  borderRadiusValue: number = 0;
  originalContent: string = '';

  constructor(
    private renderer: Renderer2,
    private alertService: AlertsServicexml,
    private fb: FormBuilder,
    public imageHandlerService: ImageHandlerServicebyte
  ) {
    this.validateInputs = this.fb.group({
      ancho: ['', Validators.required],
      alto: ['', Validators.required],
      imageUrl: [''],
      imageFile: [''],
      HTMLCode: [''],
      imgOrVideo: [''],
      tipoBloque: [''],
      borderRadius: [''],
      margin_top: [''],
      margin_bottom: [''],
    });
   
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const keyActionMap: KeyActionMap = {
      'KeyL': () => this.modifyText('justifyLeft', false),
      'KeyE': () => this.modifyText('justifyCenter', false),
      'KeyR': () => this.modifyText('justifyRight', false),
      'Digit1': () => document.execCommand('formatBlock', false, 'H1'),
      'Digit2': () => document.execCommand('formatBlock', false, 'H2'),
      'Digit3': () => document.execCommand('formatBlock', false, 'H3'),
      'Digit4': () => document.execCommand('formatBlock', false, 'P'),
      'KeyP': () => this.printContent(),
      'KeyA': () => this.modifyTextCase('uppercase'),
      'KeyQ': () => this.modifyTextCase('lowercase'),
      'KeyG': () => this.openCodeModal.nativeElement.click(),
      'KeyH': () => this.imageBtn.nativeElement.click(),
      'KeyI': () => this.modifyText('insertOrderedList', false),
      'KeyO': () => this.modifyText('insertUnorderedList', false)
    };

    const ctrlShiftKeys = event.ctrlKey && event.shiftKey;
    const shiftKeyOnly = event.shiftKey && !event.ctrlKey && !event.altKey;
    const altShiftKeys = event.altKey && event.shiftKey;

    if ((ctrlShiftKeys || shiftKeyOnly || altShiftKeys) && keyActionMap[event.code] && !this.showCodeActive) {
      event.preventDefault();
      const action = keyActionMap[event.code];
      if (action) action();
    } else if (event.key === 'F11') {
      event.preventDefault();
      this.toggleFullScreen();
    }
  }

  currentImageElement: HTMLElement | null = null;

  ngAfterViewInit(): void {
    const alignButtons = document.querySelectorAll(".align");
    const spacingButtons = document.querySelectorAll(".spacing");
    const formatButtons = document.querySelectorAll(".format");
    const scriptButtons = document.querySelectorAll(".script");
    const showCodeButton = document.getElementById("show-code");
    const fullScreenButton = document.getElementById("full-screen");

    this.highlighter(alignButtons, true);
    this.highlighter(spacingButtons, true);
    this.highlighter(formatButtons, false);
    this.highlighter(scriptButtons, true);
    this.highlighter([showCodeButton], false);
    this.highlighter([fullScreenButton], false);
    this.originalContent = this.getContent();

    this.listenToImageClicks();

    this.modifyDivElements();
  }

  getContent(): string {
    return this.textInput.nativeElement.innerHTML;
  }
  modifyDivElements(): void {
    const container = this.textInput.nativeElement;
    const divElements = container.querySelectorAll('div.editorTextInput');
  
    divElements.forEach((element: HTMLElement) => {
      element.style.fontFamily = 'Arial'; 
      element.style.fontSize = '16px'; 
   
    });
  }
  

  listenToImageClicks(): void {
    this.renderer.listen(this.textInput.nativeElement, 'click', (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (element.tagName === 'IMG' || element.tagName === 'iframe') {
        this.currentImageElement = element;
        this.openImageEditModal();
      } else {
        this.currentImageElement = null;
        this.isEditingImage = false;
      }
    });
  }

  highlighter(className: any, needsRemoval: any): void {
    className.forEach((button: any) => {
      button.addEventListener("click", () => {
        if (needsRemoval) {
          let alreadyActive = false;

          if (button.classList.contains("active")) {
            alreadyActive = true;
          }

          this.highlighterRemover(className);
          if (!alreadyActive) {
            button.classList.add("active");
          }
        } else {
          button.classList.toggle("active");
        }
      });
    });
  };

  highlighterRemover(className: any): void {
    className.forEach((button: any) => {
      button.classList.remove("active");
    });
  };

  toggleExclusiveButton(buttonId: string): void {
    this.activeButton = this.activeButton === buttonId ? null : buttonId;
  }

  toggleNonExclusiveButton(buttonId: string): void {
    this.activeFormatButtons[buttonId] = !this.activeFormatButtons[buttonId];
  }

  modifyText(command: string, defaultUi: boolean, value?: string): void {
    document.execCommand(command, defaultUi, value);
  }

  modifyTextCase(caseType: 'lowercase' | 'uppercase'): void {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      let modifiedText = '';
      if (caseType === 'lowercase') {
        modifiedText = selectedText.toLowerCase();
      } else if (caseType === 'uppercase') {
        modifiedText = selectedText.toUpperCase();
      }
      document.execCommand('insertText', false, modifiedText);
    }
  }

 // Método para cambiar el tipo de letra de elementos dentro de un contenedor específico
changeFontFamily(containerSelector: string, fontFamily: string): void {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const elements = container.querySelectorAll('div'); 

  elements.forEach((element) => {
      (element as HTMLElement).style.fontFamily = fontFamily; 
  });
}

// Llamada a la función para cambiar el tipo de letra
modifyExtraValues(command: string, defaultUi: boolean, event: Event): void {
  const value = (event.target as HTMLSelectElement).value;

  if (command === 'fontName') {
      this.changeFontFamily('.editorTextInput', value);
  } else {
      document.execCommand(command, defaultUi, value);
  }
}



  downloadContent(): void {
    try {
      const content = this.textInput.nativeElement.innerHTML;
      const blob = new Blob([content], { type: 'application/html' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'contenido.html';
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error al descargar el archivo XML:', error);
    }
  }

  uploadFile(): void {
    if (this.showCodeActive) {
      this.toggleShowCode();
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.html, .xml';

    fileInput.click();

    fileInput.addEventListener('change', (changeEvent) => {
      const files = (changeEvent.target as HTMLInputElement).files;

      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = () => {
          const contenidoXML = reader.result as string;

          this.textInput.nativeElement.innerHTML = contenidoXML;
        };

        reader.readAsText(file);
      }
    });
  }

  printContent(): void {
    const content = this.textInput.nativeElement.innerHTML;
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    printWindow?.document.write('<html><head><title>Imprimir</title>');
    printWindow?.document.write('</head><body >');
    printWindow?.document.write(content);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.focus();

    setTimeout(() => {
      printWindow?.print();
      printWindow?.close();
    }, 1000);
  }

  modifyFontSize(): void {
    this.modifyText('fontSize', false, this.selectedFontSize.toString());
  }

  createLink(): void {
    const url = prompt('Enter the URL');
    if (url) this.modifyText('createLink', false, url);
  }

  unlink(): void {
    this.modifyText('unlink', false);
  }

  cleanDataImage(): void {
    console.log("s");
    const imageFileInput = document.getElementById('foto') as HTMLInputElement;
    if (imageFileInput) {
      imageFileInput.value = '';
    }
    this.clearImage();

    this.currentImageElement = null;
    this.isEditingImage = false;
    this.anchoEnabled = true;
    this.altoEnabled = true;

    this.validateInputs.patchValue({
      ancho: '600px',
      alto: '300px',
    });
  }

  copiarCodigoBase64(): void {
    navigator.clipboard.writeText(this.previsualizacion).then(() => {
      this.alertService.mostrarSweetAlert(true, "Código base64 copiado al portapapeles.");
    }, (err) => {
      console.error('Error al copiar el código base64: ', err);
    });
  }

  insertImage(): void {
    this.validateInputs.get('ancho')?.enable();
    this.validateInputs.get('alto')?.enable();
    const imageFileInput = document.getElementById('foto') as HTMLInputElement;
    const { ancho, alto, imageUrl, margin_bottom, margin_top, borderRadius } = this.validateInputs.value;

    const imageFile = this.archivos.length > 0;

    if (this.validateInputs.value.imgOrVideo === 'video') {
      this.insertVideoFromUrl(imageUrl, ancho, alto, margin_top, margin_bottom, borderRadius + 'rem');
      this.cerrarModal.nativeElement.click();
      return;
    }

    if (this.isEditingImage) {
      this.applyImageChanges(imageFileInput, ancho, alto, margin_top, margin_bottom, borderRadius + 'rem', imageUrl);
      return;
    }

    if (!imageUrl && !imageFile) {
      Object.keys(this.validateInputs.controls).forEach(controlName => this.validateInputs.controls[controlName].markAsTouched());
      this.alertService.mostrarAlertaSweet("Por favor, inserta una URL o sube una imagen desde tu equipo.");
      return;
    }

    if (imageUrl) {
      const imageUrl = this.validateInputs.value.imageUrl;
      this.insertImageHtml(imageUrl, ancho, alto, margin_top, margin_bottom, borderRadius + 'rem');
    } else if (imageFileInput && imageFileInput.files && imageFileInput.files[0]) {
      const file = imageFileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.insertImageHtml(e.target.result.toString(), ancho, alto, margin_top, margin_bottom, borderRadius + 'rem');
        }
      };

      reader.readAsDataURL(file);
    }
    this.cerrarModal.nativeElement.click();
  }

  applyImageChanges(imageFileInput: any, ancho: any, alto: any, m_Top: any, m_bottom: any, borderRadius: any, imageUrl: any): void {
    if (!this.currentImageElement) return;

    if (imageFileInput && imageFileInput.files.length > 0) {
      this.currentImageElement.setAttribute('src', this.previsualizacion);
    } else if (imageUrl) {
      this.currentImageElement.setAttribute('src', imageUrl);
    }

    this.currentImageElement.style.width = ancho ? `${ancho}` : 'auto';
    this.currentImageElement.style.height = alto ? `${alto}` : 'auto';
    this.currentImageElement.style.marginTop = m_Top ? `${m_Top}` : 'auto';
    this.currentImageElement.style.marginBottom = m_bottom ? `${m_bottom}` : 'auto';
    this.currentImageElement.style.borderRadius = borderRadius ? `${borderRadius}` : '0px';

    this.cerrarModal.nativeElement.click();
    this.isEditingImage = false;
    this.currentImageElement = null;
  }

  openImageEditModal(): void {
    if (!this.currentImageElement) return;

    this.clearImage();

    this.isEditingImage = true;
    const src = this.currentImageElement.getAttribute('src');

    this.previsualizacion = (src?.startsWith('data:image')) ? src : '';

    this.validateInputs.patchValue({
      ancho: this.currentImageElement.style.width,
      alto: this.currentImageElement.style.height,
      margin_top: this.currentImageElement.style.marginTop,
      margin_bottom: this.currentImageElement.style.marginBottom,
      borderRadius: parseInt(this.currentImageElement.style.borderRadius),
      imageUrl: (src?.startsWith('data:image')) ? '' : src,
    });

    if (this.currentImageElement.style.width === '100%') {
      this.toggleWidth({ target: { checked: false } });
    }
    if (this.currentImageElement.style.height === '100%') {
      this.toggleHeight({ target: { checked: false } });
    }
  }


  onContentChange(event: any): void {
    const valor = this.validateInputs.controls['imgOrVideo'].getRawValue();

    if (valor === 'video' && event.target.value.includes('Texto')) {
      this.validateInputs.get('ancho')?.disable();
      this.validateInputs.get('ancho')?.setValue('100%');
      this.validateInputs.get('alto')?.setValue('25rem');
    }
    else if (valor === 'image') {
      this.validateInputs.get('ancho')?.enable();
      this.validateInputs.get('ancho')?.setValue('600px');
      this.validateInputs.get('alto')?.setValue('300px');
    } else {
      this.validateInputs.get('ancho')?.enable();
      this.validateInputs.get('ancho')?.setValue('50rem');
    }
  }

  toggleWidth(event: any): void {
    const valor = this.validateInputs.controls['imgOrVideo'].getRawValue();
    const valor2 = this.validateInputs.controls['tipoBloque'].getRawValue();

    this.anchoEnabled = event.target.checked;

    if (valor === 'image' || valor2.includes('Único')) {
      this.validateInputs.get('ancho')?.enable();
      if (this.anchoEnabled) {
        this.validateInputs.get('ancho')?.enable();
      } else {
        this.validateInputs.get('ancho')?.disable();
        this.validateInputs.get('ancho')?.setValue('100%');
      }
    }
  }

  toggleHeight(event: any): void {
    const valor = this.validateInputs.controls['imgOrVideo'].getRawValue();
    const valor2 = this.validateInputs.controls['tipoBloque'].getRawValue();
    this.altoEnabled = event.target.checked;

    if (valor === 'image' || valor2.includes('Único')) {
      if (this.altoEnabled) {
        this.validateInputs.get('alto')?.enable();
      } else {
        this.validateInputs.get('alto')?.disable();
        this.validateInputs.get('alto')?.setValue('100%');
      }
    }
  }

  insertImageHtml(imageUrl: string, width: string, height: string, mTop: string, m_bottom: string, borderRadius: string): void {
    const tipoBloque = this.validateInputs.value.tipoBloque;

    let imageHtml = `<img src="${imageUrl}" class="img-fluid"
    style="cursor: pointer; width:${width}; height:${height}; margin-top: ${mTop}; margin-bottom: ${m_bottom}; border-radius: ${borderRadius}; -o-object-fit: cover; object-fit: cover;">`;

    const templateResponsiveText = `
      <div class="col-md-7">
          <h3>PLANTILLA <b>Nro 1</b></h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec libero sed augue rutrum viverra. Fusce at nisi vitae diam dapibus laoreet.
          Maecenas consequat lectus risus, dignissim feugiat leo interdum non.</p><p>Integer ac risus sit amet libero iaculis feugiat quis eget arcu.
          Mauris eget lacus molestie felis scelerisque pharetra ac in nisi. Ut tincidunt tristique leo. Aliquam in auctor ante. Integer nec mattis lectus, quis consectetur massa.</p>
      </div>`;

    if (tipoBloque === 'Imagen - Texto') {
      imageHtml = `<p><br></p><div class="row featurette"><div class="col-md-5">${(imageHtml)}</div>${templateResponsiveText}</div><p><br></p>`;
    } else if (tipoBloque === 'Texto - Imagen') {
      imageHtml = `<p><br></p><div class="row featurette">${templateResponsiveText}<div class="col-md-5">${(imageHtml)}</div></div><p><br></p>`;
    } else {
      imageHtml = `<p><br></p>${imageHtml}<p><br></p>`;
    }
    this.textInput.nativeElement.innerHTML += imageHtml;
  }

  insertVideoFromUrl(videoUrl: string, width: string, height: string, mTop: string, m_bottom: string, borderRadius: string): void {
    const tipoBloque = this.validateInputs.value.tipoBloque;
    let videoHtml = '';

    const templateResponsiveText = `
    <div class="col-md-7">
        <h3>PLANTILLA <b>Nro 1</b></h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec libero sed augue rutrum viverra. Fusce at nisi vitae diam dapibus laoreet.
        Maecenas consequat lectus risus, dignissim feugiat leo interdum non.</p><p>Integer ac risus sit amet libero iaculis feugiat quis eget arcu.
        Mauris eget lacus molestie felis scelerisque pharetra ac in nisi. Ut tincidunt tristique leo. Aliquam in auctor ante. Integer nec mattis lectus, quis consectetur massa.</p>
    </div>`;

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = this.extractYoutubeId(videoUrl);
      videoHtml = `
      <div style="max-width: ${width}; margin: auto;">
        <iframe style="width:100%; aspect-ratio: 16 / 9; height:${height}; margin-top: ${mTop}; margin-bottom: ${m_bottom}; border-radius: ${borderRadius};"
          src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
      </div>`;
    } else {
      alert('URL no soportada. Por favor, ingrese una URL de YouTube.');
      return;
    }

    if (tipoBloque === 'Video - Texto') {
      videoHtml = `<p><br></p><div class="row featurette"><div class="col-md-5">${videoHtml}</div>${templateResponsiveText}</div><p><br></p>`;
    } else if (tipoBloque === 'Texto - Video') {
      videoHtml = `<p><br></p><div class="row featurette">${templateResponsiveText}<div class="col-md-5">${videoHtml}</div></div><p><br></p>`;
    } else {
      videoHtml = `<p><br></p>${videoHtml}<p><br></p>`;
    }

    this.textInput.nativeElement.innerHTML += videoHtml;
  }


  deleteImage() {
    if (this.currentImageElement) {
      this.currentImageElement.remove();
      this.currentImageElement = null;
      this.isEditingImage = false;
    }
  }

  clearImage(): void {
    this.previsualizacion = '';
    this.archivos = [];
    this.isImage = true;
    this.validateInputs.controls['imgOrVideo'].setValue('image');
    this.validateInputs.controls['tipoBloque'].setValue('Único');
    this.validateInputs.controls['margin_top'].setValue('8px');
    this.validateInputs.controls['imageUrl'].setValue('');
    this.validateInputs.controls['margin_bottom'].setValue('8px');
    this.validateInputs.controls['borderRadius'].setValue(0);

    this.validateInputs.get('imgOrVideo')?.enable();
    this.validateInputs.get('tipoBloque')?.enable();
  }

  onTypeChange(event: any): void {
    const selectedType = event.target.value;
    this.isImage = selectedType === 'image';

    const tipoBloque = this.validateInputs.value.tipoBloque;
    if (selectedType === 'video') {
      this.validateInputs.get('ancho')?.disable();
      this.validateInputs.get('ancho')?.setValue('50rem');
      this.validateInputs.get('alto')?.setValue('25rem');
    } else {
      this.validateInputs.get('ancho')?.enable();
      this.validateInputs.get('ancho')?.setValue('600px');
      this.validateInputs.get('alto')?.setValue('300px');
    }
  }

  capturarFile(event: any,): void {
    const archivoCapturado = event.target.files[0];
    this.imageHandlerService.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
    });
    this.archivos.push(archivoCapturado);
  }

  extractYoutubeId(url: string): string {
    // Expresión regular para identificar varias formas de URLs de YouTube
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  toggleShowCode(): void {
    const content = this.textInput.nativeElement;
    const showCode = document.getElementById('show-code');
    let active = showCode?.dataset['active'] === 'true';

    this.showCodeActive = !this.showCodeActive;

    if (showCode) {
      showCode.dataset['active'] = String(!active);
      active = !active;

      if (active) {
        content.textContent = content.innerHTML;
        content.setAttribute('contenteditable', 'true');
        this.renderer.addClass(content, 'editing');
      } else {
        content.innerHTML = content.textContent;
        content.setAttribute('contenteditable', 'true');
        this.renderer.removeClass(content, 'editing');
      }
    }
  }

  toggleFullScreen(): void {
    const editor = document.querySelector('.container_Editor');

    if (!document.fullscreenElement) {
      if (editor) {
        if (editor.requestFullscreen) {
          editor.requestFullscreen();
        }
      }
      this.isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullScreen = false;
    }
  }

  clearContent(): void {
    this.textInput.nativeElement.innerHTML = '';
  }
}

