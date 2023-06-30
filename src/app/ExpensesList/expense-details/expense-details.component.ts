import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css'],
})
export class ExpenseDetailsComponent implements OnInit {
  getExpenseForm!: FormGroup;
  categories: any[] = [];
  success: boolean = false;
  @Input() id: number | null = null;
  @Output() fetchData = new EventEmitter();
  mappedCategoires = new Map();

  constructor(private formBuilder: FormBuilder, private service: ApiService, private route: Router) {}

  get getComponents() {
    return this.getExpenseForm.controls;
  }

  async ngOnChanges() {
    if (this.id !== null) {
      const record = await this.service.GetExpense(this.id);

      this.getExpenseForm = this.formBuilder.group({
        name: record.data.name,
        price: record.data.price,
        category: this.categories.findIndex(x=>x == record.data.category)
      });
    }
  }

  async ngOnInit() {
    this.success = false;

    this.getExpenseForm = this.formBuilder.group({
      name: [''],
      price: ['', Validators.required],
      category: [0, Validators.required],
    });

    this.categories = await this.service.GetCategories();
    this.mappedCategoires = new Map(
      this.categories.map((value, index) => [index, value])
    );
  }

  async UpdateExpense() {
    this.StringContainsComma(this.getComponents['price'].value.toString());

    if(this.getExpenseForm.valid && this.getComponents['price'].value >= 0 && this.id !== null){
      let expenseRequest = {
        name: this.getComponents['name'].value.toString(),
        category: parseInt(this.getComponents['category'].value),
        price: parseFloat(this.getComponents['price'].value),
        userExpensesListId: parseInt(this.route.url.split('/')[2]!)
      };

      try{
        await this.service.UpdateExpense(this.id, expenseRequest).then((res)=>{
          if(res.status === 200){
            document.getElementById('closeBtn')!.click();

            this.fetchData.emit();
          } else {
            throw Error(res.status.toString())
          }
        });
      } catch(err){
        console.log(err);
      }
    }
  }

  StringContainsComma(value: string){
    if(value.includes(',')){
      this.getExpenseForm.setErrors({commaValidator: true})
    }
  }
}
