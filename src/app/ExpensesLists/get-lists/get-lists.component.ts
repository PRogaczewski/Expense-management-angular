import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GetListComponent } from 'src/app/ExpensesList/get-list/get-list.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-get-lists',
  templateUrl: './get-lists.component.html',
  styleUrls: ['./get-lists.component.css'],
})
export class GetListsComponent implements OnInit {
  expensesLists: any[] = [];
  searchedText: string = "";
  userNavbar :boolean = false;

  constructor(private service: ApiService, private route :Router, private expensesList: GetListComponent) {}

  async ngOnInit() {
    this.expensesLists = await this.service.GetExpensesLists();

    if(this.route.url.includes('/ExpensesList/')) {
      this.userNavbar = true;
    }
    else{
      this.userNavbar = false;
    }
  }

  SearchExpensesList() {
    let input = (<HTMLInputElement>document.getElementById('mySearch')).value;

    return this.searchedText = input.toUpperCase();
  }

  GetExpensesList(id: number) {
    this.expensesList.GetExpensesList(id);
    this.route.navigate(['/ExpensesList/'+ id])
    this.userNavbar = true;
  }

  AddNewList(){
    this.route.navigate(['/ExpensesList'])
  }
}
