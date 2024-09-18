
import { ReturnStatement } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {LngLat, Map, Marker} from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

interface MarkerAndColor {
  color: string
  marker: Marker
}

interface PlainMarker {
  color: string
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {

  @ViewChild('map') divMap?: ElementRef

  public map?: Map;
  public lngLat: LngLat = new LngLat(-74.5, 40)
  public markers: MarkerAndColor[] = []

  ngAfterViewInit(): void {

    if(!this.divMap) throw 'Elemento html no encontrado'

    this.map = new Map({
      // container: 'map', // container ID
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 13
    });
    this.readFromLocalStorage()
  }

  createMarker(){

    if(!this.map) return
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map?.getCenter()
    this.addMarker(lngLat, color)
  }

  addMarker(lngLat: LngLat, color: string){
    if(!this.map) return
    const marker = new Marker({
      color: color,
      draggable: true
    }).setLngLat(lngLat).addTo(this.map)

    this.markers.push({color, marker})
    this.saveFromLocalStorage()

    marker.on('dragend', () =>{
      this.saveFromLocalStorage()
    })
  }

  deleteMarker(index: number){
    this.markers[index].marker.remove()
    this.markers.splice(index, 1)
  }

  flyTo(marker:Marker){
    this.map?.flyTo({
      zoom:15,
      center: marker.getLngLat()
    })
  }

  saveFromLocalStorage(){
    const plainMarkers: PlainMarker[]= this.markers.map(({color, marker}) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    })
    localStorage.setItem("plainMarkers", JSON.stringify(plainMarkers))
  }

  readFromLocalStorage(){
    const plainMarkersString = localStorage.getItem("plainMarkers") ?? '[]'
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString)

    plainMarkers.forEach( ({color, lngLat}) => {
      const [lng, lat] = lngLat
      const coords = new LngLat(lng, lat)
      this.addMarker(coords, color)
    })
  }

}
