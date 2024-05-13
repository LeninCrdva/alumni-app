import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../../../data/service/AuthService';
import { UserService } from '../../../data/service/UserService';
import { Persona } from '../../../data/model/persona';
import { PersonaService } from '../../../data/service/PersonService';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Rol } from '../../../data/model/rol';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { AlertsService } from '../../../data/Alerts.service';
import { RegisterDTO } from '../../../data/model/DTO/RegisterDTO';
import { UserDTO } from '../../../data/model/DTO/UserDTO';
import { Ciudad } from '../../../data/model/ciudad';
import { sectorempresarial } from '../../../data/model/sectorEmpresarial';
import { CiudadService } from '../../../data/service/ciudad.service';
import { EmpresarioDTO } from '../../../data/model/DTO/EmpresarioDTO';
import { GraduadoDTO } from '../../../data/model/DTO/GraduadoDTO';
import { EmpresaDTO } from '../../../data/model/DTO/EmpresaDTO';
import { GraduadoService } from '../../../data/service/graduado.service';
import { EmpresarioService } from '../../../data/service/empresario.service';
import { fechaNacimientoValidator } from '../../authentication/register/fechaNacimientoValidator';
import { ValidatorsUtil } from '../../../components/Validations/ReactiveValidatorsRegEx';
import { AuditEntryService } from '../../../data/service/auditEntry.service';
import { AuditEntryDTO } from '../../../data/model/DTO/AuditEntryDTO';
import { AdministradorService } from '../../../data/service/administrador.service';
import { Administrador } from '../../../data/model/administrador';
import { DataValidationService } from '../../../data/service/data-validation.service';
import { ValidatorEc } from '../../../data/ValidatorEc.service';

@Component({
  selector: 'app-usuarios-lists',
  templateUrl: './usuarios-lists.component.html',
  styleUrls: ['./usuarios-lists.component.css']
})
export class UsuariosListsComponent implements OnInit {

