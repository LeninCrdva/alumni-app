import { Component } from '@angular/core';
import { Graduado1 } from '../../../data/model/graduado';
import { GraduadoService } from '../../../data/service/graduado.service';
import { Usuario } from '../../../data/model/usuario';
import { Ciudad } from '../../../data/model/ciudad';
import { UserService } from '../../../data/service/UserService';
import { CarreraService } from '../../../data/service/carrera.service';
import { Observable } from 'rxjs';
import { FiltersService } from '../../../data/Filters.service';
import { CiudadService } from '../../../data/service/ciudad.service';
import { CiudadDTO } from '../../../data/model/DTO/ciudadDTO';
import { ProvinciaService } from '../../../data/service/provincia.service';


@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['comunidad.component.css']
})
export class ComunidadComponent {
  selectedGraduado: any;

  public careerNames!: Observable<string[]>;
  public urlImage: string = '';
  public rutaimagen: string = '';
  public graduadoid: number = 0;
  public idstring: string = '';
  public nombres: string = '';
  public apellidos: string = '';
  edad: number = 0;
  fechaNacimiento: string = "";

  filteredGraduadosList: Graduado1[] = [];
  suggestions: Graduado1[] = [];
  searchTerm: string = '';
  resultadoNumber: number = 0;
  anyResult: boolean = false;

  careerNameList: any[] = [];
  careerNameLists: { [idGraduado: number]: string[] } = {};

  graduado: Graduado1 = { id: 0, usuario: new Usuario(), ciudad: new Ciudad(), anioGraduacion: new Date(), emailPersonal: '', estadoCivil: '', rutaPdf: '', urlPdf: '' };

  graduadosList: Graduado1[] = [];

  dropdownSettings: any = {};

  filterStates: { [key: string]: boolean } = {
    'fechasGrado': false,
    'carreras': false,
    'ciudades': false,
    'provincias': false,
    'paises': false
  };

  public isTable: boolean = false;
  public filtersVisible: boolean = false;
  filtroFechaGraduacion: Date | null = null;

  constructor(
    private graduadoService: GraduadoService,
    public filterService: FiltersService,
    private carreraService: CarreraService,
    private ciudadService: CiudadService,
    private provinciaService: ProvinciaService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.getCareerNames3();
    this.getAllCities();
    this.getAllProvinces();
  }

  getAllCities(): void {
    this.ciudadService.getCiudadesDTO().subscribe(ciudades => {
      const nombresCiudades = ciudades.map(ciudad => ciudad.nombre);

      this.filterService.initializeDropdowns('citiesList', nombresCiudades, true);
      this.filterService.selectedItems['citiesList'] = [];
    });
  }

  getAllProvinces(): void {
    this.provinciaService.getProvincias().subscribe(provincias => {
      const nombresProvincias = provincias.map(provincia => provincia.nombre);
      const nombresPaises = new Set(provincias.map(provincia => provincia.pais));

      this.filterService.initializeDropdowns('provincesList', nombresProvincias, true);
      this.filterService.initializeDropdowns('countriesList', Array.from(nombresPaises), true);


      this.filterService.selectedItems['provincesList'] = [];
      this.filterService.selectedItems['countriesList'] = [];
    });
  }

  loadData() {
    const userId = localStorage.getItem('user_id');
    this.graduadoService.getGraduadosNotIn(userId ? parseInt(userId) : 0).subscribe(
      (result) => {
        this.graduadosList = result;
        this.filteredGraduadosList = result;

        this.incrementarResultado(result.length);

        this.graduadosList.forEach((graduado) => {
          this.getCareerName(graduado.id);
        });
      },
    );
  }

  incrementarResultado(valorFinal: number) {
    const interval = setInterval(() => {
      if (this.resultadoNumber < valorFinal) {
        this.resultadoNumber += 2;
      } else {
        clearInterval(interval);
      }
    }, 60);
  }

