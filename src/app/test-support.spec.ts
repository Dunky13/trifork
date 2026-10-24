import { Http, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ConfigService } from './config.service';

export const testConfig = {
	load: () => Promise.resolve(true),
	get(key: string) {
		switch (key) {
			case 'technology': return ['First', 'Second', 'Third', 'Fourth'];
			case 'shuffle': return false;
			default: return '';
		}
	}
};

export const testHttp = {
	post: () => Observable.of(new Response(new ResponseOptions({ body: '{}' })))
};

export const testProviders = [
	{ provide: ConfigService, useValue: testConfig },
	{ provide: Http, useValue: testHttp }
];
