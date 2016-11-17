// import { TestBed } from '@angular/core/testing';
// import { OrderComponent } from './order.component';
// import { ToasterModule,ToasterService } from 'angular2-toaster/angular2-toaster';
// import { SlimLoadingBarComponent,SlimLoadingBarService } from 'ng2-slim-loading-bar';
// import { SharedModule,AuthService,HttpService,EventBus,MemberService } from '../../../shared/index';
// import { HttpModule, JsonpModule } from '@angular/http';
// import { Http,ConnectionBackend,RequestOptions } from '@angular/http';
// import { ActivatedRoute } from '@angular/router';

// describe('App', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({ 
//       imports:[SharedModule,HttpModule],
//       providers:[EventBus,SlimLoadingBarService,MemberService,HttpService,AuthService],
//       declarations: [OrderComponent]
//     });
//   });
//   // it ('should work', () => {
//   //   let fixture = TestBed.createComponent(OrderComponent);
//   //   //expect(fixture.componentInstance instanceof OrderComponent).toBe(true, 'should create OrderComponent');
//   //   expect(fixture.componentInstance.test()).toEqual(true);
//   // });

//   describe('test', () => {
//     it('true is true',
//         () => expect(true).toEqual(true)
//     );
//     it('null is not the same thing as undefined',
//         () => expect(null).not.toEqual(undefined)
//     );
//     it('null is the same thing as undefined',
//         () => expect(null).toEqual(null)
//     );
//     // it('0.1+0.2=0.3 ?',
//     //     () => expect(0.1 + 0.2).toEqual(0.3)
//     // );
//   });
// });


// import { TestBed } from '@angular/core/testing';
// import { AppComponent } from './app.component';
// //import { AppModule } from '../app.module';
// import { BrowserModule }  from '@angular/platform-browser';
// //import { SharedModule }   from '../../shared/index';
// import { AppRoute,appRoutingProviders } from '../app.routes';
// import { ToasterModule,ToasterService } from 'angular2-toaster/angular2-toaster';
// import { SlimLoadingBarComponent,SlimLoadingBarService } from 'ng2-slim-loading-bar';
// import { AuthService } from '../../shared/index';
// import { HttpService } from '../../shared/index';
// import { EventBus } from '../../shared/index';
// //import { Http,ConnectionBackend,RequestOptions } from '@angular/http';
// import { HttpModule, JsonpModule } from '@angular/http';
// import { FormsModule } from '@angular/forms';
// //import { Router, RouterModule } from '@angular/router';

// describe('App', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({ 
//       imports:[BrowserModule,FormsModule,HttpModule,JsonpModule,ToasterModule,AppRoute],
//       providers:[appRoutingProviders,AuthService,HttpService,EventBus,SlimLoadingBarService,ToasterService],
//       declarations: [AppComponent,SlimLoadingBarComponent]
//     });
//   });
//   it ('should work', () => {
//     let fixture = TestBed.createComponent(AppComponent);
//     expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
//   });

//   describe('test', () => {
//     it('true is true',
//         () => expect(true).toEqual(true)
//     );
//     it('null is not the same thing as undefined',
//         () => expect(null).not.toEqual(undefined)
//     );
//     it('null is the same thing as undefined',
//         () => expect(null).toEqual(null)
//     );
//     it('0.1+0.2=0.3 ?',
//         () => expect(0.1 + 0.2).toEqual(0.3)
//     );
//   });
// });
