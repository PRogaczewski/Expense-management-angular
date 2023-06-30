import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-get-expenses',
  templateUrl: './get-expenses.component.html',
  styleUrls: ['./get-expenses.component.css'],
})
export class GetExpensesComponent implements OnInit {
  expenses: any[] = [];
  page: number = 1;
  id: string | null;
  modalId: number | null = null;
  isNextPage:boolean = true;
 
  constructor(private service: ApiService, private currRoute: ActivatedRoute,private auth: AuthService,private route: Router) {
    this.id = this.currRoute.snapshot.paramMap.get('id');
  } 
  
  async ngOnInit() {
    if (!this.auth.GetUserContext()) {
      console.log('user not authenticated');
      this.route.navigate(['']);
    }

    window.addEventListener('scroll', this.OnScrollLoadData.bind(this));
    
    try {
      await this.service.GetExpenses(parseInt(this.id!)).then((res) => {
        this.expenses = res.data.items.data;
      });
    } catch (err) {
      console.log(err);
    }
  }

   async OnScrollLoadData(){

    let bottomHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - document.documentElement.clientHeight;
    let currentScroll = document.documentElement.scrollTop;

    if(bottomHeight - 250 < currentScroll && this.isNextPage){
      this.page++;
      this.isNextPage = false;
      try {
        await this.service.GetExpenses(parseInt(this.id!), this.page).then((res) => {        
          this.expenses.push(...res.data.items.data);
          this.isNextPage = true;
        });
      } catch (err) {
        console.log(err);
      }
    }
  }


  EditExpense(id: number) {
    this.modalId = id;
  }

  async DeleteExpense(id: number) {
    if(confirm("Are you sure to delete this expense?")){
      try {
        await this.service.DeleteExpense(id).then((res)=>{
          if(res.status !== 200){
            throw Error(res.status.toString());
          } else {
            //   this.service.GetExpenses(parseInt(this.id!), undefined, this.expenses.length).then((res) => {       
            //   this.expenses = [];
            //   this.expenses.push(...res.data.items.data);
            //   this.isNextPage = true;
            // });
            this.FetchData();
          }
        });
      } catch(err){
        console.log(err);
      }
      
    }
  }

  FetchData(){
      this.service.GetExpenses(parseInt(this.id!), undefined, this.expenses.length).then((res) => {       
      this.expenses = [];
      this.expenses.push(...res.data.items.data);
      this.isNextPage = true;
      });
  }

  GetDate(firstDate: any, secondDate: any) {

    if(new Date(firstDate).getMonth() != new Date(secondDate).getMonth()){
      return true
    }

    return false;
  }
}
