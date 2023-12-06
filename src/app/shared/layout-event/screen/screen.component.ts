import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiService } from 'src/app/service/search.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent {
  data: any;
  details: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    height: '130px',
    spellcheck: true,
    translate: 'yes',
    fonts: [
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' }
    ],
    toolbarHiddenButtons: [
      ['customClasses', 'insertImage', 'insertVideo', 'removeFormat', 'underline', 'heading', 'insertHorizontalRule', 'link', 'insertOrderedList',
        'toggleEditorMode', 'bold', 'italic', 'strikeThrough', 'backgroundColor', 'textColor', 'textColor', 'unlink', 'fontSize']
    ]
  };
   id:any
  constructor(private auth: ApiService,private route:ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.route.params.subscribe((params) => {
     console.log(params["id"]);
     this.id=params["id"]
     this.auth.getbyid('event', params["id"]).subscribe((xyz: any) => {
      console.log(xyz);
      this.data = xyz;
      
    });  
    });   
     
  }
  // fun1001(){
  //   this.router.navigateByUrl('auth/register')
  // }
  routeFunction(){
    this.router.navigateByUrl(`dashboard/event-list/${this.id}`)
  }
}
