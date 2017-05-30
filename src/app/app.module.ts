import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdButtonModule, MdCheckboxModule } from '@angular/material';


import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';

export function loadConfig(config: ConfigService) {
	return () => config.load();
}

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		BodyComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpModule,
		MaterialModule, MdButtonModule, MdCheckboxModule
	],
	providers: [
		ConfigService,
		{ provide: APP_INITIALIZER, useFactory: loadConfig, deps: [ConfigService], multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
