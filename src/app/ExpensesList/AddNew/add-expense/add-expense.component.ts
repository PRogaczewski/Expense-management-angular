import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  newExpenseForm!: FormGroup;
  categories:any[]=[];
  submitted: boolean=false;
  success: boolean = false;
  @Input() listId?: number;
  mappedCategoires = new Map();

  constructor(private formBuilder: FormBuilder, private service: ApiService) { }

  get getComponents() {return this.newExpenseForm.controls;}

  async ngOnInit() {
    this.submitted = false;
    this.success = false;

    this.newExpenseForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: [0, Validators.required],
    })

    this.categories = await this.service.GetCategories();

    this.mappedCategoires = new Map(this.categories.map((value, index) => [index, value]));
  }

  NewExpense(){
    this.submitted = true;
    this.StringContainsComma(this.getComponents['price'].value)

    if(this.newExpenseForm.valid){
      let expenseRequest = {
        name: this.getComponents['name'].value.toString(),
        category: parseInt(this.getComponents['category'].value),
        price: parseFloat(this.getComponents['price'].value),
        userExpensesListId: this.listId!
      };
  
      this.service.AddExpense(expenseRequest);
      this.success = true;

      this.newExpenseForm.reset();
      this.submitted = false;
    }
    else{
      this.success = false;
      console.log("error 'new expense'");
    }  
  }

  StringContainsComma(value: string){
    if(value.includes(',')){
      this.newExpenseForm.setErrors({commaValidator: true})
    }
  }
}
