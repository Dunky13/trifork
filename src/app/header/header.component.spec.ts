import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { HeaderComponent } from './header.component';
import { testProviders } from '../test-support.spec';

describe('HeaderComponent', () => {
	beforeEach(() => {
		return TestBed.configureTestingModule({ imports: [AppModule], providers: testProviders }).compileComponents();
	});
	it('should create the header with the configured pair count', () => {
		const fixture = TestBed.createComponent(HeaderComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
		expect(fixture.nativeElement.textContent).toContain('(Choose 2)');
	});
});
