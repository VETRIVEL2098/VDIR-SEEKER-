import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormArray,
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/service/search.service';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-createcv',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './createcv.component.html',
  styleUrls: ['./createcv.component.css'],
})
export class CreatecvComponent implements OnInit {
  email: string = '';
  formData: any = {};
  responseemail: any;
  [x: string]: any;
  rows: any[] = [];
  fullname1: string = '';
  email1: any;
  phonenumber1: any;
  title1: any;
  address1: any;
  summary1: any;
  university1: any;
  degree1: any;
  graduation1: any;
  gpa1: any;
  certificate1: any;
  authority1: any;
  date1: any;
  company1: any;
  position1: any;
  startdate1: any;
  enddate1: any;
  response1: any;
  skill11: any;
  skill1lvl1: any;
  project1: any;
  role1: any;
  dration1: any;
  description11: any;
  activity1: any;
  description21: any;
  university: any;
  graduationdate: any;
  degree: any;
  gpa: any;
  personalinfo = false;
  summary = true;
  education = true;
  professionalexp = true;
  skills = true;
  projectexp = true;
  extracurricular = true;
  certificate = true;
  tablerows: any[] = [];
  certificaterows: any[] = [];
  universities: string[] = [];
  degrees: string[] = [];
  graduationdates: Date[] = [];
  gpas: number[] = [];
  certificatename: string[] = [];
  authority: string[] = [];
  dateearned: Date[] = [];
  description: string[] = [];
  company: string[] = [];
  position: string[] = [];
  startdate: Date[] = [];
  enddate: Date[] = [];
  responsibilities: string[] = [];
  skillname: string[] = [];
  skilllevel: string[] = [];
  projectname: string[] = [];
  role: string[] = [];
  duration: any[] = [];
  description1: any[] = [];
  activity: string[] = [];
  description2: string[] = [];
  obj4: any = {};
  whole4: any[] = [];
  obj5: any = {};
  whole5: any[] = [];
  allvalues: any = {};
  obj2: any = {};
  whole2: any[] = [];
  obj3: any = {};
  whole3: any[] = [];
  obj1: any = {};
  whole1: any[] = [];
  obj: any = {};
  whole: any[] = [];
  educationdetails: any[] = [];
  extra = {};
  projectrows:any[] = [];
  skillrows: any[] = [];
  skillrows1: any[] = [];
  workexperience: any[] = [];
sidebar:any;
details:any
personalForm: FormGroup;
summaryForm: FormGroup;
educationForm: FormGroup;

  hobbiesArray = new FormArray([new FormControl('', Validators.required)]);
   constructor(private http: HttpClient, private auth: ApiService,private fb: FormBuilder) {
    if (this.auth.islogin()) {
      this.email = this.auth.decodeToken().email;

    let details =this.auth.getdetails();
    this.details=details;
    let fname=details.firstName+ ' ' +details.lastName
    this.fullname1=fname
    this.phonenumber1=details.phone
    this.email1=details.email
    }
    this.personalForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern('.*\\S.*')]],
      title: ['', [Validators.required, Validators.pattern('.*\\S.*')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required,Validators.pattern(/^[6-9][0-9]{9}$/)]],
      address: ['', [Validators.required, Validators.pattern('.*\\S.*')]]
    });
  this.summaryForm = this.fb.group({
    summary:['', Validators.pattern('.*\\S.*')]
  })
  this.educationForm = new FormGroup({
    university: new FormControl('', [Validators.required, this.noSpaceValidator()]),
  })
  }

