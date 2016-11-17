import { Component, Input }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { BaseForm }              from '../../models/base-form.model';

@Component({
  selector: 'mw-form-item',
  templateUrl: './mw-form-item.component.html',
  styleUrls: ['./mw-form-item.component.scss']
})
export class MwFormItemComponent {

  @Input() formItem: BaseForm<any>;
  @Input() form: FormGroup;
  //get isValid() { return this.form.controls[this.formItem.key].valid; }
  get isRequired() { 
  	return this.validator('required');
  }
  get isMinLength() { 
  	return this.validator('minlength');
  }

  validator(key:string){
  	if(
      this.form.controls[this.formItem.key]['errors'] && 
      this.form.controls[this.formItem.key]['errors'][key] &&
      (this.form.controls[this.formItem.key]['dirty'] || this.form.controls[this.formItem.key]['touched'])
    ){
  		return false;
  	}else{
  		return true;
  	}
  }
}
