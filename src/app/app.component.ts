import { Component } from '@angular/core';
import { empty } from 'rxjs';
import { GetListsComponent } from './ExpensesLists/get-lists/get-lists.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(){}

  ngOnInit(){
  }

  title = 'ExpensesUI';

  
}
