// import { editorConfig } from './../../constant/editorConfig';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
// import { HelperService } from '../../service/helper.service'
//import { Agenda } from 'app/model/agenda'
// import { AuthService } from '../../service/auth.service';
// import { AngularFirestore } from '@angular/fire/firestore';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'agenda-add',
  templateUrl: './agenda-add.component.html',
  styleUrls: ['./agenda-add.component.scss']
})
export class AgendaAddComponent implements OnInit {
  frmAgenda: FormGroup | any;
  isFormSubmitted: boolean=false
  selectedAgenda = ''
  pageTitle: string = "Add/Edit Agenda";
  agendaId:any
  // ckConfig = ckEditorConfig
  // public Editor = ClassicEditor;
  // editorConfig :any= editorConfig
  today = new Date()
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    // private afs: AngularFirestore,
    private route: ActivatedRoute,
    // private helper: HelperService,
    // private authSevice: AuthService
  ) {
  }
  ngOnInit() {
    this.route.params.subscribe(params =>{
      this.agendaId = params['agendaId']
     
    })
    this.createControls()
  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    height:"130px",
    spellcheck: true,
    translate: 'yes',
     fonts: [
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'}
    ],
    toolbarHiddenButtons :[
            [
              'customClasses',
              'insertImage',
              'insertVideo',
              'removeFormat','underline','heading','insertHorizontalRule','link',    'insertOrderedList',
              'toggleEditorMode','bold', 'italic','strikeThrough','backgroundColor','textColor','textColor','unlink','fontSize'
            ]
          ]

        }
  /**
   * Create From Controls with default value
   */
  createControls() {
    this.frmAgenda = this.formBuilder.group({
      // name: this.helper.createTextControl('Session Name', '', true),
      // desc: this.helper.createTextControl('Short Description', '', true),
      // sessionStartDate: this.helper.createDateControl('Session Start Date','',true,new Date()),
      // sessionEndDate: this.helper.createDateControl('Session End Date', '', true, new Date()),
      // link: this.helper.createTextControl('Session Link', '', true),
      // youtube: this.helper.createTextControl('Youtube Link', '', false),
      // fullDesc: this.helper.createTextControl('Full Description', '', true)
    });
  }



  
  /**
   * cancel submission
   */
  goAgendaListPage() {
    this.router.navigate(['superadmin/agenda']);
  }
}