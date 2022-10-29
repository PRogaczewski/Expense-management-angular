import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-expenses-list',
  templateUrl: './add-expenses-list.component.html',
  styleUrls: ['./add-expenses-list.component.css']
})
export class AddExpensesListComponent implements OnInit {

  newExpensesList!:FormGroup

  constructor(private service: ApiService, private formBuilder: FormBuilder) { }

  get getComponents() {return this.newExpensesList.controls;}

  ngOnInit(): void {
    this.newExpensesList=this.formBuilder.group({
      name: '',
    })
  }

  AddExpensesList() {
    if(this.newExpensesList.valid) {
      let listName = {
        name: this.getComponents['name'].value};
  
        console.log(listName);

      this.service.createExpensesList(listName);
    }
    
  }

 
}
