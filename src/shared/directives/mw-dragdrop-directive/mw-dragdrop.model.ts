//import * as dragulaExpt from 'dragula/dragular';
let dragulaExpt = require("dragula");
export const dragula: (value?: any) => any = (dragulaExpt as any).default || dragulaExpt;