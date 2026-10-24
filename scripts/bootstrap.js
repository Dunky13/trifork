import '../.build/.build-source/polyfills.js';
import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../.build/.build-source/.aot/app/app.module.ngfactory.js';

if (process.env.NODE_ENV === 'production') enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
