import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {
	private _config: Object = null;
	constructor(private http: Http) { }
	load() {
		return new Promise((resolve, reject) => {
			this.http.get('/assets/config.json')
				.map(res => res.json())
				.subscribe((env_data) => {
					this._config = env_data;
					resolve(true);
				});

		});
	}

	get(key: any) {
		return this._config[key];
	}
}
