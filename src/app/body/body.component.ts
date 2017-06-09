import {Component, OnInit} from "@angular/core";
import {ConfigService} from "../config.service";
import {Items} from "./items";
import {Http, URLSearchParams, RequestOptions, Headers} from "@angular/http";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  private maxNumber: number;
  public items: Items;
  private selected: Map<number, string>;
  private shuffle: boolean;
  public email: string;
  public tel: string;

  constructor(private _config: ConfigService, private http: Http) {
    this.shuffle = _config.get('shuffle');
    this.items = new Items(_config.get('technology'), this.shuffle);
    this.maxNumber = this.items.size();
    this.selected = new Map();
  }

  ngOnInit() {
  }

  isFinished(): boolean {
    let labelValid = false;
    try {
      labelValid = this.items.getLabels().length === this.maxNumber;
    } catch (e) {
      labelValid = false;
    }
    const emailValid = typeof this.email !== 'undefined' &&
      this.email.indexOf('@') > 0 &&
      this.email.indexOf('.') > 0;
    const telValid = typeof this.tel !== 'undefined' &&
      this.tel.length > 0;
    // console.log(labelValid, emailValid, telValid);
    return labelValid && emailValid && telValid;
  }

  submit() {
    const data = {
      "datetime": new Date().getTime(),
      "email_address": this.email,
      "phone_number": this.tel,
      "round1": this.items.getLabels()
    };

    console.log(data);

    const url = this._config.get('storageLocation',);

    const headers = new Headers();
    headers.append("Authorization", "Basic ...");
    headers.append("Content-Type", "application/json");

    const options = new RequestOptions({
      headers: headers
    });

    this.http.post(url, data, options).subscribe(_data => {
      console.log(_data);
    });

    this.items.init();
    this.email = "";
    this.tel = "";
  }

}
