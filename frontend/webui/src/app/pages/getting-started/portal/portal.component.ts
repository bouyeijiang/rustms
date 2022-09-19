import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalComponent implements OnInit, AfterViewInit {
  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
