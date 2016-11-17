import { Component,OnInit } from '@angular/core';

import { MwLoaderService } from '../../../shared/index';

@Component({
  selector: 'mw-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
  providers: [ MwLoaderService ]
})
export class SignComponent { 
	constructor(private loader: MwLoaderService) {
		//this.loadImages();
  	}

    public ngAfterViewInit(): void {
        // hide spinner once all loaders are completed
        // MwLoaderService.loadAll().then((values) => {
        // 	// setTimeout(() => {
        //  //    	this.loader.hide();
        // 	// }, 2000);
        //     this.loader.hide();
        // });
    }

    private loadImages(): void {
        // register some loaders
        MwLoaderService.registerLoader(this.loader.load('assets/images/sign-bg.jpg'));
    }
}