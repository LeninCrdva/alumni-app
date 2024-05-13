import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PeriodoService } from '../../../data/service/periodo.service';
import { CarreraService } from '../../../data/service/carrera.service';
import { Periodo } from '../../../data/model/periodo';
import { Carrera } from '../../../data/model/carrera';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorsUtil } from '../../../components/Validations/ReactiveValidatorsRegEx';

@Component({
  selector: 'app-periodo-carrera',
  templateUrl: './periodo-carrera.component.html',
  styleUrl: './periodo-carrera.component.css'
})
export class PeriodoCarreraComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  ngOnInit(): void {
    this.getAllPeriods();
    this.getAllCareers();
    this.inicializateDropDown();
  }

  inicializateDropDown(): void {
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar Todo',
      unSelectAllText: "Quitar Todo",
      itemsShowLimit: 6,
      allowSearchFilter: this.ShowFilter
    };
  }

  closeModal() {
    this.registerPeriodForm.reset();
    this.editMode = false;
    const cancelButton = document.getElementById('close-button') as HTMLElement;
    if (cancelButton) {
      cancelButton.click();
    }
  }

  registerPeriodForm: FormGroup;

  constructor(formBuilder: FormBuilder,
    private periodService: PeriodoService,
    private careerService: CarreraService) {

    this.registerPeriodForm = formBuilder.group({
      nombrePeriodo: ['', [Validators.required, this.validateUniquePeriodName(), Validators.pattern(ValidatorsUtil.patternPeriodNameValidator())]],
      fecha_inicio: ['', [Validators.required, this.validateDates()]],
      fecha_fin: ['', [Validators.required, this.validateDates()]],
      carreras: [this.selectedItems, Validators.required],
    });
  }

  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  selectedItems: Carrera[] = [];
  dropdownSettings: any = {};
  periodList: Periodo[] = [];
  careerList: Carrera[] = [];
  period: Periodo = new Periodo();
  newPeriod: Periodo = new Periodo();
  editMode: boolean = false;

  originalCareerList: Carrera[] = [];
  originalPeriodList: Periodo[] = [];

  getAllPeriods(): void {
    this.periodService.getPeriodos().subscribe(data => {
      this.periodList = data;
    });
  }

  getCareerNames(carreras: Carrera[]): string {
    return carreras.map(carrera => carrera.nombre).join(' | ');
  }

  getAllCareers(): void {
    this.careerService.getCarreras().subscribe(data => {
      this.careerList = data;
    });
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.addEventListener('input', () => {
      const filterText = this.searchInput.nativeElement.value;
      this.filterPeriods(filterText);
      this.filterCareers(filterText);
    });
  }

  filterPeriods(filterText: string): void {
    if (!filterText.trim()) {
      this.getAllPeriods();
    } else {
      this.periodList = this.filteredPeriodList(filterText);
    }
  }

  filteredPeriodList(filterText: string): Periodo[] {
    return this.periodList.filter(period =>
      period.nombre.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  filterCareers(filterText: string): void {
    if (!filterText.trim()) {
      this.getAllCareers();
    } else {
      this.careerList = this.filteredList(filterText);
    }
  }

  filteredList(filterText: string): Carrera[] {
    return this.careerList.filter(career =>
      career.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      career.descripcion.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  createPeriod(): void {
    this.editMode = false;
    if (this.registerPeriodForm.valid) {
      const formData = this.registerPeriodForm.value;
      this.period = {
        nombre: formData.nombrePeriodo,
        estado: true,
        fechaInicio: formData.fecha_inicio,
        fechaFin: formData.fecha_fin,
        carreras: formData.carreras
      }
      this.periodService.createPeriodo(this.period).subscribe(() => {
        this.getAllPeriods();
        Swal.fire({
          icon: 'success',
          title: 'Período creado',
          text: 'El período ha sido creado correctamente',
          timer: 1000
        });
        this.registerPeriodForm.reset();
        this.closeModal();
      })
    } else {
      Object.values(this.registerPeriodForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  catchPeriod(period: Periodo): void {
    this.editMode = true;
    if (period) {
      const periodEdit: Periodo = { ...period };

      this.registerPeriodForm.patchValue({
        nombrePeriodo: periodEdit.nombre,
        fecha_inicio: periodEdit.fechaInicio,
        fecha_fin: periodEdit.fechaFin,
        carreras: periodEdit.carreras
      });
      this.newPeriod = period;
    }
  }

  UpdatePeriod(): void {
    this.editMode = true;
    const id = this.newPeriod.id;
    if (id !== undefined) {
      const formData = this.registerPeriodForm.value;

      const periodEdit = {
        id: id,
        nombre: formData.nombrePeriodo,
        estado: this.newPeriod.estado,
        fechaInicio: formData.fecha_inicio,
        fechaFin: formData.fecha_fin,
        carreras: formData.carreras
      };
      this.editPeriodEndPoint(id, periodEdit);
      this.closeModal();
    } else {
      console.error('Fatal Error: No se proporcionó un ID válido.');
    }
  }

  editPeriodEndPoint(id: any, period: Periodo) {
    this.periodService.updatePeriod(id, period).subscribe(updatedPeriod => {
      const index = this.periodList.findIndex(u => u.id === updatedPeriod.id);
      this.getAllPeriods();
      if (index !== -1) {
        this.periodList[index] = updatedPeriod;
      }
      Swal.fire({
        icon: 'success',
        title: 'Período actualizado',
        text: 'El período ha sido actualizado correctamente',
        timer: 1000
      });
      this.registerPeriodForm.reset();
      this.closeModal();
    });
  }

  updateStatePeriod(id: any, period: Periodo): void {
    this.periodService.updatePeriod(id, period).subscribe(updatedPeriodState => {
      const index = this.periodList.findIndex(u => u.id === updatedPeriodState.id);
      this.getAllPeriods();
      if (index !== -1) {
        this.periodList[index] = updatedPeriodState;
      }
    });
  }

  toggleSwitch(periodState: Periodo): void {
    periodState.estado = !periodState.estado;
    this.updateStatePeriod(periodState.id, periodState);
  }

  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }

  validateUniquePeriodName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.editMode) {
        return null;
      }
      const periodName = control.value;
      if (periodName) {
        const period = this.periodList.find(period => period.nombre.toUpperCase() === periodName.toUpperCase());
        return period ? { uniquePeriodName: true } : null;
      }
      return null;
    };
  }

  validateDates(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (this.registerPeriodForm) {
        const startDate = this.registerPeriodForm.get('fecha_inicio')?.value;
        const endDate = this.registerPeriodForm.get('fecha_fin')?.value;
        if (startDate && endDate) {
          if (startDate > endDate) {
            this.registerPeriodForm.get('fecha_fin')?.setErrors({ invalidDate: true });
            return { invalidDate: true };
          } else {
            this.registerPeriodForm.get('fecha_fin')?.setErrors(null);
            return null;
          }
        }
      }
      return null;
    };
  }

  activeDatePicker: boolean = true;
  getMinEndDate(): string {
    const startDate = this.registerPeriodForm.get('fecha_inicio')?.value;
  
    if (startDate) {
      this.activeDatePicker = false;
      const minEndDate = new Date(startDate);
      minEndDate.setMonth(minEndDate.getMonth() + 2);
  
      const year = minEndDate.getFullYear();
      const month = String(minEndDate.getMonth() + 1).padStart(2, '0');
      const day = String(minEndDate.getDate()).padStart(2, '0');
      const formattedMinEndDate = `${year}-${month}-${day}`;
  
      return formattedMinEndDate;
    }
  
    return '';
  }

  getMaxEndDate(): string {
    const startDate = this.registerPeriodForm.get('fecha_inicio')?.value;
  
    if (startDate) {
      const minEndDate = new Date(startDate);
      minEndDate.setMonth(minEndDate.getMonth() + 8); 
  
      const year = minEndDate.getFullYear();
      const month = String(minEndDate.getMonth() + 1).padStart(2, '0');
      const day = String(minEndDate.getDate()).padStart(2, '0');
      const formattedMinEndDate = `${year}-${month}-${day}`;
  
      return formattedMinEndDate;
    }
  
    return '';
  }

  getMinStartDate(): string {
    return new Date(1990, 0, 1).toISOString().split('T')[0];
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

}