import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
	public maxNumber: number;
	constructor(private _config: ConfigService) {
		this.maxNumber = _config.get('technology').length / 2;
	}

	ngOnInit() {
	}
	ngAfterViewInit() {

	}
}
