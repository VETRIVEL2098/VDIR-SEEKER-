import { FieldType,} from '@ngx-formly/core';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnInit,Output,ViewChild } from '@angular/core';
import * as geolib from 'geolib';
// import * as turf from '@turf/turf';
// import { google } from "google-maps";
import { FormControl } from '@angular/forms';
import { LocationService } from 'src/app/service/location-service';
// import { Draggable } from 'leaflet';
declare var google: any;
interface Entry {
  place: google.maps.places.PlaceResult;
  marker: google.maps.Marker;


  ellipse: google.maps.Polygon;

  location:any; // Replace 'any' with the actual type of location if available
}

let colorIndex = 0;
const GOOGLE_MAPS_API_KEY = 'AIzaSyCfFOJKcxzq3BMnJPZBZ52P80r3kKGTOhw';
const place = null as unknown as google.maps.places.PlaceResult;
type Components = typeof place.address_components;

@Component({
  selector: 'location',
  template: `

  <style>p {
    font-family: Lato;
  }

  dl {
    font-size: 13px;
  }

  dl code {
    padding: 0 3px;
    border: 1px solid #ccc;
    white-space: nowrap;
  }

  input[type=text] {
    width: 100%;
    padding: 3px;
  }

  table {
    margin: 10px 0;
    border: 1px solid red;
  }


  .map {
    margin: 10px 0;
    height: 400px;
    width:100%
  }

  .button-container {
    display: flex;
    align-items: center;
  }


  .custom-button{
    background-color: #013688;
    color: white;
    border: none;
    cursor: pointer;
    height: 26px;
    width: 70px;
    margin-left: 10px;
}




  </style>

<div *ngIf="this.mapShowFlag==true" class="button-container">
  <input
    placeholder=''
    autocorrect="off"
    autocapitalize="off"
    spellcheck="off"
    type="text"
    class="form-control"
    id="searchInput"
    [required]="required"
    #search
  />
  <button mat-raised-button (click)="searchLocation()" *ngIf="this.mapShowFlag==true" class="custom-button">Search</button>
</div>


<div class="map"  #map></div>


  `
})

export class LocationComponent   {
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  public geoCoder!:any;
  @ViewChild('map',{static:true})
  public mapElementRef!: ElementRef;
  show:boolean=true
  public entries:Entry[] = [];
  private currentMarker: google.maps.Marker | null = null;
  public place!: google.maps.places.PlaceResult;
  required:any
  Latitude:any
  Longitude:any
location:any={}
@Input('Address') Address:any
@Input('Flag') mapShowFlag:boolean=true
@Input ('Draggable')isDraggable:boolean=true
@Input('Latlog') latlong:any []=[];
@Output('onClick') onClick = new EventEmitter<any>();


  public locationFields = [
    'name',
    'cityName',
    'stateCode',
    'stateName',
    'countryName',
    'countryCode',
  ];

  private map!: google.maps.Map;

  constructor(public locationService: LocationService, private ngZone: NgZone) {
    // locationService.api.then((maps) => {
    //   this.initAutocomplete(maps);
    //   this.initMap(maps);
    // });

  }
  ngOnInit(): void {

    this.locationService.api.then((maps) => {
      this.initAutocomplete(maps);
      this.initMap(maps);
    });
    console.log(this.Address);
    console.log(this.latlong);
    let latlong:any = this.latlong
    // console.log(latlong.Latitude);
    // console.log(latlong.Longitude);

    console.log(this.mapShowFlag);
    console.log(this.isDraggable);

 if(this.isDraggable==false){
      const marker = new google.maps.Marker({
        // position: center,
        animation: google.maps.Animation.DROP,
        map: this.map,

    });
  }
  }



  initAutocomplete(maps: any) {
    // debugger
    this.show=true
    this.required=true
    if(this.mapShowFlag==true){

      let autocomplete = new maps.places.Autocomplete(
        this.searchElementRef?.nativeElement
      );
      console.log(autocomplete)
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.onPlaceChange(autocomplete.getPlace());
        });
      });
    }
    if(this.mapShowFlag==true){
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  searchInput.value = this.Address;
console.log(this.Address);
}





  }


