import { Component, OnInit } from '@angular/core';
import { Demo } from './';

@Component({
  selector: 'tmn-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  private demo: Demo;

  constructor() { }

  ngOnInit() {
  }

}
