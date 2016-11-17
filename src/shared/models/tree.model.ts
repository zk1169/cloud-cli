import { BaseModel,ISerializer } from './base.model';
import { PayRule } from './pay-rule.model';
import { PayRuleType } from './mw.enum';

export class TreeModel extends BaseModel{
	name:string;//名称
	code:string;//编码
	parent:TreeModel;//父
	children:TreeModel[];//子
	collapse:boolean;//是否折叠
	isLeaf:boolean;//是否是叶子
  cascade:boolean;//是否级连
  data:any;//数据

	checkbox:HTMLInputElement;

	private _checked:boolean;

	constructor(id?:number){
		super(id);
    //this.cascade = true;
	}

	get checked(){
    	return this._checked;
  	}
  	
  	set checked(value:boolean){
    	this._checked = value;

      if(!this.cascade){
        return;
      }
    	
    	if(this.children){
    	  this.children.forEach((item:TreeModel)=>{
    	    item.checked = value;
    	  });
    	}
    	this.setParentChecked();
  	}

  	get indeterminate(){
  	  if(this.checkbox){
  	  	return this.checkbox.indeterminate;
  	  }else{
  	  	return false;
  	  }
  	}
  	set indeterminate(value:boolean){
  	  if(this.checkbox){
  	  	this.checkbox.indeterminate = value;
  	  }
  	}

	setChecked(value:boolean){
  		this._checked = value;
  		this.setParentChecked();
  	}
  	//设置parent节点的选中状态
  	private setParentChecked(){
  		if(this.parent){
    		let isAllChildrenChecked = this.parent.isAllChildrenChecked();
    		if(isAllChildrenChecked == true){
    			this.parent.indeterminate = false;
    			this.parent.setChecked(true);
    		}else if(isAllChildrenChecked == false){
    			this.parent.indeterminate = false;
    			this.parent.setChecked(false);
    		}else if(isAllChildrenChecked == null){
    			this.parent.indeterminate = true;
    			this.parent.setChecked(false);
    		}
    	}
  	}
  	//检查children的选中数量
  	private isAllChildrenChecked(){
  		if(!this.children){
  			//一个没选中
  			return false;
  		}
  		let checkedCount:number=0;
    	this.children.forEach((item:TreeModel)=>{
    	  if(item.checked){
    	  	checkedCount++;
    	  }else if(item.indeterminate){
    	  	checkedCount += 0.5;
    	  }
    	});
    	if(checkedCount == 0){
    		//一个没选中
    		return false;
    	}else if(checkedCount == this.children.length){
    		//全部选中
    		return true;
    	}else{
    		//部分选中
    		return null;
    	}
  	}

    initTree(payRuleList:PayRule[]){
      if(!payRuleList){
        return;
      }
      
      payRuleList.forEach((item:PayRule)=>{
        this.initTreeItem(item);
      });
    }

    initTreeItem(payRule:PayRule){
      if(!payRule){
        return;
      }
      if(this.code == payRule.categoryCode){
        this.checked = true;
        return;
      }
      if(!this.children){
        return;
      }
      this.children.forEach((item:TreeModel)=>{
        item.initTreeItem(payRule);
      });
    }

	serializer(model:any,parent?:TreeModel){
		this.name = model.name;
		this.code = model.code;
		this.parent = parent;
		this.isLeaf = model.isLeaf;

    if(model.data){
      this.data = new PayRule().serializer(model.data);
    }
    if(model.dataType){
      switch(model.dataType){
        case 'SERVICE_ITEM':
          this.data.type = PayRuleType.SERVICE_ITEM;
          break;
        case 'PRODUCT':
          this.data.type = PayRuleType.PRODUCT;
          break;
        case 'SERVICE_PACKAGE':
          this.data.type = PayRuleType.SERVICE_PACKAGE;
          break;
        case 'CARD':
          this.data.type = PayRuleType.CARD;
          break;
        case 'TICKET':
          //this.data.type = PayRuleType.CARD;
          break;
      }
      this.id = this.data.id;
    }

    if(model.data){
      if(!this.data.name){
        this.data.name = model.name;
      }
      if(!this.data.categoryCode){
        this.data.categoryCode = model.code;
      }
    }
    
		if(model.children && model.children.length > 0){
			this.children = [];
			model.children.forEach((item:any,index:number)=>{
				this.children.push(new TreeModel().serializer(item,this));
			});
		}
		if(model.childNodes && model.childNodes.length > 0){
			this.children = [];
			model.childNodes.forEach((item:any,index:number)=>{
				this.children.push(new TreeModel().serializer(item,this));
			});
		}
		return this;
	}

	static createRootNode(nodeName?:string):TreeModel{
		let tree = new TreeModel();
		tree.code = "0";
        tree.name = nodeName || "全部";
        tree.parent = null;
        tree.children = [];
        tree.collapse = false;
        return tree;
	}
}
