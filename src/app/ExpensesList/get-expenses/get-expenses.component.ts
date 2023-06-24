import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-get-expenses',
  templateUrl: './get-expenses.component.html',
  styleUrls: ['./get-expenses.component.css'],
})
export class GetExpensesComponent implements OnInit {
  expenses: any[] = [];
  page: number = 0;
  id: string | null;
  isNextPage:boolean = true;
 
  constructor(private service: ApiService, private currRoute: ActivatedRoute) {
    this.id = this.currRoute.snapshot.paramMap.get('id');
  }

  async ngOnInit() {

    window.addEventListener('scroll', this.OnScrollLoadData.bind(this));
    
    try {
      await this.service.GetExpenses(parseInt(this.id!)).then((res) => {
        this.expenses = res.data;
      });
    } catch (err) {
      console.log(err);
    }
  }

   async OnScrollLoadData(){

    // if(nativeElement.clientHeight + Math.round(nativeElement.scrollTop) === nativeElement.scrollHeight){
    //       console.log("down")
    // }
    let bottomHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - document.documentElement.clientHeight;
    let currentScroll = document.documentElement.scrollTop;

    if(bottomHeight - 250 < currentScroll && this.isNextPage){
      this.page++;
      this.isNextPage = false;
      try {
        await this.service.GetExpenses(parseInt(this.id!), this.page).then((res) => {        
          this.expenses.push(...res.data);
          this.isNextPage = true;
        });
      } catch (err) {
        console.log(err);
      }
    }
  }


  EditExpense(id: number) {
    console.log(id);
  }

  DeleteExpense(id: number) {
    if(confirm("Are you sure to delete this expense?")){
      console.log(id);
    }
  }

  GetDate(firstDate: any, secondDate: any) {

    if(new Date(firstDate).getMonth() != new Date(secondDate).getMonth()){
      return true
    }

    return false;
  }
}
