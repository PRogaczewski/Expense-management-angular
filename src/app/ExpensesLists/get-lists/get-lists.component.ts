import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
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
  AnyList: boolean = true;

  IsUserLogged: boolean = false;

 constructor(
    private service: ApiService,
    private route: Router,
    private eventSubscriber: ActivatedRoute,
    private routing: RoutingService,
    private auth: AuthService
  ) {
    route.events.subscribe((event) => {
      
      if(this.IsUserLogged && !this.route.url.includes('/ExpensesList/')){
        this.GetList();
        this.userNavbar = false;
      }
      else if(this.route.url.includes('/ExpensesList/') && this.IsUserLogged){
        this.userNavbar = true
      }
      else{
        this.userNavbar = false;
      }
    });

    this.eventSubscriber.queryParams.subscribe(par=>{
      this.routing.getUserInfo().subscribe((value: boolean) => {
        this.IsUserLogged = value;

        if(this.IsUserLogged && !this.route.url.includes('/ExpensesList/')){
          this.GetList();
          this.userNavbar = false;
        }
      });
    })
  }

  async ngOnInit() {
    if(this.auth.GetUserContext()){
      this.IsUserLogged = true;
     }
     else{
      this.IsUserLogged = false;
     }

    if(this.IsUserLogged){
      try{
        await this.service.GetExpensesLists().then((res)=>{
          this.expensesLists = res.data.userLists;
        });
      }
      catch{
        console.log("some err")
      }
    }
  }

  async GetList(){
    await this.service.GetExpensesLists().then((res)=>{
      this.expensesLists = res.data.userLists;
    });

    if(this.expensesLists.length > 0){
        this.AnyList = false;
    }
  }

  SearchExpensesList() {
    let input = (<HTMLInputElement>document.getElementById('mySearch')).value;

    return (this.searchedText = input.toUpperCase());
  }

  GetExpensesList(id: number) {
    //this.expensesList.GetExpensesList(id);
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
