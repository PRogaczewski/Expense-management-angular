import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GetListComponent } from 'src/app/ExpensesList/get-list/get-list.component';
import { RoutingService } from 'src/app/RoutingService';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-get-lists',
  templateUrl: './get-lists.component.html',
  styleUrls: ['./get-lists.component.css'],
})
export class GetListsComponent implements OnInit {
  expensesLists: any[] = [];
  searchedText: string = '';
  userNavbar: boolean = false;

  IsUserLogged: boolean = false;

  constructor(
    private service: ApiService,
    private route: Router,
    private expensesList: GetListComponent,
    private routing: RoutingService
  ) {}

  async ngOnInit() {
    this.expensesLists = await this.service.GetExpensesLists();

    this.routing.getUserInfo().subscribe((value: boolean) => {
      this.IsUserLogged = value;
    });

    if (this.route.url.includes('/ExpensesList/')) {
      this.userNavbar = true;
    } else {
      this.userNavbar = false;
    }
  }

  SearchExpensesList() {
    let input = (<HTMLInputElement>document.getElementById('mySearch')).value;

    return (this.searchedText = input.toUpperCase());
  }

  GetExpensesList(id: number) {
    this.expensesList.GetExpensesList(id);
    this.route.navigate(['/ExpensesList/' + id]);
    this.userNavbar = true;
  }

  AddNewList() {
    this.route.navigate(['/ExpensesList']);
  }

  Login() {
    this.routing.setData(true);
    this.route.navigate(['/Authentication']);
  }

  Register() {
    this.routing.setData(false);
    this.route.navigate(['/Authentication']);
  }
}
