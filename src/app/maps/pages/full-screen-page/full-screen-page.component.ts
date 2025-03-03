import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {Map} from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"


@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css'
})
export class FullScreenPageComponent implements AfterViewInit{

@ViewChild('map') divMap?: ElementRef

ngAfterViewInit(): void {

  if(!this.divMap) throw 'Elemento html no encontrado'

  const map = new Map({
    // container: 'map', // container ID
    container: this.divMap?.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
  });
}



}
