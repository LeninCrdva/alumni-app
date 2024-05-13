import { Component, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Carrera } from '../../../data/model/carrera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarreraService } from '../../../data/service/carrera.service';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrl: './carrera.component.css'
})
export class CarreraComponent {

  ngOnInit(): void {
    this.getAllCareers();
  }

  registerCareerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private careerService: CarreraService) {
    this.registerCareerForm = formBuilder.group({
      nombreCarrera: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9\s.,-]*$/)]],
      descripcionCarrera: ['', [Validators.pattern(/^[a-zA-Z0-9\s.,-]*$/)]]
    })
  }

  careerList: Carrera[] = [];
  carrer: Carrera = new Carrera();
  newCarrer: Carrera = new Carrera();
  editMode: boolean = false;

  getAllCareers(): void {
    this.careerService.getCarreras().subscribe(data => {
      this.careerList = data;
    });
  }

  closeModal() {
    this.registerCareerForm.reset();
    this.editMode = false;
    const cancelButton = document.getElementById('close-button') as HTMLElement;
    if (cancelButton) {
      cancelButton.click();
    }
  }

  @ViewChild('searchInput') searchInput!: ElementRef;

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.addEventListener('input', () => {
      const filterText = this.searchInput.nativeElement.value;
      this.filterCareers(filterText);
    });
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

  createCareer(): void {
    this.editMode = false;
    if (this.registerCareerForm.valid) {
      const formData = this.registerCareerForm.value;
      this.carrer = {
        nombre: formData.nombreCarrera,
        descripcion: formData.descripcionCarrera,
      }

      this.careerService.createCarrera(this.carrer).subscribe(response => {
        this.getAllCareers();
        Swal.fire({
          icon: 'success',
          text: 'Carrera creada'
        });
        this.closeModal();
      })
    } else {
      Object.values(this.registerCareerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  catchCareer(career: Carrera): void {
    this.editMode = true;
    if (career) {
      const careerEdit: Carrera = { ...career };

      this.registerCareerForm.patchValue({
        nombreCarrera: careerEdit.nombre,
        descripcionCarrera: careerEdit.descripcion,

      });
      this.newCarrer = career;
    }
  }

  UpdateCareer(): void {
    this.editMode = true;
    const id = this.newCarrer.id;
    if (this.registerCareerForm.valid) {
      if (id !== undefined) {
        const formData = this.registerCareerForm.value;

        const careerEdit = {
          id: id,
          nombre: formData.nombreCarrera,
          descripcion: formData.descripcionCarrera
        };
        this.editCareerEndPoint(id, careerEdit);
        this.registerCareerForm.clearValidators();
        this.registerCareerForm.reset();
        this.closeModal();
      } else {
        console.error('Fatal Error: No se proporcionó un ID válido.');
      }
    } else {
      Object.values(this.registerCareerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  editCareerEndPoint(id: any, career: Carrera) {
    this.careerService.updateCarrera(id, career).subscribe(updatedCareer => {
      const index = this.careerList.findIndex(u => u.id === updatedCareer.id);
      this.getAllCareers();
      if (index !== -1) {
        this.careerList[index] = updatedCareer;
      }
      Swal.fire({
        icon: 'success',
        title: 'Carrera actualizada',
        text: 'Carrera actualizada correctamente',
        timer: 1000
      });
    });
  }
}
