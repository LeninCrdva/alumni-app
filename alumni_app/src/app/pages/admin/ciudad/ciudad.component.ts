import { Component, OnInit } from '@angular/core';
import { Ciudad } from '../../../data/model/ciudad';
import { CiudadService } from '../../../data/service/ciudad.service';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrl: './ciudad.component.css'
})
export class CiudadComponent implements OnInit  {
  
  ngOnInit(): void {
    this.getAllCities();
  }

  constructor(private ciudadService: CiudadService) {

  }

  cities: Ciudad[] = [];
  city: Ciudad = new Ciudad();

  getAllCities(): void {
    this.ciudadService.getCiudades().subscribe(ciudades => {
      this.cities = ciudades;
    })
  }



}
