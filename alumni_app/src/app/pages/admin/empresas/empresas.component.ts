import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { EmpresaService } from '../../../data/service/empresa.service';
import { Empresa } from '../../../data/model/empresa';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  ngOnInit(): void {
    this.getAllCompanies();
  }

  constructor(private companyService: EmpresaService, private sanitizer: DomSanitizer) {
    this.companyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.company.urlPdfRuc ?? '');
  }

  companyList: Empresa[] = [];
  filterCompanyList: Empresa[] = [];
  company: Empresa = new Empresa();
  companyUrl: SafeResourceUrl;

  getAllCompanies(): void {
    this.companyService.getEmpresas().subscribe(data => {
      this.companyList = data;
      this.filterCompanyList = data;
    });
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.addEventListener('input', () => {
      const filterText = this.searchInput.nativeElement.value.trim().toLowerCase();
      if (filterText !== '') {
        this.filterCompanyList = this.companyList.filter(company => {
          const companyString = JSON.stringify(company).toLowerCase();
          return companyString.includes(filterText);
        });
      } else {
        this.filterCompanyList = this.companyList;
      }
    });
  }

  showCompanyDetails(id: any): void {
    this.companyService.getCompanyById(id).subscribe(data => {
      this.company = data;
      this.companyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.company.urlPdfRuc ?? '');
    });
  }

  updateStateCompany(id: any, company: Empresa): void {
    this.companyService.updateEmpresa(id, company).subscribe(updateStateCompany => {
      const index = this.companyList.findIndex(u => u.id === updateStateCompany.id);
      this.getAllCompanies();
      if (index !== -1) {
        this.companyList[index] = updateStateCompany;
      }
    });
  }

  toggleSwitch(companyState: Empresa): void {
    companyState.estado = !companyState.estado;
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea ${companyState.estado ? 'activar' : 'desactivar'} la empresa ${companyState.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${companyState.estado ? 'activar' : 'desactivar'}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStateCompany(companyState.id, companyState);
      } else {
        companyState.estado = !companyState.estado;
      }
    })
  }

}
