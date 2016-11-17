import { BaseModel,ISerializer } from './base.model';
import { EmployeeModel } from './employee.model';
import { AppointOrderTableModel } from './appoint-order.model';

export class TableEmployeeModel extends BaseModel implements ISerializer{
	employee:EmployeeModel;
	appointOrderList:AppointOrderTableModel[];

	serializer(model:any){
		super.serializer(model.id);
		this.employee = new EmployeeModel().serializer(model);
		if(model.appointmentOrderVos && model.appointmentOrderVos.length > 0){
			this.appointOrderList = [];
			for(let i in model.appointmentOrderVos){
				this.appointOrderList.push(new AppointOrderTableModel().serializer(model.appointmentOrderVos[i]));
			}
		}
		return this;
	}
}