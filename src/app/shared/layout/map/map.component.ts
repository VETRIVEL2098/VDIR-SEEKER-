import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as L from 'leaflet';

@Component({
 selector: 'Map',
 template: `
<style>
 /* .map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 30px;
 } */

 .map-frame {
  border: 1px solid black;
  height: 100%;
  width: 100%;
 }
.map-container{

  margin-top: 7%;
  margin-bottom: 1%;
}
 #map {
  height: 100vh;
  width: 100%;
 }
 .marker {
  display: flex;
  align-items: center;

}

.marker i {
  font-size: 20px; /* Adjust the icon size as needed */
  margin-right: 10px;
  margin-bottom: 1%;
}
</style>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
   integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
   crossorigin=""/>
<div class="map-container">

  <div class="row justify-content-center">
    <!-- <div class="col-md-6">
      <div class="input-group mb-3">
        <input type="text" class="form-control" formControlName="Address"  id="searchInput" placeholder="Search for a place">
        <button class="btn btn-dark" id="searchButton">
  <i class="fas fa-search"></i>
</button> </div>

  </div> -->
  <div *ngIf="this.Flag">
  <div class="marker" >
  <i class="fas fa-map-marker-alt me-4"></i>
  <p>:- this <strong>marker</strong> is draggable.. </p><br/>
  </div>
  <p><strong class="me-2">Note</strong>:- If your marker is in wrong place you can change that through dragging the marker.. </p>
  </div>


  <div class="map-frame">
   <div id="map"></div>
  </div>
 </div>

 <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
   integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
   crossorigin=""></script>
`,
})

export class MapComponent {
  private map: any;
  private marker: any;
@Input('Address') Address:any
@Input('Flag') Flag:boolean=true
@Input('Latlog') latlong:any []=[];
@Output('onClick') onClick = new EventEmitter<any>();


  private initMap(): void {
    this.map = L.map('map', {

      center: [13.113720622720065, 80.28026474259269],
      zoom: 18
    });

//     const searchInput = document.getElementById('searchInput') as HTMLInputElement;
//     searchInput.value = this.Address;
// console.log(this.Address);


    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.map.on('click', (e: any) => {
      if (this.marker && this.marker.isDragging()) {
        return; // If marker is being dragged, don't do anything on map click
      }

    });

  }
   customIcon = L.icon({
    iconUrl: 'assets/image/marker3.png',
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  ngAfterViewInit(): void {
    this.initMap();
    console.log(this.latlong)
console.log(this.Address)

    let arr:any  =this.latlong
    if(arr!=undefined){
      // console.log(arr);
      console.log(this.Address);
      this.fetchAndSetAddress(arr)
      this.map.setView([arr.Latitude, arr.Longitude], 10); // Set the zoom level according to your preference
      this.marker = L.marker([arr.Latitude,arr.Longitude], { draggable: this.Flag, icon: this.customIcon }).addTo(this.map);
      this.marker.bindPopup(`  Company's Address: ${this.Address}`).openPopup();

    }else{
      this.my(this.Address)
      console.log(this.Address);

      this.map.setView([13.113720622720065, 80.28026474259269], 10); // Set the zoom level according to your preference
      this.marker = L.marker([ 13.113720622720065, 80.28026474259269 ], { draggable: this.Flag, icon: this.customIcon }).addTo(this.map);
      this.marker.bindPopup(`  Address: ${this.Address}`).openPopup();
    }
    if(this.Flag){
      this.map.on('dblclick', (e: any) => {
        const newLatLng = e.latlng;
        this.marker.setLatLng(newLatLng);

        // Fetch address and update the search input
        this.fetchAndSetAddress(newLatLng);
        console.log(newLatLng);

      });
      this.marker.on('dragend', async (e: any) => {
        const newLatLng = e.target.getLatLng();


        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLatLng.lat}&lon=${newLatLng.lng}`);
        const data = await response.json();

        if (data.display_name) {
          const address = data.display_name;
          this.marker.bindPopup(`  Address: ${address}`).openPopup();//Latitude: ${newLatLng.lat}<brLongitude: ${newLatLng.lng}<br>Latitude: ${newLatLng.lat}<br>Longitude: ${newLatLng.lng}<br>
          let val :any={}
          // val['address']=address
          val['Latitude']=newLatLng.lat
          val['Longitude']=newLatLng.lng
          this.onClick.emit(val)

          // Update the search bar with the location name
          // const searchInput = document.getElementById('searchInput') as HTMLInputElement;
          // searchInput.value = address;
        } else {
          this.marker.bindPopup('Address: Not available').openPopup();
        }
      });
    }



    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    searchButton?.addEventListener('click', async () => {
      const searchTerm = this.Address;
      console.log(searchTerm);

      if (searchTerm) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`);
          const searchData = await response.json();
          console.log(searchData);


          if (searchData.length > 0) {
            const searchResult = searchData[0];
            const searchLatLng = [parseFloat(searchResult.lat), parseFloat(searchResult.lon)];
            const newLatLng = searchLatLng;
            console.log(searchResult );

            const address = searchResult.display_name;
            console.log(address);

            this.marker.bindPopup(`Address: ${address}`).openPopup();//Latitude: ${searchResult.lat}<br>Longitude: ${searchResult.lon}<br>

            // Update the search bar with the location name
            const searchInput = document.getElementById('searchInput') as HTMLInputElement;
            searchInput.value = address;
            // this.fetchAndSetAddress(newLatLng);

            this.marker.setLatLng(searchLatLng);
            this.map.setView(searchLatLng, 10);
          } else {
            console.log('No results found for the search term.');
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    });

  // Double-click event to move the marker to the double-clicked location

}

private async fetchAndSetAddress(latLng: any) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.Latitude}&lon=${latLng.Longitude}`);
  const data = await response.json();

if(this.Address!=undefined&&this.Address!=null){
  const address = this.Address
  this.marker.bindPopup(`Company's Address: ${address}`).openPopup();


}else{
  if (data.display_name) {
    const address = data.display_name
    this.marker.bindPopup(`Company's Address: ${address}`).openPopup();

    // Update the search bar with the location name
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    searchInput.value = address;
  } else {
    this.marker.bindPopup('You are Here').openPopup();
  }
}

}

async my(address:any){
  const searchTerm = address;
  if (searchTerm) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`);
      const searchData = await response.json();

      if (searchData.length > 0) {
        const searchResult = searchData[0];
        const searchLatLng = [parseFloat(searchResult.lat), parseFloat(searchResult.lon)];
        const newLatLng = searchLatLng;
        console.log(searchResult );

        const address = searchResult.display_name;
        console.log(address);

        this.marker.bindPopup(`Address: ${address}`).openPopup();//Latitude: ${searchResult.lat}<br>Longitude: ${searchResult.lon}<br>

        // Update the search bar with the location name
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        searchInput.value = address;
        // this.fetchAndSetAddress(newLatLng);

        this.marker.setLatLng(searchLatLng);
        this.map.setView(searchLatLng, 10);
      } else {
        console.log('No results found for the search term.');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }
}


  }

//   var circle = L.circle( [ 13.042304, 80.24865 ], {
//    color: 'red',
//    fillColor: '#f03',
//    fillOpacity: 0.5,
//    radius: 500000
//  }).addTo(this.map); below .openOn(this.map)
