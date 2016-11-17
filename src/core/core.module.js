import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, MwLoadingBarComponent, MwLoadingBarService } from '../shared/index';
export var CoreModule = (function () {
    function CoreModule(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
    CoreModule.forRoot = function () {
        return {
            ngModule: CoreModule,
            providers: []
        };
    };
    CoreModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [MwLoadingBarComponent],
                    exports: [MwLoadingBarComponent],
                    providers: [UserService, MwLoadingBarService]
                },] },
    ];
    /** @nocollapse */
    CoreModule.ctorParameters = [
        { type: CoreModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
    ];
    return CoreModule;
}());
//# sourceMappingURL=core.module.js.map