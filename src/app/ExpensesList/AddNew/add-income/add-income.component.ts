import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.css'],
})
export class AddIncomeComponent implements OnInit {
  newIncomeForm!: FormGroup;
  submitted: boolean=false;
 @Input() listId?: number;

  constructor(private formBuilder: FormBuilder, private service: ApiService) {}

  get getComponents() {
    return this.newIncomeForm.controls;
  }

  ngOnInit(): void {
    this.submitted = false;
    this.newIncomeForm = this.formBuilder.group({
      income: '',
    });
  }

  AddUserIncome() {
    if (this.newIncomeForm.valid) {
      let income = {
        userExpensesListId: this.listId!,
        income: parseFloat(this.getComponents['income'].value)};

        console.log(income);
        
       this.service.AddIncome(income);

       window.location.reload();
    }
    else{
      this.submitted=true;
    }
  }
}
