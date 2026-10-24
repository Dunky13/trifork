import { TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';
import { AppModule } from '../app.module';
import { BodyComponent } from './body.component';
import { testProviders } from '../test-support.spec';

describe('BodyComponent', () => {
	beforeEach(() => {
		return TestBed.configureTestingModule({ imports: [AppModule], providers: testProviders }).compileComponents();
	});

	it('should be created with the configured choices', () => {
		const fixture = TestBed.createComponent(BodyComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
		expect(fixture.nativeElement.querySelectorAll('md-checkbox').length).toEqual(4);
	});

	it('should require one choice per pair and contact information', () => {
		const component = TestBed.createComponent(BodyComponent).componentInstance;
		expect(component.isFinished()).toBe(false);
		component.items.changeState(0, 0);
		component.items.changeState(1, 1);
		expect(component.items.get(0, 1).isDisabled()).toBe(true);
		expect(component.isFinished()).toBe(false);
		component.name = 'Test User';
		component.email = 'test@example.invalid';
		expect(component.isFinished()).toBe(true);
	});

	it('should submit the existing payload shape and reset the survey', () => {
		const component = TestBed.createComponent(BodyComponent).componentInstance;
		component.items.changeState(0, 0);
		component.items.changeState(1, 1);
		component.name = 'Test User';
		component.email = 'test@example.invalid';
		const http = TestBed.get(Http);
		const post = spyOn(http, 'post').and.callThrough();
		component.submit();
		const payload = post.calls.mostRecent().args[1];
		expect(payload.name).toEqual('Test User');
		expect(payload.email_address).toEqual('test@example.invalid');
		expect(payload.technology).toEqual(['First', 'Fourth']);
		expect(typeof payload.datetime).toEqual('number');
		expect(component.name).toEqual('');
		expect(component.email).toEqual('');
		expect(component.isFinished()).toBe(false);
	});
});
