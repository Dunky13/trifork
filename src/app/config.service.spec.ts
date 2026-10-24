import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
	it('should create the service and load the configured resource', done => {
		const backend = new MockBackend();
		const service = new ConfigService(new Http(backend, new BaseRequestOptions()));
		backend.connections.subscribe(connection => {
			expect(connection.request.url).toEqual('/assets/config.json');
			connection.mockRespond(new Response(new ResponseOptions({ body: { technology: ['First', 'Second'] } })));
		});
		expect(service).toBeTruthy();
		service.load().then(() => {
			expect(service.get('technology')).toEqual(['First', 'Second']);
			done();
		});
	});
});
