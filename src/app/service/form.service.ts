import { HttpClient } from '@angular/common/http';
import { Injectable, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import * as _ from 'lodash';
import { async, catchError } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { DataService } from './data.service';
import { DialogService } from './dialog.service';
import { HelperService } from './helper.service';
import { values } from 'lodash';
import * as moment from 'moment';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  authdata: any
  user_id: any
  email: any
  role_id: any
  formData = new FormData();

  constructor(
    private helperService: HelperService,
    private dataService: DataService,
    private dialogService: DialogService,
    private httpclient: HttpClient) {
   
  }

  LoadMasterInitData(ctrl:any) {
    this.dataService.loadScreenConfigJson(ctrl.formName).subscribe(async config=>{
      console.log(config);
      
        ctrl.config = config
        
        ctrl.pageHeading = config.pageHeading
        ctrl.collectionName = config.form.collectionName
        // ctrl.model = config.model ? config.model : {};
        // ctrl.isPopupEdit=ctrl.detailForm.isPopupEdit
        // ctrl.detailModel=ctrl.detailForm.fields
        ctrl.mode = config.addEditMode ? config.addEditMode : 'popup'
        ctrl.fields = config.form.fields
        this.LoadData(ctrl)
        // this.loadSupportData(ctrl)
        // if (config.getWeightFromMachine) {
        //   this.serialPortService.init()
        // }
      })
    }
  /**
 * This Main method We CAll in form Services 
 * @id if id availabe ,IT  load the existing data 
 * @ctrl This is Total content from the parent componet.
 */
  LoadInitData(ctrl: any) {
    
    
    debugger
    this.httpclient.get("assets/jsons/" + ctrl.formName + "-" + "form.json").subscribe(async (config: any) => {
      ctrl.config = config
      ctrl.model = config.model ? config.model : ctrl.model;
      ctrl.pageHeading = config.pageHeading
      ctrl.collectionName = config.form.collectionName
      // ctrl.model = config.model ? config.model : {};
      ctrl.mode = config.addEditMode ? config.addEditMode : 'popup' 
      ctrl.id = ctrl.model[config.keyField] || ctrl.model["id"] || ctrl["id"]
      ctrl.butText = ctrl.id ? 'Update' : 'Save';   //buttons based on the id
      ctrl.formAction = ctrl.id ? 'Edit' : 'Add';


      if (ctrl.formAction == 'Edit' && ctrl.config.mode == 'page') {
        this.LoadData(ctrl).subscribe((res: any) => {
          ctrl.fields = config.form.fields
        })
      }
      else if (ctrl.formAction == 'Edit' && ctrl.mode == 'popup') {
        ctrl.model['isEdit'] = true
        ctrl.model['isshow'] = true
        ctrl.model['ishide'] = true
        ctrl.isFormDataLoaded = true
        ctrl.formAction = ctrl.config.formAction || 'Edit';
        ctrl.isEditMode = true;
      }
      ctrl.fields = config.form.fields
    })
  }

  /**
 * This Function help to get the screen config from data base
 * @ctrl This is Total content from the parent componet.
 */
  LoadConfig(ctrl: any) {
    
    // form or any other screen keyField (it should be given in form)
    this.dataService.loadScreenConfigJson(ctrl.formName).subscribe(async config=>{
      ctrl.config = config
      ctrl.pageHeading = config.pageHeading
      ctrl.collectionName = config.form.collectionName
      ctrl.mode = config.screenEditMode ? config.screenEditMode : 'popup'
      ctrl.model["keyField"] = config.keyField || 'id'
      ctrl.id = ctrl.model[config?.keyField] || ctrl?.model["_id"] 
      ctrl.formAction = ctrl.id ? 'Edit' : 'Add';
      ctrl.butText = ctrl.id ? 'Update' : 'Save';   //buttons based on the id
      
        if (ctrl.formAction == 'Edit' && ctrl.config.mode == 'page') {
                  // this.LoadData(ctrl).subscribe((res: any) => {
        ctrl.fields = config.form.fields
        // })
      }
      else if (ctrl.formAction == 'Edit' && ctrl.mode == 'popup') {
        

        ctrl.model['isEdit'] = true
        ctrl.model['isshow'] = true
        ctrl.model['ishide'] = true
        ctrl.isFormDataLoaded = true
        ctrl.formAction = ctrl.config.formAction || 'Edit';
        ctrl.isEditMode = true;
      }
      ctrl.fields = config.form.fields
    })
  }

 

  //"json:"within" bson:"within"  validate:"omitempty,within=2d
  extractComparisonOperator(tag: any) {
    const matchResult = tag.match(
      /\b(eq|gt|gte|lt|lte|min|max|regexp|between_age|within|ne)\b/
    );
    if (matchResult) {
      return matchResult[0];
    }
    return null;
  }
  resetDetailModel(ctrl: any) {

    let form = ctrl.config.detailForm
    if (form) {
      ctrl.detailModel = {}
      ctrl.isDetailEditMode = false
      ctrl.butText = "Add"
      if (form.defaultFocusIndex) {
        form.fields[form.defaultFocusIndex].focus = true
                //TODO ??
        // form.fields[form.defaultFocusIndex].defaultValue = ""
      }
    }
  }

 
LoadData(ctrl: any): Observable<boolean> {
  var nextValue = new Subject<boolean>()
  this.LoadFormData(ctrl).subscribe(exists => {
    nextValue.next(exists)
  })
  return nextValue.asObservable()
}


  LoadFormData(ctrl: any): Observable<boolean> {
    var nextValue = new Subject<boolean>()
    if (ctrl.id) {
      this.dataService.getDataById(ctrl.collectionName, ctrl.id).subscribe(
        (result: any) => {
          
          if (result && result.data && result != null) {
            //  result data is array of index 0 
            ctrl.model = result.data[0] || {}          
            ctrl.model['isEdit'] = true
            ctrl.model['isshow'] = true
            ctrl.model['ishide'] = true
            ctrl.isFormDataLoaded = true
            ctrl.isDataError = false //???
            ctrl.formAction = ctrl.config.formAction || 'Edit';
            ctrl.isEditMode = true;
            //we need old data, if update without any changes
            ctrl.modelOldData = _.cloneDeep(ctrl.model)
            nextValue.next(true)
          } else {
            ctrl.model['isEdit'] = false
            ctrl.formAction = 'Add';
            ctrl.isFormDataLoaded = false
            nextValue.next(false)
          }
        },
        error => {
          console.error('There was an error!', error);
          nextValue.next(false)
        }
      )
    } else {
      nextValue.next(false)
    }
    return nextValue.asObservable();
  }


  
  /**
 * This method used Save or update the data / Add and update the form
 * Take the Old Data in modelOldData 
 * @param ctrl This is Total content from the parent componet
 */
  async saveFormData(ctrl: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // this.helperService.validateAllFormFields(ctrl.form); I Dont what is it ?
      
      if (!ctrl.form.valid) {
      //   function collectInvalidLabels(controls: any, invalidLabels: string = ''): string {
      //     for (const key in controls) {
      //         if (controls.hasOwnProperty(key)) {
      //             const control = controls[key];
          
      //             if (control instanceof FormGroup) {
      //                 invalidLabels += collectInvalidLabels(control.controls);
      //             } else if (control instanceof FormControl && control.status === 'INVALID') {
      //                 // Access the label property assuming it exists in the control
      //                 invalidLabels +=controls[key]._fields[0].props.label + ",";
      //             }else if(control instanceof FormArray && control.status === 'INVALID'){
      //               invalidLabels +=controls[key]._fields[0].props.label + ",";
      //             }
      //         }
      //     } 
      //     return invalidLabels;
      // }
      const invalidLabels:any = this.helperService.getDataValidatoion(ctrl.form.controls);
      this.dialogService.openSnackBar("Error in " + invalidLabels, "OK");
      // const invalidLabels:any = collectInvalidLabels(ctrl.form.controls);
        // ctrl.dialogService.openSnackBar("Error in " + invalidLabels, "OK");
       ctrl.form.markAllAsTouched();
        ctrl.butonflag=false
        return ;
      }
      var data = ctrl.form.value
      // ?SYSTEM USER
      let role_type:any =this.dataService.getdetails().role
      if(ctrl?.config?.rolebased&& role_type!=="SA"){
       data.org_id=this.dataService.getdetails().org_id
      }
// ?SYSTEM USER
      if(ctrl?.config?.user&&role_type!=="SA"){
        data.org_id=this.dataService.getdetails().org_id 
        data.user_type=role_type
      }
// ? PREFIX
      if(ctrl?.config?.Change_id && (ctrl.model.isEdit !==true||ctrl.formAction == 'Add')){

        // data.org_id=this.dataService.getdetails().profile.org_id
        // data._id=data.org_id+"-"+data._id
        data[ctrl.config.changekeyfield]=data[ctrl.config.addkeyfield]+"-"+data[ctrl.config.changekeyfield]
      }

      // It can be done in any project with different screen config
      //while saving set default values

        if (ctrl.formAction == 'Add') {
          var defaultValues = ctrl.config.form.defaultValues || []
          // this.loadDefaultValues(defaultValues,data,ctrl.model)
          this.dataService.save(ctrl.collectionName,data).pipe(
            catchError((error:any) => {
              ctrl.butonflag=false
              return error }) ).subscribe((res: any) => {
            if(res){
              
              if(ctrl?.config?.user){
                this.updateuser(ctrl,res);
              } 
              
              this.dialogService.openSnackBar("Data has been Inserted successfully", "OK")
             resolve(res)

          }
             else {
              this.dialogService.openSnackBar(res.error_msg, "OK")
            }
          })
        }
        else {
          delete data._id
          this.dataService.update(ctrl.collectionName,ctrl.id,data).pipe(
            catchError((error:any) => {
              ctrl.butonflag=false
              // console.error('Error occurred:', error);
              return error
            })
    ).subscribe((res: any) => {
          this.dialogService.openSnackBar("Data has been updated successfully", "OK")
          
            resolve(res)
          })
        }
      

    })
  }



  updateuser(ctrl:any,refId:any){
    
      let datas:any={}
      if(ctrl?.collectionName=='client'){
         datas={
          _id:ctrl.model.contact_details.email_id,
          first_name:ctrl.model.contact_details.first_name + " " +ctrl.model.contact_details.last_name,
          mobile_number:ctrl.model.contact_details.mobile_number,
          user_type:ctrl.collectionName.toLowerCase(),
          role:'Admin',
          org_id:ctrl.model._id 
        }
     }else{
    datas={
            _id:ctrl.model.email,
            name:ctrl.model.first_name+" "+ctrl.model.last_name,
            user_type: ctrl.collectionName.toLowerCase(),
            mobile_number:ctrl.model.mobile_number,
            role:ctrl.model.designation,
            employee_id:ctrl.model.employee_id,
            status:"Email Sended"
          }
        }
     this.dataService.save('user',datas).subscribe((res: any) => {
     console.log(res);
     
    }
    )
     
  }


}

