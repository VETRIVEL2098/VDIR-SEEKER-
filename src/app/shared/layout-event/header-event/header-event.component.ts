import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header-event',
  templateUrl: './header-event.component.html',
  styleUrls: ['./header-event.component.css']
})
export class HeaderEventComponent {
  constructor( private route:ActivatedRoute ,private router:Router ){
   }
  fun1000(){
    this.router.navigateByUrl('admin/event')
  }
}