initMap(maps: any) {
    //  this.show=this.field.showsearchbar
  let center:any
  let location=this.Address

  if(this.latlong ==undefined){

this.searchLocation()
    center=new google.maps.LatLng( 11.28137,79.543923);
    console.log(center);


    this.map = new maps.Map(this.mapElementRef.nativeElement, {
      zoom: 7,
      center:center
    });

    const marker = new google.maps.Marker({
      position: center,
      animation: google.maps.Animation.DROP,
      map: this.map,
    //  draggable: true,
    });

    this.map.setCenter(center);
    this.map.setZoom(15);

   // While drag the Marker
   marker.addListener("dragend", () => {
    // patch the  lat and long in control
    let location= marker.getPosition() as google.maps.LatLng

    let coordinates=[
      location.lng(),
      location.lat()
    ]
    this.onClick.emit(coordinates)
    //  this.field.formControl.value.coordinates=coordinates
    // console.log(this.formControl.value)
     });
  }


  if(this.latlong!=null&& this.latlong!=undefined && this.mapShowFlag==true){
    let latlong:any = this.latlong
    console.log(latlong.Latitude);
    console.log(latlong.Longitude);
     let url=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlong.Longitude},${latlong.Latitude}&key=${GOOGLE_MAPS_API_KEY}`


    center=new google.maps.LatLng( latlong.Longitude,latlong.Latitude);
    console.log(center);


  this.map = new maps.Map(this.mapElementRef.nativeElement, {
    zoom: 7,
    center:center
  });

  const marker = new google.maps.Marker({
    position: center,
    animation: google.maps.Animation.DROP,
    map: this.map,
   draggable: true,
  });

  this.map.setCenter(center);
  this.map.setZoom(15);

 // While drag the Marker
 marker.addListener("dragend", () => {
  // patch the  lat and long in control
  let location= marker.getPosition() as google.maps.LatLng

  let coordinates=[
    location.lng(),
    location.lat()
  ]
  this.onClick.emit(coordinates)
  //  this.field.formControl.value.coordinates=coordinates
  // console.log(this.formControl.value)
   });
}

  if(this.latlong!=null&& this.latlong!=undefined&& this.mapShowFlag==false){
    let latlong:any = this.latlong
    console.log(latlong.Latitude);
    console.log(latlong.Longitude);
     let url=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlong.Longitude},${latlong.Latitude}&key=${GOOGLE_MAPS_API_KEY}`


    center=new google.maps.LatLng( latlong.Longitude,latlong.Latitude);
    console.log(center);


  this.map = new maps.Map(this.mapElementRef.nativeElement, {
    zoom: 7,
    center:center
  });

  const marker = new google.maps.Marker({
    position: center,
    animation: google.maps.Animation.DROP,
    map: this.map,
  //  draggable: true,
  });

  this.map.setCenter(center);
  this.map.setZoom(15);

 // While drag the Marker
 marker.addListener("dragend", () => {
  // patch the  lat and long in control
  let location= marker.getPosition() as google.maps.LatLng

  let coordinates=[
    location.lng(),
    location.lat()
  ]
  this.onClick.emit(coordinates)
  //  this.field.formControl.value.coordinates=coordinates
  // console.log(this.formControl.value)
   });
}
}



  searchLocation() {
    const searchInput = this.searchElementRef.nativeElement;
    console.log(searchInput.value);

    const searchQuery = searchInput.value;



    if (searchQuery) {
      const autocomplete = new google.maps.places.AutocompleteService();
      autocomplete.getPlacePredictions(
        {
          input: searchQuery,
        },
        (predictions:any, status:any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (predictions && predictions.length > 0) {
              const firstPrediction = predictions[0];
              if (firstPrediction.place_id) {
                const placesService = new google.maps.places.PlacesService(this.map);
                placesService.getDetails(
                  {
                    placeId: firstPrediction.place_id,
                  },
                  (place:any, status:any) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                      this.onPlaceChange(place);
                      this.map.setCenter(place.geometry!.location!);
                      this.map.setZoom(15);
                    }
                  }
                );
              }
            }
          }
        }
      );
    }

  }

  onPlaceChange(place: google.maps.places.PlaceResult) {

    this.map.setCenter(place.geometry!.location!);
        console.log(place.geometry!.location)

    const marker = new google.maps.Marker({
      position: place.geometry!.location,
      animation: google.maps.Animation.DROP,
      map: this.map,
     draggable: true,
    });



// While drag the Marker
   marker.addListener("dragend", () => {
   // patch the  lat and long in control
   let location= marker.getPosition() as google.maps.LatLng
   let coordinates=[
    location.lng(),
    location.lat()
  ]
  this.onClick.emit(coordinates)

    });





    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }
    this.currentMarker = marker;
    const rectangle = new google.maps.Rectangle({
      strokeOpacity: 0.8,
      strokeWeight: 2,
      strokeColor: 'transparent',
      fillOpacity: 0,
      map: this.map,
      bounds: place.geometry!.viewport,
    });

    const expandedRectangle = new google.maps.Rectangle({

      strokeOpacity: 0.8,
      strokeWeight: 0.5,
      strokeColor: 'transparent',
      fillOpacity: 0,
      map: this.map,
      bounds: expandBounds(place.geometry!.viewport!.toJSON(), 5000),
      
    });

    const location = this.locationFromPlace(place);

    const ellipse = new google.maps.Polygon({
      paths: toEllipse(location!.bounds).map(
        ({ latitude, longitude }) => new google.maps.LatLng(latitude, longitude)
      ),

      strokeOpacity: 1,
      strokeWeight: 1,
      strokeColor: 'transparent',
      fillOpacity: 0,

    });
    ellipse.setMap(this.map);

    this.entries.unshift({
      place,
      marker,
      ellipse,
      location,
    });



     // Set latitude and longitude in the form control
  if (this.currentMarker) {
    let location= marker.getPosition() as any
    const latitude = location.lat();
    const longitude =location.lng();
    console.log(latitude,longitude)
    const area_name=this.entries[0].location.name
    const city=this.entries[0].location.cityName
    const state=this.entries[0].location.stateName
    const country=this.entries[0].location.countryName
  //  const zipcode=this.entries[0].location.poastalCode
  // let val :any={}
  // val['address']=address


    let coordinates=[
      longitude,
     latitude,
    ]
    this.onClick.emit(coordinates)


  }
   // Update the input field value with the formatted address
   const formattedAddress = place.formatted_address;
   this.searchElementRef.nativeElement.value = formattedAddress;
  }







  public locationFromPlace(place: google.maps.places.PlaceResult) {
    debugger
    const components = place.address_components;
    if (components === undefined) {
      return null;
    }

    const areaLevel3 = getShort(components, 'administrative_area_level_3');
    const locality = getLong(components, 'locality');

    const cityName = locality || areaLevel3;
    const countryName = getLong(components, 'country');
    const countryCode = getShort(components, 'country');
    const stateCode = getShort(components, 'administrative_area_level_1');
    const stateName = getLong(components, 'administrative_area_level_1');
    const poastalCode = getLong(components, 'postal_code');
    const name = place.name !== cityName ? place.name : null;

    const coordinates = {
      latitude: place.geometry!.location!.lat(),
      longitude: place.geometry!.location!.lng(),
    };

    const bounds = place.geometry!.viewport!.toJSON();

    // placeId is in place.place_id, if needed
    return {
      name,
      cityName,
      poastalCode,
      countryName,
      countryCode,
      stateCode,
      stateName,
      bounds,
      coordinates,
    };
  }
}