  openFilters(): void {
    this.filtersVisible = !this.filtersVisible;
    const filtersToggle = document.querySelector('.filters-toggle');

    if (filtersToggle) {
      filtersToggle.classList.toggle('is-open');
      filtersToggle.classList.remove('active');
      this.deleteFilters();
      this.searchTerm = "";
      this.updateFilteredGraduadosList();
    }
  }

  openSelectedFilters(): void {
    const filtersToggle = document.querySelector('.ui-dropdown__content');

    if (filtersToggle) {
      filtersToggle.classList.toggle('active');
    }
  }

  toggleModeView(state: boolean): void {
    this.isTable = state;
  }

  onSearchInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.searchTerm = inputValue;
    this.updateFilteredGraduadosList();
    this.updateSuggestions();
  }

  updateSuggestions(): void {
    if (this.searchTerm.trim() !== '') {
      this.suggestions = this.filteredGraduadosList.slice(0, 3);
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: Graduado1): void {
    // Asigna la sugerencia seleccionada al término de búsqueda
    this.searchTerm = `${suggestion.usuario.persona.primerNombre} ${suggestion.usuario.persona.apellidoPaterno}`;

    // Filtra la lista de graduados según la sugerencia seleccionada
    this.filteredGraduadosList = this.graduadosList.filter(graduado =>
      graduado.id === suggestion.id
    );

    // Actualiza el número de resultados
    this.resultadoNumber = this.filteredGraduadosList.length;

    // Limpia las sugerencias
    this.suggestions = [];
  }


  filterClick(value: string): void {
    // Reinicia todos los filtros a false
    for (const key in this.filterStates) {
      this.filterStates[key] = false;
    }

    // Establece el filtro seleccionado en true
    this.filterStates[value] = true;

    this.closeToggle();
  }

  updateFilteredGraduadosList(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredGraduadosList = this.graduadosList.filter(graduado => {
        const graduadoPlano = this.mapGraduadoToSearchableObject(graduado);
        return Object.values(graduadoPlano).some(value =>
          (typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      });

    } else {
      this.filteredGraduadosList = this.graduadosList;
    }
    this.resultadoNumber = this.filteredGraduadosList.length;
  }

  clearSearchTerm(): void {
    this.searchTerm = '';
    this.updateFilteredGraduadosList();
    this.suggestions = [];

    this.resultadoNumber = this.graduadosList.length;
  }

  buscarBtn(): void {
    this.suggestions = [];
  }

  private mapGraduadoToSearchableObject(graduado: Graduado1): any {
    const careerNames = this.careerNameLists[graduado.id!] || [];
    return {
      id: graduado.id,
      nombreUsuario: graduado.usuario.nombreUsuario,
      primerNombre: graduado.usuario.persona.primerNombre,
      segundoNombre: graduado.usuario.persona.segundoNombre,
      apellidoPaterno: graduado.usuario.persona.apellidoPaterno,
      apellidoMaterno: graduado.usuario.persona.apellidoMaterno,
      cedula: graduado.usuario.persona.cedula,
      telefono: graduado.usuario.persona.telefono,
      emailPersonal: graduado.emailPersonal,
      anioGraduacion: graduado.anioGraduacion,
      estadoCivil: graduado.estadoCivil,
      ciudad: graduado.ciudad.nombre,
      provincia: graduado.ciudad.provincia.nombre,
      pais: graduado.ciudad.provincia.pais,
      carreras: careerNames.join(', ')
    };
  }

  startDate: Date | null = null;

  applyFilters(): void {
    this.closeToggle();

    if (this.filterStates['fechasGrado']) {
      this.filteredGraduadosList = this.graduadosList.filter(graduado => {
        // Verificamos si la fecha de graduación está dentro del rango seleccionado
        const graduationDate = new Date(graduado.anioGraduacion).getTime();
        const startDate = this.startDate ? new Date(this.startDate).getTime() : null;
        const endDate = startDate ? new Date(startDate).setMonth(new Date(startDate).getMonth() + 1) : null;
        const result = (startDate === null || graduationDate >= startDate) &&
          (endDate === null || graduationDate < endDate);

        return result;
      });
    } else if (this.filterStates['carreras']) {
      this.filtrarDatoComun(this.filterService.selectedItems['careersList'].map(item => item.item_text).toString());
    } else if (this.filterStates['ciudades']) {
      this.filtrarDatoComun(this.filterService.selectedItems['citiesList'].map(item => item.item_text).toString());
    } else if (this.filterStates['provincias']) {
      this.filtrarDatoComun(this.filterService.selectedItems['provincesList'].map(item => item.item_text).toString());
    } else if (this.filterStates['paises']) {
      this.filtrarDatoComun(this.filterService.selectedItems['countriesList'].map(item => item.item_text).toString());
    }

    this.resultadoNumber = this.filteredGraduadosList.length;
    this.anyResult = this.filteredGraduadosList.length === 0;
  }

  filtrarDatoComun(valueData: string): void {
    this.filteredGraduadosList = this.graduadosList.filter(graduado => {
      const graduadoPlano = this.mapGraduadoToSearchableObject(graduado);
      return Object.values(graduadoPlano).some(value =>
        (typeof value === 'string' && value.toLowerCase().includes(valueData.toLowerCase()))
      );
    });
  }

  deleteFilters(): void {
    this.closeToggle();
    this.startDate = null;
    this.anyResult = false;

    this.filterService.selectedItems['careersList'] = [];

    this.filterService.selectedItems['citiesList'] = [];
    this.filterService.selectedItems['provincesList'] = [];
    this.filterService.selectedItems['countriesList'] = [];

    this.filterClick('none');

    this.filteredGraduadosList = [...this.graduadosList];

    // Actualizar el contador de resultados
    this.resultadoNumber = this.filteredGraduadosList.length;
  }


  closeToggle(): void {
    const filtersToggle = document.querySelector('.ui-dropdown__content');

    if (filtersToggle) {
      if (filtersToggle.classList.contains('active')) {
        filtersToggle.classList.toggle('active');
      }
    }
  }

  getCareerNames3(): void {
    this.careerNames = this.carreraService.getCarrerasNombres();

    this.careerNames.subscribe(names => {
      this.filterService.dropdownLists['careersList'] = names;

      this.filterService.initializeDropdowns('careersList', this.filterService.dropdownLists['careersList'], true);


      this.filterService.selectedItems['careersList'] = [];
    });
  }

  getCareerName(idGraduado: any): void {
    this.graduadoService.getCareerListByGraduateId(idGraduado).subscribe(
      (careerNames: string[]) => {
        this.careerNameLists[idGraduado] = careerNames;
      }
    );
  }

  getCareerNames(idGraduado: any): string[] {
    const careers = this.careerNameList.filter(career => career[0] === idGraduado);
    console.log(idGraduado)
    console.log(careers);
    return careers.map(career => career[1]);
  }

  loadUserDataByUsername() {
    const storedRutaImagen = localStorage.getItem('rutaImagen');
    const storedUrlImagen = localStorage.getItem('urlImagen');
    if (storedRutaImagen && storedUrlImagen) {
      this.rutaimagen = storedRutaImagen;
      this.urlImage = storedUrlImagen;
    } else {
      console.error('La información de imagen no está disponible en localStorage.');
    }
  }

  showGraduadoDetails(graduado: Graduado1) {
    this.selectedGraduado = graduado;
    this.fechaNacimiento = this.selectedGraduado.usuario.persona.fechaNacimiento;
    this.calcularEdad();
  }

  calcularEdad() {
    const fechaNacimientoObj = new Date(this.fechaNacimiento);
    const fechaActual = new Date();
    const diferenciaEnMilisegundos = fechaActual.getTime() - fechaNacimientoObj.getTime();
    const aniosTranscurridos = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25);
    this.edad = Math.floor(aniosTranscurridos);
  }

  contactarPorWhatsapp(numeroTelefono: string): void {
    const numeroCorregido = numeroTelefono.substring(1);
    const numeroConCodigoPais = `593${numeroCorregido}`;
    const mensaje = "Hola, estoy interesado en contactarte.";
    const enlaceWhatsapp = `https://wa.me/${numeroConCodigoPais}?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsapp, "_blank");
  }
}