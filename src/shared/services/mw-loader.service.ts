import { Injectable } from '@angular/core';

@Injectable()
export class MwLoaderService {
    private _selector: string = 'preloader';
    private _element: HTMLElement;
    private static _loaders: Array < Promise < any >> = [];

    constructor() {
        this._element = document.getElementById(this._selector);
    }

    public load(src: any): Promise < any > {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = src;
            img.onload = function() {
                resolve('Image with src ' + src + ' loaded successfully.');
            };
        });
    }

    public hide(delay: number = 0): void {
        setTimeout(() => {
            this._element.style['display'] = 'none';
        }, delay);
    }

    public static registerLoader(method: Promise < any > ): void {
        MwLoaderService._loaders.push(method);
    }

    public static clear(): void {
        MwLoaderService._loaders = [];
    }

    public static loadAll(): Promise < any > {
        return new Promise((resolve, reject) => {
            MwLoaderService._executeAll(resolve);
        });
    }

    private static _executeAll(done: Function): void {
        setTimeout(() => {
            Promise.all(MwLoaderService._loaders).then((values) => {
                done.call(null, values);
            }).catch((error) => {
                console.error(error);
            });
        });
    }
}
