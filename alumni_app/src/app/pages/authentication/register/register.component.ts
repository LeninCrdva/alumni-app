import { Component, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../data/service/AuthService';
import { AssetService } from '../../../data/service/Asset.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { RegisterDTO } from '../../../data/model/DTO/RegisterDTO';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { fechaNacimientoValidator } from './fechaNacimientoValidator';
import { CiudadService } from '../../../data/service/ciudad.service';
import { Ciudad } from '../../../data/model/ciudad';
import { sectorempresarial } from '../../../data/model/sectorEmpresarial';
import { SectorEmpresarialService } from '../../../data/service/sectorempresarial.service';
import { GraduadoDTO } from '../../../data/model/DTO/GraduadoDTO';
import { EmpresarioDTO } from '../../../data/model/DTO/EmpresarioDTO';
import { EmpresaDTO } from '../../../data/model/DTO/EmpresaDTO';
import { AlertsService } from '../../../data/Alerts.service';
import { ValidatorsUtil } from '../../../components/Validations/ReactiveValidatorsRegEx';
import { ImageHandlerServiceFoto } from '../../../data/service/ImageHandlerServiceFoto';
import { PdfHandlerService } from '../../../data/service/pdfHandlerService.service';
import { DataValidationService } from '../../../data/service/data-validation.service';
import { ValidatorEc } from '../../../data/ValidatorEc.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  options_Register: AnimationOptions = {
    path: '../../../assets/anims/register_anim.json',
  };
  isSubmit = false;
  registerForm: FormGroup;
  subRegisterForm: FormGroup;
  formCase1: FormGroup;
  formSubCase1: FormGroup;
  formCase2: FormGroup;

  //imagenes//
  public archivos: any = []
  public loading?: boolean
  public username: string = '';
  public inforest: any = [];
  public getRuta: string = '';
  public mensajevalidado: string = '';
  urlPhoto: any;
  'registerDto': RegisterDTO;
  roleName!: string;
  ciudadesList: Ciudad[] = [];
  businessSectorsList: sectorempresarial[] = [];

  constructor(
    public pdfHandlerService: PdfHandlerService,
    public imageHandlerService: ImageHandlerServiceFoto,
    private fb: FormBuilder,
    private assetService: AssetService,
    private authService: AuthService,
    private ciudadService: CiudadService,
    private businessSectorService: SectorEmpresarialService,
    private router: Router,
    private renderer: Renderer2,
    private alertService: AlertsService,
    private dataValidationService: DataValidationService,
    private validatorEc: ValidatorEc
  ) {
    this.roleName = localStorage.getItem('userRole') ?? '';

    this.registerForm = this.fb.group({
      primerNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      primerApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      cedula: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator()), this.validateIdentityCard()]],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator())]],
      fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator()]],
      nombreDelRol: [localStorage.getItem('userRole') ?? '', Validators.required],
    });

    this.subRegisterForm = this.fb.group({
      nombreUsuario: [this.generateRandomUsername(), [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersAndNumbersValidator())]],
      clave: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternPasswordValidator())]],
    });

    this.formCase1 = this.fb.group({
      descripcion: ['', Validators.required],
      anios: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      puesto: ['', Validators.required],
    });

    this.formSubCase1 = this.fb.group({
      ciudad: ['', Validators.required],
      sectorEmpresarial: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternRucValidator()), this.validateRuc()]],
      nombre: ['', Validators.required],
      tipoEmpresa: ['', Validators.required],
      razonSocial: ['', Validators.required],
      area: ['', [Validators.required]],
      sitioWeb: [''],
      ubicacion: ['', [Validators.required]],
    });

    this.formCase2 = this.fb.group({
      ciudad: ['', Validators.required],
      anioGraduacion: ['', [Validators.required, this.validateMinRangeTitledDate(), this.validateMaxRangeTitleDate()]],
      emailPersonal: ['', [Validators.required, Validators.email]],
      estadoCivil: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.changeSections();
    this.simpleControl();
    this.controlByRole(this.roleName);
  }

  passwordVisible = false;
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('InputPassword1') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }
  generateRandomUsername(): string {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      username += allowedChars[randomIndex];
    }
    return username;
  }

  simpleControl(): void {
    if (!this.roleName) {
      this.router.navigate(['account/login']);
    }
  }

  cleanErrorsForm(formName: FormGroup): void {
    Object.keys(formName.controls).forEach(key => {
      const control = formName.get(key);
      if (control != null && control.valid) {
        control.markAsUntouched();
      }
    });
  }

  changeSections(): void {
    jQuery(() => {
      const navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
        allPrevBtn = $('.prevBtn');

      allWells.hide();

      navListItems.on('click', function (e) {
        e.preventDefault();
        const href = $(this).attr('href');
        if (href) {
          const $target = $(href),
            $item = $(this);
          if ($item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').trigger('focus');
          }
        }
      });

      allPrevBtn.on('click', function () {
        const curStep = $(this).closest('.setup-content'),
          curStepBtn = curStep.attr('id'),
          prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children('a');
        prevStepWizard.removeAttr('disabled').trigger('click');
      });

      allNextBtn.on('click', function () {
        const curStep = $(this).closest('.setup-content'),
          curStepBtn = curStep.attr('id'),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children('a');
        nextStepWizard.removeAttr('disabled').trigger('click');
      });

      $('div.setup-panel div a.btn-primary').trigger('click');
    });
  }

  showInputsValidations() {
    this.alertService.showInputsValidations(this.renderer);
  }

  resetInputsValidations() {
    this.alertService.resetInputsValidations(this.renderer);
  }

  loadCities() {
    this.ciudadService.getCiudades().subscribe((ciudades) => {
      this.ciudadesList = ciudades;
    });
  }

  loadBusinessSectors() {
    this.businessSectorService.getSectoresEmpresariales().subscribe((sectores) => {
      this.businessSectorsList = sectores;
    });
  }

  controlByRole(rol: string): void {
    this.loadCities();
    switch (rol) {
      case 'EMPRESARIO':
        this.loadBusinessSectors();
        break;
      default:
        break;
    }
  }

  onSexoChange(event: any, value: string) {
    if (event.target.checked) {
      this.registerForm.patchValue({
        sexo: value
      });
    } else {
      this.registerForm.patchValue({
        sexo: ''
      });
    }
  }

  //-----------------------Imagen o Archivos--------------------------------------------------//
  rutaImagen: any;
  rutaPdf: any;

  onFileSelected(event: any): void {
    this.imageHandlerService.capturarFile(event);
    this.imageHandlerService.previsualizacion;
  }

  onPdfSelected(event: any): void {
    this.pdfHandlerService.handlePdfFile(event);
    this.pdfHandlerService.pdfUrl;
  }

  deleteFile(rutakey: string) {
    this.assetService.delete(rutakey).subscribe(r => {
      //console.log("archivo eliminado")
    })
  }

  async uploadAndSetRutaImagen(file: File, type: string = 'image') {
    try {
      const observable = this.assetService.upload(file);
      const data: HttpEvent<any> | undefined = await lastValueFrom(observable);

      if (type === 'image') {
        if (data instanceof HttpResponse) {
          const key = data.body?.key;
          this.rutaImagen = key;
        }
      } else {
        if (data instanceof HttpResponse) {
          const key = data.body?.key;
          this.rutaPdf = key;
        }
      }
    } catch (error) {
      //console.error('Error al subir la imagen:', error);
    }
  }

  async register() {
    if (this.registerForm.valid) {

      const formData = this.registerForm.value;
      const subFormData = this.subRegisterForm.value;
      if (this.imageHandlerService.archivos) {
        await this.uploadAndSetRutaImagen(this.imageHandlerService.archivos[0]);
        await this.uploadAndSetRutaImagen(this.pdfHandlerService.pdfFile[0], 'pdf');
      }
      this.registerDto = {
        cedula: formData.cedula,
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: formData.telefono,
        apellidoPaterno: formData.primerApellido,
        apellidoMaterno: formData.segundoApellido,
        sexo: formData.sexo,
        nombreUsuario: subFormData.nombreUsuario,
        clave: subFormData.clave,
        rol: formData.nombreDelRol,
        estado: formData.nombreDelRol === 'GRADUADO' ? true : false,
        rutaImagen: this.rutaImagen,
        urlImagen: '',
      };
      this.authService.signup(this.registerDto, this.registerBusinessMan(this.registerDto.nombreUsuario),
        this.registerCompany(this.registerDto.nombreUsuario), this.registerGraduate(this.registerDto.nombreUsuario, this.rutaPdf)).subscribe(() => {
          this.router.navigate(['account/login']);
          this.showAlert(this.registerDto);
        }
        );
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control != null && control.invalid) {
          //console.warn(`Campo '${key}' tiene errores:`, control.errors);
        }
      });
    }
  }

  registerGraduate(user: string, rutaPdf: any): GraduadoDTO | undefined {
    if (this.formCase2.valid) {
      const formData = this.formCase2.value;
      let graduate: GraduadoDTO = {
        usuario: user,
        ciudad: formData.ciudad,
        anioGraduacion: formData.anioGraduacion,
        emailPersonal: formData.emailPersonal,
        estadoCivil: formData.estadoCivil,
        rutaPdf: rutaPdf,
        urlPdf: ''
      };
      return graduate;
    }
    return undefined;
  }

  registerBusinessMan(user: string): EmpresarioDTO | undefined {
    if (this.formCase1.valid) {
      const formData = this.formCase1.value;
      let businessMan: EmpresarioDTO = {
        usuario: user,
        descripcion: formData.descripcion,
        anios: formData.anios,
        email: formData.email,
        puesto: formData.puesto,
        estado: false
      };
      return businessMan;
    }
    return undefined;
  }

  registerCompany(businessManUser: string): EmpresaDTO | undefined {
    if (this.formSubCase1.valid) {
      const formData = this.formSubCase1.value;
      let company: EmpresaDTO = {
        empresario: businessManUser,
        ciudad: formData.ciudad,
        sectorEmpresarial: formData.sectorEmpresarial,
        ruc: formData.ruc,
        nombre: formData.nombre,
        tipoEmpresa: formData.tipoEmpresa,
        razonSocial: formData.razonSocial,
        area: formData.area,
        sitioWeb: formData.sitioWeb,
        ubicacion: formData.ubicacion,
        estado: false,
        rutaPdfRuc: this.rutaPdf,
        urlPdfRuc: ''
      };
      return company;
    }
    return undefined;
  }

  showAlert(resp: RegisterDTO) {
    if (resp.rol.includes('EMPRESARIO') || resp.rol.includes('ADMINISTRADOR')) {
      Swal.fire({
        icon: 'info',
        text: 'Su cuenta se ha registrado correctamente, pero necesita ser aprobada por un administrador para poder iniciar sesión.'
      });
    } else {
      Swal.fire({
        icon: 'success',
        text: 'Datos cargados'
      });
    }
  }

  duplicatedFields: { [key: string]: boolean } = {
    identityCard: false,
    phone: false,
    username: false,
    businessManEmail: false,
    companyRuc: false,
    companyName: false,
    graduateEmail: false
  };

  validateUniqueIdentityCard(): void {
    if (this.registerForm.get('cedula')?.valid) {
      const identityCard = this.registerForm.get('cedula')?.value;
      this.dataValidationService.validateIdentityCard(identityCard).subscribe(res => {
        this.duplicatedFields['identityCard'] = res;
      });
    }
  }

  validatePhone(): void {
    if (this.registerForm.get('telefono')?.valid) {
      const phone = this.registerForm.get('telefono')?.value;
      this.dataValidationService.validatePhone(phone).subscribe(res => {
        this.duplicatedFields['phone'] = res;
      });
    }
  }

  validateUsername(): void {
    if (this.subRegisterForm.get('nombreUsuario')?.valid) {
      const username = this.subRegisterForm.get('nombreUsuario')?.value;
      this.dataValidationService.validateUsername(username).subscribe(res => {
        this.duplicatedFields['username'] = res;
      });
    }
  }

  validateBusinessManEmail(): void {
    if (this.formCase1.get('email')?.valid) {
      const email = this.formCase1.get('email')?.value;
      this.dataValidationService.validateBusinessEmail(email).subscribe(res => {
        this.duplicatedFields['businessManEmail'] = res;
      });
    }
  }

  validateGraduateEmail(): void {
    if (this.formCase2.get('emailPersonal')?.valid) {
      const email = this.formCase2.get('emailPersonal')?.value;
      this.dataValidationService.validateGraduateEmail(email).subscribe(res => {
        this.duplicatedFields['graduateEmail'] = res;
      });
    }
  }

  validateCompanyRuc(): void {
    if (this.formSubCase1.get('ruc')?.valid) {
      const ruc = this.formSubCase1.get('ruc')?.value;
      this.dataValidationService.validateCompanyRuc(ruc).subscribe(res => {
        this.duplicatedFields['companyRuc'] = res;
      });
    }
  }

  validateCompanyName(): void {
    if (this.formSubCase1.get('nombre')?.valid) {
      const name = this.formSubCase1.get('nombre')?.value;
      this.dataValidationService.validateCompnanyName(name).subscribe(res => {
        this.duplicatedFields['companyName'] = res;
      });
    }
  }

  isButtonDisabled(): boolean {
    return Object.values(this.duplicatedFields).some(value => value);
  }

  validateIdentityCard(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const identityCard = control.value;
      return this.validatorEc.validarCedula(identityCard) ? null : { invalidIdentityCard: true };
    };
  }

  validateRuc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ruc = control.value;
      return this.validatorEc.validarRucSociedadPrivada(ruc) || this.validatorEc.validarRucPersonaNatural(ruc) || this.validatorEc.validarRucSociedadPublica(ruc) ? null : { invalidRuc: true };
    };
  }

  getMinDate(): Date | null {
    const birthDate = this.registerForm.get('fechaNacimiento')?.value ?? null;
    if (!birthDate) return null;

    const yearsToAdd = 20;
    const newDate = new Date(birthDate);
    newDate.setFullYear(newDate.getFullYear() + yearsToAdd);
    return newDate;
  }

  minFormatDate(): string {
    const minDate = this.getMinDate();
    return minDate ? minDate.toISOString().split('T')[0] : '';
  }

  getCurrentAge(): number {
    const birthDate = this.registerForm.get('fechaNacimiento')?.value;

    if (!birthDate) {
      return 0;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) {
      return 0;
    }

    if (birth > today) {
      return 0;
    }

    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }


  validateMinRangeTitledDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = new Date(control.value);
      const minDate = this.getMinDate();

      if (!minDate || !date) {
        return null;
      }

      const minDateObj = new Date(minDate);

      return minDateObj <= date ? null : { invalidMinDate: true };
    };
  }

  validateMaxRangeTitleDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const age = this.getCurrentAge();

      console.log('age', age);

      return age <= 55 && age >= 20 ? null : { invalidRangeAge: true };
    };
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}