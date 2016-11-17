import { Component, Input, OnInit }  from '@angular/core';
import { FormControl, FormGroup, Validators }                 from '@angular/forms';
import { BaseForm }              from '../../models/base-form.model';

@Component({
  selector: 'mw-form',
  templateUrl: './mw-form.component.html',
  styleUrls: ['./mw-form.component.scss']
})
export class MwFormComponent implements OnInit {
  @Input() items: BaseForm<any>[] = [];
  form: FormGroup;
  payLoad = '';
  constructor() {  }
  ngOnInit() {
    this.form = this.toFormGroup(this.items);
  }
  onSubmit() {
    //this.payLoad = JSON.stringify(this.form.value);
    for(let index in this.form.controls) { 
      if (this.form.controls.hasOwnProperty(index)) {
        let attr = this.form.controls[index];
        attr["markAsDirty"]();
      }
    }
  }

  private toFormGroup(questions: BaseForm<any>[] ) {
    if(!questions){
      return new FormGroup({});
    }
    let group: any = {};

    questions.forEach(question => {
      //group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
      //                                        : new FormControl(question.value || '');
      let validators:any = [];
      if(question.required){
        validators.push(Validators.required);
      }
      if(question.minlength){
        validators.push(Validators.minLength(question.minlength));
      }
      group[question.key] = new FormControl(question.value || '',validators);
    });
    return new FormGroup(group);
  }
}
