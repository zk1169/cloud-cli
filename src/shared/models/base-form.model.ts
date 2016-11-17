// export interface IDynamicForm{
//   initFormItems():BaseForm<any>[];
//   getFormValue():void;
// }

export class BaseForm<T>{
  value: T;
  key: string;
  label: string;
  required: boolean;
  minlength:number;
  maxlength:number;
  order: number;
  controlType: string;
  disabled:boolean;
  defaultValue:any;
  addon:string;
  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      controlType?: string,
      minlength?: number,
      maxlength?: number,
      disabled?:boolean,
      defaultValue?: any,
      addon?: string
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.minlength = options.minlength;
    this.maxlength = options.maxlength;
    this.disabled = options.disabled;
    this.defaultValue = options.defaultValue;
    this.addon = options.addon;
  }

  getValue(){
    return this.defaultValue;
  }
}

export class TextboxForm extends BaseForm<string> {
  controlType = 'textbox';
  type: string;// text,number,email
  placeholder:string;

  constructor(options: any = {}) {
    super(options);
    this.type = options['type'] || '';
    this.placeholder = options['placeholder'];
  }
}

export class TextareaForm extends TextboxForm {
  controlType = 'textarea';

  constructor(options: any = {}) {
    super(options);
  }

  getValue(){
    return super.getValue();
  }
}

export class DropdownForm extends BaseForm<string> {
  controlType = 'dropdown';
  options: {name: string, value: any}[] = [];

  constructor(options: any = {}) {
    super(options);
    this.options = options['options'] || [];
  }

  getValue(){
    return super.getValue();
  }
}

export class MwSelectForm extends BaseForm<string> {
  controlType = 'mwselect';
  options: {name: string, value: any}[] = [];
  multiple:boolean;

  constructor(options: any = {}) {
    super(options);
    this.multiple = options['multiple'];
    this.options = options['options'] || [];
  }

  getValue(){
    return super.getValue();
  }
}

export class RadioForm extends BaseForm<string> {
  controlType = 'radio';
  options: {name: string, value: any}[] = [];

  constructor(options: any = {}) {
    super(options);
    this.options = options['options'] || [];
  }

  getValue(){
    return this.defaultValue.value;
  }
}

export class CardRuleForm extends BaseForm<string> {
  controlType = 'cardRule';
  options: any[];

  constructor(options: any = {}) {
    super(options);
    this.options = options['options'] || [];
  }

  getValue(){
    return this.defaultValue;
  }
}