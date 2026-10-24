import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { testProviders } from './test-support.spec';

describe('AppComponent', () => {
	beforeEach(() => {
		return TestBed.configureTestingModule({
			imports: [AppModule], providers: testProviders
		}).compileComponents();
	});

	it('should create the app', () => {
		expect(TestBed.createComponent(AppComponent).componentInstance).toBeTruthy();
	});

	it('should retain its title metadata', () => {
		expect(TestBed.createComponent(AppComponent).componentInstance.title).toEqual('app works!');
	});

	it('should render the survey header and body', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const rendered = fixture.nativeElement;
		expect(rendered.querySelector('header').textContent).toContain('game-changing');
		expect(rendered.querySelectorAll('md-checkbox').length).toEqual(4);
	});
});