Data:any
overallValue:any
  ngOnInit() {
    this.auth.GetALL('education').subscribe((res: any) => {
      let value:any []=res
      let data:any[] =value.filter((val:any)=>{ return val.details === true })
      this.Data = data
    })
    if (this.auth.islogin()) {
      // this.auth.getUserResume(this.Email)
      let ID =this.auth.getdetails()._id
      console.log('====================================');
      console.log(ID);
      console.log('====================================');
      this.auth.GetByID('user_resume','_id',ID)
        .subscribe({  next: (data1: any) => {
            console.log(data1);
        if(data1!=null){
          this.overallValue=data1[0]
          let data=data1[0]

          this.populateFormFields(data);
          this.responseemail = data.email;
          this.getUserValues();
          this.getUserValues1();
          this.getUserValues2();
          this.getUserValues3();
          this.getUserValues4();
          this.getUserValues5();
        }
          },
          error(err) {
            console.error(err);
          },
        });
    }

  }

  populateFormFields(data: any) {
        this.fullname1 = data.fullname;
        console.log(data.fullname);

    this.title1 = data.title;
    this.email1 = data.email;
    this.phonenumber1 = data.phonenumber;
    this.address1 = data.address;
    this.summary1 = data.summary;
    this.universities = [];
    this.degrees = [];
    this.graduationdates = [];
    this.gpas = [];
    this.company = [];
    this.position = [];
    this.startdate = [];
    this.enddate = [];
    this.responsibilities = [];
    this.skillname = [];
    this.skilllevel = [];
    this.projectname = [];
    this.role = [];
    this.duration = [];
    this.description1 = [];
    this.activity = [];
    this.description2 = [];
if(data.educationdetails&&data.educationdetails.length!=0){
  this.tablerows = data.educationdetails;
  for (let i = 0; i < data.educationdetails.length; i++) {
    this.universities[i] = data.educationdetails[i].university;
    this.degrees[i] = data.educationdetails[i].degree;
    this.graduationdates[i] = data.educationdetails[i].graduationdate;
    this.gpas[i] = data.educationdetails[i].gpa;
  }
}
  if(data.certificates&&data.certificates.length!=0){
    this.certificaterows = data.certificates;

  for (let i = 0; i < data.certificates.length; i++) {
    this.certificatename[i] = data.certificates[i].certificate;
    this.authority[i] = data.certificates[i].authority;
    this.dateearned[i] = data.certificates[i].dateearned;
    this.description[i] = data.certificates[i].description;
  }
}

  if(data.workexperience&&data.workexperience.length!=0){
    this.workexperience = data.workexperience;

  for (let i = 0; i < data.workexperience.length; i++) {
    this.company[i] = data.workexperience[i].company;
    this.position[i] = data.workexperience[i].position;
    this.startdate[i] = data.workexperience[i].startdate;
    this.enddate[i] = data.workexperience[i].enddate;
    this.responsibilities[i] = data.workexperience[i].responsibilities;
  }
}

  if(data.skills&&data.skills.length!=0){
    this.skillrows = data.skills;

  for (let i = 0; i < data.skills.length; i++) {
    this.skillname[i] = data.skills[i].skill;
    this.skilllevel[i] = data.skills[i].level;
  }

}
  if(data.projectsexperience&&data.projectsexperience.length!=0){
    this.projectrows = data.projectsexperience;

  for (let i = 0; i < data.projectsexperience.length; i++) {
    this.projectname[i] = data.projectsexperience[i].project;
    this.role[i] = data.projectsexperience[i].role;
    this.duration[i] = data.projectsexperience[i].duration;
    this.description1[i] = data.projectsexperience[i].description1;
  }
  if(data.extracurricular&&data.extracurricular.length!=0){
    this.skillrows1 = data.extracurricular;

  for (let i = 0; i < data.extracurricular.length; i++) {
    this.activity[i] = data.extracurricular[i].activity;
    this.description2[i] = data.extracurricular[i].description2;
  }

}

}
//   if( data.educationDetails&&data.educationDetails.length!=0){

    // this.tableRows = data.educationDetails;
    // this.certificateRows = data.certificates;
    // this.workexperience = data.workExperience;
    // this.skillRows = data.skills;
    // this.projectRows = data.projectsExperience;
    // this.skillRows1 = data.extraCurricular;

    console.log(data);
  }



   cl1(value: any) {
    this.personalinfo = true;
    this.summary = true;
    this.education = true;
    this.certificate = true;
    this.professionalexp = true;
    this.skills = true;
    this.projectexp = true;
    this.extracurricular = true;
    this.personalinfo = value;
    console.log(this.fullname1);
    console.log(this.email1);
    console.log(this.phonenumber1);
    console.log(this.title1);
    console.log(this.address1);
  }
  cl2(value: any) {
    this.personalinfo = true;
    this.education = true;
    this.professionalexp = true;
    this.skills = true;
    this.certificate = true;
    this.projectexp = true;
    this.extracurricular = true;
    this.personalinfo = true;
    this.summary = value;
    console.log(this.summary1);
  }
  cl3(value: any) {
    this.personalinfo = true;
    this.summary = true;
    this.certificate = true;
    this.professionalexp = true;
    this.skills = true;
    this.projectexp = true;
    this.extracurricular = true;
    this.professionalexp = true;
    this.education = value;
  }

  cl4(value: any) {
    this.personalinfo = true;
    this.summary = true;
    this.education = true;
    this.certificate = true;
    this.skills = true;
    this.projectexp = true;
    this.extracurricular = true;
    this.professionalexp = value;
  }
  cl5(value: any) {
    this.personalinfo = true;
    this.summary = true;
    this.education = true;
    this.professionalexp = true;
    this.certificate = true;
    this.projectexp = true;
    this.extracurricular = true;
    this.skills = value;
  }
  cl6(value: any) {
    this.personalinfo = true;
    this.summary = true;
    this.education = true;
    this.professionalexp = true;
    this.skills = true;
    this.certificate = true;
    this.extracurricular = true;
    this.projectexp = value;
  }
  cl7(value: any) {
    this.personalinfo = true;
    this.summary = true;
    this.education = true;
    this.professionalexp = true;
    this.skills = true;
    this.projectexp = true;
    this.certificate = true;
    this.extracurricular = value;
  }
  cl8(value: any) {
    this.personalinfo = true;
    this.summary = true;
    this.education = true;
    this.professionalexp = true;
    this.skills = true;
    this.projectexp = true;
    this.extracurricular = true;
    this.certificate = value;
  }




  addInputControl() {
    this.hobbiesArray.push(new FormControl('', Validators.required));
  }
  removeInputControl(idx: number) {
    this.hobbiesArray.removeAt(idx);
  }
  addRow() {
    this.tablerows.push({
      university: '',
      degree: '',
      graduationdate: '',
      gpa: null,
    });
  }

  deleteRow(i: number) {
    this.tablerows.splice(i, 1);
    this.universities.splice(i, 1);
    this.degrees.splice(i, 1);
    this.graduationdates.splice(i, 1);
    this.gpas.splice(i, 1);
  }

  addCertificateRow() {
    this.certificaterows.push({
      certificatename: '',
      authority: '',
      dateearned: '',
    });
  }

  deleteCertificateRow(i: number) {
    this.certificaterows.splice(i, 1);
    this.certificatename.splice(i, 1);
    this.authority.splice(i, 1);
    this.dateearned.splice(i, 1);
    this.description.splice(i, 1);
  }


  addWorkExperienceRow() {
    this.workexperience.push({
      company: '',
      position: '',
      startdate: '',
      enddate: '',
      responsibilities: '',
    });
  }

  deleteWorkExperienceRow(i: number) {
    this.workexperience.splice(i, 1);
    this.company.splice(i, 1);
    this.position.splice(i, 1);
    this.startdate.splice(i, 1);
    this.enddate.splice(i, 1);
    this.responsibilities.splice(i, 1);
  }

  extraAdd() {
    this.extra = {
      university: this.university,
      degree: this.degree,
      graduationdate: this.graduationdate,
      gpa: this.gpa,
    };
    console.log(this.extra);
  }

  addSkillRow() {
    this.skillrows.push({
      skillname: '',
      skilllevel: '',
    });
  }

  deleteSkillRow(i: number) {
    console.log(i,'index');

    this.skillrows.splice(i, 1);
    this.skillname.splice(i, 1);
    this.skilllevel.splice(i, 1);
  }
  addSkillRow1() {
    this.skillrows1.push({
      skillName: '',
      skillLevel: '',
    });
  }

  deleteSkillRow2(i: number) {
    this.activity.splice(i, 1);
    this.description2.splice(i, 1);
    this.skillrows1.splice(i, 1);
  }

  projectRows: any[] = [];

  addProjectRow() {
    this.projectrows.push({
      projectname: '',
      role: '',
      duration: '',
      description1: '',
    });
  }

  deleteProjectRow(index: number) {
    this.projectrows.splice(index, 1);
  }



  getUserValues() {
    for (let i = 0; i < this.universities.length; i++) {
      this.obj = {};
      this.obj['university'] = this.universities[i];
      this.obj['degree'] = this.degrees[i];
      this.obj['graduationdate'] = this.graduationdates[i];
      this.obj['gpa'] = this.gpas[i];
      this.whole.push(this.obj);
    }

  }

  getUserValues1() {
    for (let i = 0; i < this.certificatename.length; i++) {
      this.obj1 = {};
      this.obj1['certificate'] = this.certificatename[i];
      this.obj1['authority'] = this.authority[i];
      this.obj1['dateearned'] = this.dateearned[i];
      this.obj1['description'] = this.description[i];
      this.whole1.push(this.obj1);
    }
    console.log(this.obj1);
    console.log(this.whole1);
  }

  getUserValues2() {
    for (let i = 0; i < this.company.length; i++) {
      this.obj2 = {};
      this.obj2['company'] = this.company[i];
      this.obj2['position'] = this.position[i];
      this.obj2['startdate'] = this.startdate[i];
      this.obj2['enddate'] = this.enddate[i];
      this.obj2['responsibilities'] = this.responsibilities[i];

      this.whole2.push(this.obj2);
    }
    console.log(this.obj2);
    console.log(this.whole2);
  }

  getUserValues3() {
    for (let i = 0; i < this.skillname.length; i++) {
      this.obj3 = {};
      this.obj3['skill'] = this.skillname[i];
      this.obj3['level'] = this.skilllevel[i];

      this.whole3.push(this.obj3);
    }
    console.log(this.obj3);
    console.log(this.whole3);
  }

  getUserValues4() {
    for (let i = 0; i < this.projectname.length; i++) {
      this.obj4 = {};
      this.obj4['project'] = this.projectname[i];
      this.obj4['role'] = this.role[i];
      this.obj4['duration'] = this.duration[i];
      this.obj4['description1'] = this.description1[i];
      this.whole4.push(this.obj4);
    }
    console.log(this.obj4);
    console.log(this.whole4);
  }

  getUserValues5() {
    for (let i = 0; i < this.activity.length; i++) {
      this.obj5 = {};
      this.obj5['activity'] = this.activity[i];
      this.obj5['description2'] = this.description2[i];

      this.whole5.push(this.obj5);
    }
    console.log(this.obj5);
    console.log(this.whole5);
  }
  total() {
    this.allvalues['fullname'] = this.fullname1;
    this.allvalues['title'] = this.title1;
    this.allvalues['email'] = this.email1;
    this.allvalues['phonenumber'] = this.phonenumber1;
    this.allvalues['address'] = this.address1;
    this.allvalues['summary'] = this.summary1;
    this.allvalues['educationdetails'] = this.whole;
    this.allvalues['certificates'] = this.whole1;
    this.allvalues['workexperience'] = this.whole2;
    this.allvalues['skills'] = this.whole3;
    this.allvalues['projectsexperience'] = this.whole4;
    this.allvalues['extracurricular'] = this.whole5;
    console.log('====================================');
    console.log(this.allvalues);
    console.log('====================================');
  }

  generate(data:any) {

    const documentDefinition = {
      content: [
        {
          text: data.fullname,
          style: 'header',
          alignment: 'center',
        },
        {
          text: data.title,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10],
        },
        {
          text: 'Contact Information',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          ul: [
            { text: `Email: ${data.email}`, margin: [0, 5] },
            { text: `Phone: ${data.phonenumber}`, margin: [0, 5] },
            { text: `Address: ${data.address}`, margin: [0, 5] },
          ],
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator

        {
          text: 'Summary',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          text: this.summary1,
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator

        {
          text: 'Experience',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          ul: data.workexperience.map((experience: any) => {
            return [
              {
                columns: [
                  {
                    width: '*',
                    text: `Company: ${experience.company}`,
                    margin: [0, 5],
                  },
                  {
                    width: 'auto',
                    text: `${experience['startdate']} - ${experience['enddate']}`,
                    alignment: 'right',
                    margin: [0, 5],
                  },
                ],
                columnGap: 10,
              },
              { text: `Position: ${experience.position}`, margin: [0, 5] },
              {
                text: `Responsibilities: ${experience.responsibilities}`,
                margin: [0, 5],
              },
            ];
          }),
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator

        {
          text: 'Education',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          ul: data.educationdetails.map((education: any) => {
            return [
              { text: `University: ${education.university}`, margin: [0, 5] },
              { text: `Degree: ${education.degree}`, margin: [0, 5] },
              {
                text: `Graduation Date: ${education['graduationdate']}`,
                margin: [0, 5],
              },
              { text: `GPA: ${education.gpa}`, margin: [0, 5] },
            ];
          }),
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator
        {
          text: 'Certificate',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          ul: data.certificates.map((certificate: any) => {
            return [
              { text: `Certificate: ${certificate.certificate}`, margin: [0, 5] },
              { text: `Authority: ${certificate.authority}`, margin: [0, 5] },
              {
                text: `Date Earned: ${certificate['dateearned']}`,
                margin: [0, 5],
              },
              { text: `Description: ${certificate.description}`, margin: [0, 5] },
            ];
          }),
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator
/////////////////////

        {
          text: 'Skills',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          ul: data.skills.map((skill: any) => {
            return {
              text: ` ${skill.skill}  (Skill Level: ${skill['level']})`,
              margin: [0, 5],
            };
          }),
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator

        {
          text: 'Project Experience',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          ul: data.projectsexperience.map((project: any) => {
            return [
              { text: `Project Name: ${project.project}`, margin: [0, 5] },
              { text: `Role: ${project.role}`, margin: [0, 5] },
              { text: `Duration: ${project['duration']}`, margin: [0, 5] },
              { text: `Description: ${project['description1']}`, margin: [0, 5] },
            ];
          }),
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator

        {
          text: 'Extracurricular Activities',
          style: 'sectionHeader',
          margin: [0, 10],
        },
        {
          ul: data.extracurricular.map((activity: any) => {

            return [
              { text: `Activity Name: ${activity.activity}`, margin: [0, 5] },
              {
                text: `Description: ${activity['description2']}`,
                margin: [0, 5],
              },
            ];
          }),
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 520.276,
              y2: 10,
              lineWidth: 1,
            },
          ],
        }, // Line separator
      ],

      styles: {
        header: {
          fontSize: 24,
          bold: true,
          marginBottom: 10,
        },
        subheader: {
          fontSize: 18,
          bold: true,
          marginBottom: 10,
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          marginBottom: 10,
        },
        listItem: {},
      },
    };

    (pdfMake as any).createPdf(documentDefinition).download('resume.pdf');
  }

  resume() {

this.totalval().then((val:any)=>{
  let id=this.details._id

  if (this.overallValue!=null&&this.overallValue!=undefined) {
    // this.auth.updateResume(this.Email, this.allValues)
    console.log(id);

this.auth.update('user_resume',id,val).subscribe({

        next: (data: any) => {
          console.log(data);
        },

        error(err) {
          console.log(err);
          // alert(err.message);
        },
      });
  } else {

    val['_id'] = id;

    this.auth.save('user_resume',val).subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error(err) {
          console.log(err);
          // alert(err.message);
        },
      });
  }
})


  }
  // userDetails() {
  //   console.log(this.allValues);
  //   this.http
  //     .post('http://127.0.0.1:8080/auth/user_details', this.allValues)
  //     .subscribe({
  //       next: (data: any) => {
  //         console.log(data.message);
  //       },
  //       error(err) {
  //         console.log(err);
  //         alert(err.message);
  //       },
  //     });
  // }
generatePdf(){

  this.totalval().then(( val:any)=>{
    this.generate( val)
})



}

  totalval(): Promise<any>{
    return new Promise((resolve, reject) => {

    let whole:any []=[]
    let whole1:any []=[]
    let whole2:any []=[]
    let whole3:any []=[]
    let whole4:any []=[]
    let whole5:any []=[]

    for (let i = 0; i < this.universities.length; i++) {
      let obj:any = {};
      obj['university'] = this.universities[i];
      obj['degree'] = this.degrees[i];
      obj['graduationdate'] = this.graduationdates[i];
      obj['gpa'] = this.gpas[i];
      whole.push(obj);
    }
    for (let i = 0; i < this.certificatename.length; i++) {
      // this.obj1 = {};
      let obj1:any = {};

      obj1['certificate'] = this.certificatename[i];
      obj1['authority'] = this.authority[i];
      obj1['dateearned'] = this.dateearned[i];
      obj1['description'] = this.description[i];
      whole1.push(obj1);
    }
    for (let i = 0; i < this.company.length; i++) {
      // this.o/bj2 = {};
      let obj2:any = {};

      obj2['company'] = this.company[i];
      obj2['position'] = this.position[i];
      obj2['startdate'] = this.startdate[i];
      obj2['enddate'] = this.enddate[i];
      obj2['responsibilities'] = this.responsibilities[i];

      whole2.push(obj2);
    }
    for (let i = 0; i < this.skillname.length; i++) {
      // this.obj3 = {};
      let obj3:any = {};
      obj3['skill'] = this.skillname[i];
      obj3['level'] = this.skilllevel[i];

      whole3.push(obj3);
    }
    for (let i = 0; i < this.projectname.length; i++) {
      // this.obj4 = {};
      let obj4:any = {};

      obj4['project'] = this.projectname[i];
      obj4['role'] = this.role[i];
      obj4['duration'] = this.duration[i];
      obj4['description1'] = this.description1[i];
      whole4.push(obj4);
    }
    for (let i = 0; i < this.activity.length; i++) {
      let obj5:any = {};
      obj5['activity'] = this.activity[i];
      obj5['description2'] = this.description2[i];

      whole5.push(obj5);
    }
    let ID =this.auth.getdetails()._id

  let allvalues:any={}
    allvalues['fullname'] = this.fullname1;
      allvalues['title'] = this.title1;
      allvalues['email'] = this.email1;
    // allvalues['_id']=ID
      allvalues['phonenumber'] = this.phonenumber1;
      allvalues['address'] = this.address1;
      allvalues['summary'] = this.summary1;
      allvalues['educationdetails'] = whole;
      allvalues['certificates'] = whole1;
      allvalues['workexperience'] = whole2;
      allvalues['skills'] = whole3;
      allvalues['projectsexperience'] = whole4;
      allvalues['extracurricular'] = whole5;
      console.log('====================================');
      console.log(allvalues);
      console.log('====================================');

      resolve(allvalues)
  })
 }
 noSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.trim().length === 0) {
      return { 'noSpace': true };
    }
    return null;
  };

}
}