  registerNewUserForm: FormGroup;
  formCase1: FormGroup;
  formCase2: FormGroup;
  formCase3: FormGroup;
  editMode: boolean = false;
  passwordVisible = false;
  ciudadesList: Ciudad[] = [];
  businessSectorsList: sectorempresarial[] = [];
  roleName!: string;
  'registerDto': RegisterDTO;
  id: any;
  showPassword: boolean = false;
  editarClicked = false;
  usersList: UserDTO[] = [];
  usersListFiltered: UserDTO[] = [];
  dataForValidation: UserDTO[] = [];
  roleList: Rol[] = [];
  person: Persona = new Persona();
  userDTO: UserDTO = new UserDTO();
  registerDTO: RegisterDTO = new RegisterDTO();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};
  userId!: number;
  //For validation
  currentIdentificacion!: string;
  currentEmail!: string;
  currentPhone!: string;
  currentUsername!: string;
  currentBusinessManEmail!: string;

  ngOnInit(): void {
    this.loadData();
    this.loadCities();
    this.editMode = false;
    const columnTitles = ['#', 'Nombre Usuario', 'Cédula', 'Rol', 'Estado'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar Usuarios...');
    this.filterService.initializeDropdowns('filterTable', columnTitles,);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private personService: PersonaService,
    private dataValidationService: DataValidationService,
    private ciudadService: CiudadService,
    private gradutateService: GraduadoService,
    private businessManService: EmpresarioService,
    private adminService: AdministradorService,
    private authService: AuthService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    public alertService: AlertsService,
    private AuditService: AuditEntryService,
    private validatorEc: ValidatorEc,
  ) {
    this.registerNewUserForm = this.fb.group({
      primerNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      primerApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      cedula: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator()), this.validateIdentityCard()]],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator())]],
      fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator()]],
      nombreUsuario: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersAndNumbersValidator())]],
      clave: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternPasswordValidator())]],
    });

    this.formCase1 = this.fb.group({
      descripcion: ['', Validators.required],
      anios: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,]],
      puesto: ['', Validators.required],
    });

    this.formCase2 = this.fb.group({
      ciudad: ['', Validators.required],
      anioGraduacion: ['', [Validators.required, this.validateMinRangeTitledDate(), this.validateMaxRangeTitleDate()]],
      emailPersonal: ['', [Validators.required, Validators.email]],
      estadoCivil: ['', Validators.required],
    });

    this.formCase3 = this.fb.group({
      cargo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.userId = localStorage.getItem('user_id') ? parseInt(localStorage.getItem('user_id')!) : 0;
  };

  titleHandler(): string {
    return this.editMode ? 'Editar ' + this.roleName : 'Crear nuevo ' + this.roleName;
  }

  closeModal(): void {
    this.registerNewUserForm.reset();
    this.editMode = false;
    const cancelButton = document.getElementById('close-button') as HTMLElement;
    if (cancelButton) {
      cancelButton.click();
    }
  }

  initForm(): void {
    this.registerNewUserForm = this.fb.group({
      primerNombre: ['SSAFSAFAF', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      primerApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      cedula: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator()), this.validateIdentityCard()]],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator())]],
      fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator()]],
      nombreUsuario: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersAndNumbersValidator())]],
      clave: []
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('InputPassword1') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  initFormCreate(): void {
    this.registerNewUserForm = this.fb.group({
      primerNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      primerApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoApellido: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      cedula: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator()), this.validateIdentityCard()]],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator())]],
      fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator()]],
      nombreUsuario: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersAndNumbersValidator())]],
      clave: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternPasswordValidator())]],
    });

  }

  callModal(): void {
    const boton = document.getElementById('open-modal-action');
    if (boton) {
      boton.click();
    }
    this.callAllForms();
  }

  controlOptionsOnCreate(role: string): void {
    switch (role) {
      case 'GRADUADO':
        this.callModal();
        break;
      case 'EMPRESARIO':
        this.callModal();
        break;
      case 'RESPONSABLE_CARRERA':
        this.callModal();
        break;
      case 'ADMINISTRADOR':
        this.callModal();
        break;
      default:
        break;
    }
  }

  showSelectedOption(): void {
    Swal.fire({
      title: "Seleccione una opción",
      icon: "question",
      html: `
      <b>Seleccione una opción para continuar:</b>
      <br>
      <div class="container mt-4">
        <div class="body">
          <div class="">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <label class="option-btn">
                  <input type="radio" name="option" id="adminBtn" autocomplete="off" value="ADMINISTRADOR"> Administrador
                </label>
              </li>
              <li class="list-group-item">            
                <label class="option-btn">
                  <input type="radio" name="option" id="graduadoBtn" autocomplete="off" value="GRADUADO"> Graduado
                </label>
              </li>
              <li class="list-group-item">
                  <label class="option-btn">
                    <input type="radio" name="option" id="empresarioBtn" autocomplete="off" value="EMPRESARIO"> Empresario
                  </label>
              </li>
              <li class="list-group-item">
                <label class="option-btn">
                  <input type="radio" name="option" id="responsableBtn" autocomplete="off" value="RESPONSABLE_CARRERA"> Responsable Carrera
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: false,
      didOpen: (modalElement) => {
        const radioButtons = modalElement.querySelectorAll('.option-btn input[type="radio"]');
        radioButtons.forEach((radioButton) => {
          radioButton.addEventListener('click', (event) => {
            const selectedOption = (event.target as HTMLInputElement).value;
            this.roleName = selectedOption;
            this.editMode = false;
            this.cleanErrorsForm(this.registerNewUserForm);
            this.initFormCreate();
            this.currentBusinessManEmail = '';
            this.currentEmail = '';
            this.currentIdentificacion = '';
            this.currentPhone = '';
            this.currentUsername = '';
            this.controlOptionsOnCreate(this.roleName);
            Swal.close();
          });
        });
      }
    });
  }

  loadCities() {
    this.ciudadService.getCiudades().subscribe((ciudades) => {
      this.ciudadesList = ciudades;
    });
  }


  async register() {
    if (this.registerNewUserForm.valid) {
      if (this.roleName) {
        switch (this.roleName) {
          case 'GRADUADO':
            if (this.formCase2.valid) {
              const formData = this.registerNewUserForm.value;
              this.registerDto = {
                cedula: formData.cedula,
                primerNombre: formData.primerNombre,
                segundoNombre: formData.segundoNombre,
                fechaNacimiento: formData.fechaNacimiento,
                telefono: formData.telefono,
                apellidoPaterno: formData.primerApellido,
                apellidoMaterno: formData.segundoApellido,
                sexo: formData.sexo,
                nombreUsuario: formData.nombreUsuario,
                clave: formData.clave,
                rol: this.roleName,
                estado: formData.nombreDelRol === 'GRADUADO' ? true : false,
                rutaImagen: '',
                urlImagen: '',
              };
              this.authService.signup(this.registerDto, this.registerBusinessMan(this.registerDto.nombreUsuario),
                new EmpresaDTO, this.registerGraduate(this.registerDto.nombreUsuario)).subscribe(() => {
                  let audit: AuditEntryDTO = {
                    timeStamp: new Date(),
                    actionType: 'INSERT',
                    userId: this.userId,
                    resourceName: 'Usuario: ' + formData.nombreUsuario,
                    actionDetails: 'Usuario: ' + formData.nombreUsuario + " Cédula: " + formData.cedula + " Rol: " + this.roleName,
                    oldValue: '',
                    newValue: ''
                  }
                  this.createAuditEntry(audit);
                });
            } else {
            }
            break;
          case 'EMPRESARIO':
            if (this.formCase1.valid) {
              const formData = this.registerNewUserForm.value;
              this.registerDto = {
                cedula: formData.cedula,
                primerNombre: formData.primerNombre,
                segundoNombre: formData.segundoNombre,
                fechaNacimiento: formData.fechaNacimiento,
                telefono: formData.telefono,
                apellidoPaterno: formData.primerApellido,
                apellidoMaterno: formData.segundoApellido,
                sexo: formData.sexo,
                nombreUsuario: formData.nombreUsuario,
                clave: formData.clave,
                rol: this.roleName,
                estado: false,
                rutaImagen: '',
                urlImagen: '',
              };
              this.authService.signup(this.registerDto, this.registerBusinessMan(this.registerDto.nombreUsuario),
                new EmpresaDTO, this.registerGraduate(this.registerDto.nombreUsuario)).subscribe(() => {
                  let audit: AuditEntryDTO = {
                    timeStamp: new Date(),
                    actionType: 'INSERT',
                    userId: this.userId,
                    resourceName: 'Usuario: ' + formData.nombreUsuario,
                    actionDetails: 'Usuario: ' + formData.nombreUsuario + " Cédula: " + formData.cedula + " Rol: " + this.roleName,
                    oldValue: '',
                    newValue: ''
                  }
                  this.createAuditEntry(audit);
                });
            } else {
              this.showErrorsForm(this.formCase1);
            }
            break;
          case 'ADMINISTRADOR':
            if (this.formCase3.valid) {
              const formData = this.registerNewUserForm.value;
              const aditionalData = this.formCase3.value;
              this.registerDto = {
                cedula: formData.cedula,
                primerNombre: formData.primerNombre,
                segundoNombre: formData.segundoNombre,
                fechaNacimiento: formData.fechaNacimiento,
                telefono: formData.telefono,
                apellidoPaterno: formData.primerApellido,
                apellidoMaterno: formData.segundoApellido,
                sexo: formData.sexo,
                nombreUsuario: formData.nombreUsuario,
                clave: formData.clave,
                rol: this.roleName,
                estado: true,
                rutaImagen: '',
                urlImagen: '',
              };
              let Administrador: Administrador = {
                cargo: aditionalData.cargo,
                estado: true,
                email: aditionalData.email,
                usuario: formData.nombreUsuario
              };
              this.authService.signupAdmin(this.registerDto).subscribe(async () => {
                await this.createAdmin(Administrador);
                let audit: AuditEntryDTO = {
                  timeStamp: new Date(),
                  actionType: 'INSERT',
                  userId: this.userId,
                  resourceName: 'Usuario: ' + formData.nombreUsuario,
                  actionDetails: 'Usuario: ' + formData.nombreUsuario + " Cédula: " + formData.cedula + " Rol: " + this.roleName,
                  oldValue: '',
                  newValue: ''
                }
                this.createAuditEntry(audit);
              });
            } else {
              this.showErrorsForm(this.formCase3);
            }
            break;
          case 'RESPONSABLE_CARRERA':
            if (this.registerNewUserForm.valid) {
              const formData = this.registerNewUserForm.value;
              this.registerDto = {
                cedula: formData.cedula,
                primerNombre: formData.primerNombre,
                segundoNombre: formData.segundoNombre,
                fechaNacimiento: formData.fechaNacimiento,
                telefono: formData.telefono,
                apellidoPaterno: formData.primerApellido,
                apellidoMaterno: formData.segundoApellido,
                sexo: formData.sexo,
                nombreUsuario: formData.nombreUsuario,
                clave: formData.clave,
                rol: this.roleName,
                estado: true,
                rutaImagen: '',
                urlImagen: '',
              };
              this.authService.signupAdmin(this.registerDto).subscribe(async () => {
                let audit: AuditEntryDTO = {
                  timeStamp: new Date(),
                  actionType: 'INSERT',
                  userId: this.userId,
                  resourceName: 'Usuario: ' + formData.nombreUsuario,
                  actionDetails: 'Usuario: ' + formData.nombreUsuario + " Cédula: " + formData.cedula + " Rol: " + this.roleName,
                  oldValue: '',
                  newValue: ''
                }
                this.createAuditEntry(audit);
              });
            } else {
              this.showErrorsForm(this.formCase3);
            }
            break;
        }
      }
    } else {
      this.showErrorsForm(this.registerNewUserForm);
    }
  }

  async createAuditEntry(audit: AuditEntryDTO) {
    this.AuditService.createAuditory(audit).subscribe({
      next: () => {
        this.loadData();
        this.closeModal();
      }
    });
  }

  async createAdmin(Administrador: any) {
    this.adminService.createAdministrador(Administrador).subscribe(() => {
      this.loadData();
    });
  }

  showErrorsForm(formName: FormGroup): void {
    Object.keys(formName.controls).forEach(key => {
      const control = formName.get(key);
      if (control != null && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  cleanErrorsForm(formName: FormGroup): void {
    Object.keys(formName.controls).forEach(key => {
      const control = formName.get(key);
      if (control != null && control.valid) {
        control.markAsUntouched();
      }
    });
  }

  callAllForms(): void {
    if (!this.editMode) {
      this.registerNewUserForm.reset();
      this.formCase1.reset();
      this.formCase2.reset();
      this.formCase3.reset();
    }
  }

  registerGraduate(user: string): GraduadoDTO | undefined {
    if (this.formCase2.valid) {
      const formData = this.formCase2.value;
      let graduate: GraduadoDTO = {
        usuario: user,
        ciudad: formData.ciudad,
        anioGraduacion: formData.anioGraduacion,
        emailPersonal: formData.emailPersonal,
        estadoCivil: formData.estadoCivil,
        rutaPdf: '',
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

  loadData() {
    this.userService.getUsersDTO().subscribe(
      (result) => {
        const rolesToShow = ['GRADUADO', 'EMPRESARIO', 'RESPONSABLE_CARRERA', 'ADMINISTRADOR'];
        this.dataForValidation = result;
        this.usersList = result.filter(
          (user) =>
            rolesToShow.includes(user.rol) &&
            (user.id !== this.userId)
        );

        this.usersListFiltered = [...this.usersList];

        if (this.initializeTable) {
          this.dtTrigger.next(null);
          this.initializeTable = false;
        } else {
          this.dtService.rerender(this.dtElement, this.dtTrigger);
        }
      }
    );
  }

  updateStateUser(id: any, usuarioDTO: UserDTO): void {
    this.userService.updateState(id, usuarioDTO.estado).subscribe(updatedUser => {
      const index = this.usersList.findIndex(u => u.id === updatedUser.id);
      this.loadData();
      if (index !== -1) {
        this.usersList[index] = updatedUser;
      }
    });
  }

  idPersona: any;
  oldData: any;
  getDataForUpdate(identification: any, id: any, role: any): void {
    this.editMode = true;
    this.personService.getPersonByIdentification(identification).subscribe((person) => {
      this.idPersona = person.id;
      this.currentIdentificacion = person.cedula;
      this.currentPhone = person.telefono;

      this.patchPersonAndUserData(id, person);
      switch (role) {
        case 'GRADUADO':
          this.roleName = 'GRADUADO';
          this.patchGraduateData(id);
          break;
        case 'EMPRESARIO':
          this.roleName = 'EMPRESARIO';
          this.patchBusinessManData(id);
          break;
        case 'RESPONSABLE_CARRERA':
          this.roleName = 'RESPONSABLE_CARRERA';
          break;
        default:
          break;
      }
    });
  }

  auditInEdit!: AuditEntryDTO;
  patchPersonAndUserData(id: any, person: Persona): void {
    this.userService.getUserDTOById(id).subscribe((user) => {
      this.currentUsername = user.nombreUsuario;
      this.oldData = person.primerNombre + ' ' + person.segundoNombre + ' ' + person.apellidoPaterno + ' ' + person.apellidoMaterno + ' ' + person.cedula + ' ' + person.telefono + ' ' + person.fechaNacimiento + ' ' + person.sexo + ' ' + user.nombreUsuario + ' ' + user.rol;
      this.id = user.id;
      this.userDTO = user;
      this.registerNewUserForm.patchValue({
        primerNombre: person.primerNombre,
        segundoNombre: person.segundoNombre,
        primerApellido: person.apellidoPaterno,
        segundoApellido: person.apellidoMaterno,
        cedula: person.cedula,
        telefono: person.telefono,
        fechaNacimiento: person.fechaNacimiento,
        sexo: person.sexo,
        nombreUsuario: user.nombreUsuario,
        nombreDelRol: user.rol,
      });
    });
  }

  idGraduate: any;
  patchGraduateData(userId: any): void {
    this.gradutateService.getGraduadoDTOByUserId(userId).subscribe((graduate) => {
      if (graduate) {
        this.idGraduate = graduate.id;
        this.currentEmail = graduate.emailPersonal;
        this.formCase2.patchValue({
          ciudad: graduate.ciudad,
          anioGraduacion: graduate.anioGraduacion,
          emailPersonal: graduate.emailPersonal,
          estadoCivil: graduate.estadoCivil
        });
      }
    });
  }

  patchBusinessManData(userId: any): void {
    this.businessManService.getBusinessManByUserId(userId).subscribe((businessMan) => {
      if (businessMan) {
        this.idBusinessMan = businessMan.id;
        this.currentBusinessManEmail = businessMan.email;
        this.formCase1.patchValue({
          descripcion: businessMan.descripcion,
          anios: businessMan.anios,
          email: businessMan.email,
          puesto: businessMan.puesto
        });
      }
    });
  }

  toggleSwitch(usuarioDTO: UserDTO): void {
    usuarioDTO.estado = !usuarioDTO.estado;
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea ${usuarioDTO.estado ? 'activar' : 'desactivar'} al Usuario ${usuarioDTO.nombreUsuario}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${usuarioDTO.estado ? 'activar' : 'desactivar'}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStateUser(usuarioDTO.id, usuarioDTO);
      } else {
        usuarioDTO.estado = !usuarioDTO.estado;
      }
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async updateUserData() {
    if (this.registerNewUserForm.valid) {
      const formData = this.registerNewUserForm.value;
      this.person.primerNombre = formData.primerNombre;
      this.person.segundoNombre = formData.segundoNombre;
      this.person.apellidoPaterno = formData.primerApellido;
      this.person.apellidoMaterno = formData.segundoApellido;
      this.person.cedula = formData.cedula;
      this.person.telefono = formData.telefono;
      this.person.fechaNacimiento = formData.fechaNacimiento;
      this.person.sexo = formData.sexo;
      let userDTO = new UserDTO();
      userDTO.nombreUsuario = formData.nombreUsuario;
      userDTO.rol = this.roleName;
      try {
        await this.personService.updatePerson(this.idPersona, this.person).toPromise();
        await this.userService.updateSomeDataUser(this.id, userDTO).toPromise();

        let audit: AuditEntryDTO = {
          timeStamp: new Date(),
          actionType: 'UPDATE',
          userId: this.userId,
          resourceName: 'Usuario: ' + formData.nombreUsuario + " ID: " + this.id,
          actionDetails: 'Usuario: ' + formData.nombreUsuario + " Cédula: " + formData.cedula + " Rol: " + this.roleName,
          oldValue: this.oldData,
          newValue: this.person.primerNombre + ' ' + this.person.segundoNombre + ' ' + this.person.apellidoPaterno + ' ' + this.person.apellidoMaterno + ' ' + this.person.cedula + ' ' + this.person.telefono + ' ' + this.person.fechaNacimiento + ' ' + this.person.sexo + ' ' + userDTO.nombreUsuario + ' ' + userDTO.rol
        }
        this.createAuditEntry(audit);
        this.editMode = true;
        await this.controlCaseUpdate(userDTO.nombreUsuario);
        this.loadData();
        this.closeModal();
      } catch (error) {
        //console.error('Error updating user data:', error);
      }
    } else {
      Object.values(this.registerNewUserForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  async controlCaseUpdate(username: any) {
    switch (this.roleName) {
      case 'GRADUADO':
        await this.updateGraduate(username);
        break;
      case 'EMPRESARIO':
        await this.updateBusinessMan(username);
        break;
    }
  }

  async updateGraduate(username: any) {
    if (this.formCase2.valid) {
      const formData = this.formCase2.value;
      let graduate: GraduadoDTO = {
        usuario: username,
        ciudad: formData.ciudad,
        anioGraduacion: formData.anioGraduacion,
        emailPersonal: formData.emailPersonal,
        estadoCivil: formData.estadoCivil,
        rutaPdf: '',
        urlPdf: ''
      };
      this.gradutateService.updateGraduateWithoutTitle(this.idGraduate, graduate).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'El usuario ha sido actualizado con éxito',
          timer: 2000
        });
      });
    } else {
      this.showErrorsForm(this.formCase2);
    }
  }

  idBusinessMan: any;
  async updateBusinessMan(username: any) {
    if (this.formCase1.valid) {
      const formData = this.formCase1.value;
      let businessMan: EmpresarioDTO = {
        usuario: username,
        descripcion: formData.descripcion,
        anios: formData.anios,
        email: formData.email,
        puesto: formData.puesto,
        estado: true
      };
      if (this.idBusinessMan) {
        this.businessManService.updateEmpresarioDTO(this.idBusinessMan, businessMan).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado',
            text: 'El usuario ha sido actualizado con éxito',
            timer: 2000
          });
        });
      }
    } else {
      this.showErrorsForm(this.formCase1);
    }
  }

  showWarningAlert(): void {
    Swal.fire({
      title: 'Edición desactivada',
      text: 'Para editar un usuario, primero debe activarlo.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
    });
  }

  async showUserData(identification: string, id: any) {
    this.personService.getPersonByIdentification(identification).subscribe(async (person) => {
      this.person = person;
      this.userService.getUserDTOById(id).subscribe((user) => {
        this.userDTO = user;
      });
    });
  }

  handleClick(cedula: string, id: any, estado: boolean, role: string) {
    this.editMode = true;
    if (estado) {
      this.initForm();
      this.getDataForUpdate(cedula, id, role);
    } else {
      this.showWarningAlert();
    }
  }

  fileContent: string | ArrayBuffer | null = null;

  async importarDatos(): Promise<void> {
    if (!this.fileContent || typeof this.fileContent !== 'string') {
      this.alertService.mostrarSweetAlert(false, 'No hay archivo o formato inválido.');
      return;
    }

    try {
      this.alertService.mostrarAlertaCargando('Importando datos...');
      const data = JSON.parse(this.fileContent);

      if (Array.isArray(data)) {
        for (const dataToRestore of data) {
          //await this.ofertaService.createOfertaLaboral(dataToRestore).toPromise();
        }
        this.alertService.mostrarSweetAlert(true, 'Todo el contenido fue restaurado con éxito.');
      } else {
        this.alertService.mostrarSweetAlert(false, 'El JSON proporcionado no es un array.');
      }
    } catch (error: any) {
      this.alertService.mostrarSweetAlert(false, 'Error al parsear JSON: ' + error.message);
    } finally {
      this.alertService.detenerAlertaCargando();
    }
    this.loadData();
  }

  duplicatedFields: { [key: string]: boolean } = {
    identityCard: false,
    phone: false,
    username: false,
    businessManEmail: false,
    graduateEmail: false,
    adminEmail: false
  };

  validateUniqueIdentityCard(): void {
    if (this.registerNewUserForm.get('cedula')?.valid) {
      const currentIdentityCard = this.currentIdentificacion;
      const identityCard = this.registerNewUserForm.get('cedula')?.value;
      if (identityCard !== currentIdentityCard) {
        this.dataValidationService.validateIdentityCard(identityCard).subscribe(res => {
          this.duplicatedFields['identityCard'] = res;
        });
      } else {
        this.duplicatedFields['identityCard'] = false;
      }
    }
  }

  validatePhone(): void {
    if (this.registerNewUserForm.get('telefono')?.valid) {
      const currentPhone = this.currentPhone;
      const phone = this.registerNewUserForm.get('telefono')?.value;
      if (phone !== currentPhone) {
        this.dataValidationService.validatePhone(phone).subscribe(res => {
          this.duplicatedFields['phone'] = res;
        });
      } else {
        this.duplicatedFields['phone'] = false;
      }
    }
  }

  validateAdminEmail(): void {
    if (this.formCase3.get('email')?.valid) {
      const currentEmail = this.currentEmail;
      const email = this.formCase3.get('email')?.value;
      if (email !== currentEmail) {
        this.dataValidationService.validateAdminEmail(email).subscribe(res => {
          this.duplicatedFields['adminEmail'] = res;
        });
      } else {
        this.duplicatedFields['adminEmail'] = false;
      }
    }
  }

  validateUsername(): void {
    if (this.registerNewUserForm.get('nombreUsuario')?.valid) {
      const currentUsername = this.currentUsername;
      const username = this.registerNewUserForm.get('nombreUsuario')?.value.toLowerCase();
      if (username !== currentUsername) {
        this.dataValidationService.validateUsername(username).subscribe(res => {
          this.duplicatedFields['username'] = res;
        });
      } else {
        this.duplicatedFields['username'] = false;
      }
    }
  }

  validateBusinessManEmail(): void {
    if (this.formCase1.get('email')?.valid) {
      const currentEmail = this.currentBusinessManEmail;
      const email = this.formCase1.get('email')?.value;
      if (email !== currentEmail) {
        this.dataValidationService.validateBusinessEmail(email).subscribe(res => {
          this.duplicatedFields['businessManEmail'] = res;
        });
      } else {
        this.duplicatedFields['businessManEmail'] = false;
      }
    }
  }

  validateGraduateEmail(): void {
    if (this.formCase2.get('emailPersonal')?.valid) {
      const currentEmail = this.currentEmail;
      const email = this.formCase2.get('emailPersonal')?.value;

      if (email !== currentEmail) {
        this.dataValidationService.validateGraduateEmail(email).subscribe(res => {
          this.duplicatedFields['graduateEmail'] = res;
        });
      } else {
        this.duplicatedFields['graduateEmail'] = false;
      }
    }
  }

  isButtonDisabled(): boolean {
    return Object.values(this.duplicatedFields).some(value => value);
  }

  validateIdentityCard(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const identityCard = control.value;
      return !identityCard ? null : this.validatorEc.validarCedula(identityCard) ? null : { invalidIdentityCard: true };
    };
  }

  getMinDate(): Date | null {
    const birthDate = this.registerNewUserForm.get('fechaNacimiento')?.value ?? null;
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
    const birthDate = this.registerNewUserForm.get('fechaNacimiento')?.value;

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

      return age <= 55 && age >= 20 ? null : { invalidRangeAge: true };
    };
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