function getComponent(components: Components, name: string) {
  return components!.filter((component:any) => component.types[0] === name)[0];
}

function getLong(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.long_name;
}

function getShort(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.short_name;
}

function toEllipse({ north, south, east, west }: cosmos.LatLngBoundsLiteral) {
  const latitude = (north + south) / 2;
  const longitude = (east + west) / 2;
  const r1 =
    geolib.getDistance(
      { latitude: north, longitude },
      { latitude: south, longitude }
    ) / 2;
  const r2 =
    geolib.getDistance(
      { latitude, longitude: west },
      { latitude, longitude: east }
    ) / 2;

  const center = { latitude, longitude };
  const latitudeConv =
    geolib.getDistance(center, { latitude: latitude + 0.1, longitude }) * 10;
  const longitudeCong =
    geolib.getDistance(center, { latitude, longitude: longitude + 0.1 }) * 10;

  const points: cosmos.Coordinates[] = [];
  const FULL = Math.PI * 2;
  for (let i = 0; i <= FULL + 0.0001; i += FULL / 8) {
    points.push({
      latitude: latitude + (r1 * Math.cos(i)) / latitudeConv,
      longitude: longitude + (r2 * Math.sin(i)) / longitudeCong,
    });
  }
  return points;
}

function expandBounds(bounds: cosmos.LatLngBoundsLiteral, meters: number) {
  const SQRT_2 = 1.4142135623730951;
  const { longitude: west, latitude: north } = geolib.computeDestinationPoint(
    {
      latitude: bounds.north,
      longitude: bounds.west,
    },
    SQRT_2 * meters,
    315
  );
  const { longitude: east, latitude: south } = geolib.computeDestinationPoint(
    {
      latitude: bounds.south,
      longitude: bounds.east,
    },
    SQRT_2 * meters,
    135
  );
  return { west, north, east, south };
}

namespace cosmos {
  export interface Coordinates {
    /**
     * Coordinates latitude.
     * @type {number}
     */
    latitude: number;
    /**
     * Coordinates longitude.
     * @type {number}
     */
    longitude: number;
  }
  export interface LatLngBoundsLiteral {
    /**
     * LatLngBoundsLiteral east.
     * @type {number}
     */
    east: number;
    /**
     * LatLngBoundsLiteral north.
     * @type {number}
     */
    north: number;
    /**
     * LatLngBoundsLiteral south.
     * @type {number}
     */
    south: number;
    /**
     * LatLngBoundsLiteral west.
     * @type {number}
     */
    west: number;
  }
}
