import { Component, OnInit } from '@angular/core';
import { Demo } from '../demo/demo';

@Component({
  selector: 'tmn-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.css']
})
export class DemosComponent implements OnInit {

  private demos: Demo [];
  private demoUrls: string [];

  constructor() { }

  ngOnInit() {
  }

}
