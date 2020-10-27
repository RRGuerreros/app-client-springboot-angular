import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})

export class HeaderComponent implements OnInit {
  
  public titulo = 'VENTAS';


  constructor() { }

  ngOnInit(): void {}

  

}
