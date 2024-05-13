import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from '../../../data/service/provincia.service';
import { Provincia } from '../../../data/model/provincia';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CiudadService } from '../../../data/service/ciudad.service';
import { CiudadDTO } from '../../../data/model/DTO/ciudadDTO';
import { Ciudad } from '../../../data/model/ciudad';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrl: './provincia.component.css'
})
export class ProvinciaComponent implements OnInit {

  registerProvinceForm: FormGroup;

  registerCityForm: FormGroup;
  showModal: boolean = false;

  constructor(private provinciaService: ProvinciaService, private ciudadService: CiudadService, formBuilder: FormBuilder) {
    this.registerProvinceForm = formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]],
      pais: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]],


    });
    this.registerCityForm = formBuilder.group({
      nombreCiudad: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]],
      provinciaNombre: ['', Validators.required]
    })
  };

  ngOnInit(): void {
    this.getAllProvinces();
    this.getAllCities();
  }
  
 

  provincesList: Provincia[] = [];
  provincesListFiltered: Provincia[] = [];

  province: Provincia = new Provincia();
  newProvince: Provincia = new Provincia();
  newCity: CiudadDTO = new CiudadDTO();
  citiesListDTO: CiudadDTO[] = [];
  citiesListDTOFiltered: CiudadDTO[] = [];
  cities: Ciudad[] = [];
  city: CiudadDTO = new CiudadDTO();

  getAllCities(): void {
    this.ciudadService.getCiudadesDTO().subscribe(ciudades => {
      this.citiesListDTO = ciudades;
      this.citiesListDTOFiltered = [...this.citiesListDTO];
    })
  }

  editarClicked = false;
  editModeProvince: boolean = false;
  editModeCity: boolean = false;

  getAllProvinces(): void {
    this.provinciaService.getProvincias().subscribe(prov => {
      this.provincesList = prov;
      this.provincesListFiltered = [...this.provincesList];
    });
  }

  onSearch(event: Event) {
    const selectValue = (
      document.getElementById('selectInput') as HTMLSelectElement
    ).value;
  
    const value = (event.target as HTMLInputElement).value;
    if (selectValue == '1') {
      if (value === '' || value === null || value === undefined) {
        this.getAllCities();
        this.provincesList = this.provincesListFiltered;
      } else {
        this.citiesListDTO = this.citiesListDTOFiltered.filter((city) =>
          city.nombre.startsWith(value.toLocaleUpperCase())
        );
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        this.getAllCities();
        this.provincesList = this.provincesListFiltered;
      } else {
        this.provincesList = this.provincesListFiltered.filter((province) =>
          province.nombre.startsWith(value.toLocaleUpperCase())
        );
        // Filtrar las ciudades basándose en la provincia seleccionada
        if (this.provincesList.length > 0) {
          const selectedProvince = this.provincesList[0];
          this.citiesListDTO = this.citiesListDTOFiltered.filter((city) =>
            city.provincia === selectedProvince.nombre
          );
        } else {
          this.citiesListDTO = [];
        }
      }
    }
  }
  closeModal() {
    this.registerProvinceForm.reset();
    this.editModeProvince = false;
    this.editModeCity=false;
    this.editarClicked = false;
    this.registerCityForm.reset();
    this.showModal = false;
    const cancelButton = document.getElementById('close-button') as HTMLElement;
    if (cancelButton) {
      cancelButton.click();
    }
  }


  createProvince(): void {
    this.editModeProvince = false;
    if (this.registerProvinceForm.valid) {
      const formData = this.registerProvinceForm.value;
      this.province = {
        nombre: formData.nombre,
        pais: formData.pais,
      }
      this.provinciaService.createProvincia(this.province).subscribe(response => {
        ($('#m_modal_4') as any).modal('hide'); 
        this.getAllProvinces();
        
        Swal.fire({
          icon: 'success',
          text: 'Provincia creada'
        });
        this.closeModal();
      })
    }else{
      this.showModal = true;
    }
  }

  createCity(): void {
    this.editModeCity = false;
    if (this.registerCityForm.valid) {
      const formData = this.registerCityForm.value;
      this.city = {
        nombre: formData.nombreCiudad,
        provincia: formData.provinciaNombre,
      }
      this.ciudadService.createCiudadDTO(this.city).subscribe(response => {
        ($('#m_modal_5') as any).modal('hide'); 
        this.getAllCities();
        Swal.fire({
          icon: 'success',
          text: 'Ciudad creada'
        });
        this.closeModal();
      })
    }else{
      this.showModal = true;
    }
  }

  catchProvince(province: Provincia): void {
    this.editModeProvince = true;
    if (province) {
      const provinciaEdit: Provincia = { ...province };

      this.registerProvinceForm.patchValue({
        nombre: provinciaEdit.nombre,
        pais: provinciaEdit.pais
      });
      this.newProvince = province;
    }
  }

  catchCity(city: CiudadDTO): void {
    this.editModeCity = true;
    if (city) {
      const cityEdit: CiudadDTO = { ...city };

      this.registerCityForm.patchValue({
        nombreCiudad: cityEdit.nombre,
        provinciaNombre: cityEdit.provincia
      });
      this.newCity = city;
    }
  }

  UpdateProv(): void {
    const id = this.newProvince.id;
    if (id !== undefined) {
      if (this.registerProvinceForm.valid) { // Verificar si el formulario es válido
        const formData = this.registerProvinceForm.value;
  
        const provinciaEdit: Provincia = {
          id: id,
          nombre: formData.nombre,
          pais: formData.pais
        };
        this.editProvince(id, provinciaEdit);
      } else {
        console.error('Error: El formulario no es válido.'); // Mensaje de error si el formulario no es válido
      }
    } else {
      console.error('Fatal Error: No se proporcionó un ID válido.');
    }
  }
  

  editProvince(id: any, prov: Provincia) {
    this.provinciaService.updateProvincia(id, prov).subscribe(updatedProvince => {
      const index = this.provincesList.findIndex(u => u.id === updatedProvince.id);
      this.getAllProvinces();
      if (index !== -1) {
        this.provincesList[index] = updatedProvince;
      }
      Swal.fire({
        icon: 'success',
        text: 'Provincia actualizada'
      });
      this.closeModal(); // Cerrar el modal solo si la actualización es exitosa
    });
  }

  UpdateCity(): void {
    const id = this.newCity.id;
    if (id !== undefined) {
      if (this.registerCityForm.valid) { // Verificar si el formulario es válido
        const formData = this.registerCityForm.value;
  
        const cityEdit: CiudadDTO = {
          id: id,
          nombre: formData.nombreCiudad,
          provincia: formData.provinciaNombre
        };
  
        this.editCityEndPoint(id, cityEdit);
      } else {
        console.error('Error: El formulario no es válido.'); // Mensaje de error si el formulario no es válido
      }
    } else {
      console.error('Fatal Error: No se proporcionó un ID válido.');
    }
  }
  

  editCityEndPoint(id: any, cityDTO: CiudadDTO) {
    this.ciudadService.updateCityDTO(id, cityDTO).subscribe(updatedCity => {
      const index = this.citiesListDTO.findIndex(u => u.id === updatedCity.id);
      ($('#m_modal_5') as any).modal('hide'); 
      this.getAllCities();
      if (index !== -1) {
        this.citiesListDTO[index] = updatedCity;
      }
      Swal.fire({
        icon: 'success',
        text: 'Ciudad actualizada'
      });
    });
  }

  onEditarClick(): void {
    this.editarClicked = true;
  }

  onRegistrarClick(): void {
    this.editarClicked = false;
  }

}
