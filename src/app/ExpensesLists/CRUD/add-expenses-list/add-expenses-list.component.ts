import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-expenses-list',
  templateUrl: './add-expenses-list.component.html',
  styleUrls: ['./add-expenses-list.component.css'],
})
export class AddExpensesListComponent implements OnInit {
  newExpensesList!: FormGroup;
  submitted: boolean = false;

  constructor(private service: ApiService, private formBuilder: FormBuilder,  private route: Router,) {}

  get getComponents() {
    return this.newExpensesList.controls;
  }

  ngOnInit(): void {
    this.submitted = false;

    this.newExpensesList = this.formBuilder.group({
      name: '',
    });
  }

  async AddExpensesList() {
    if (this.newExpensesList.valid) {
      let listName = {
        name: this.getComponents['name'].value,
      };

      try{
        await this.service.CreateExpensesList(listName);
        this.route.navigate(['']);
      }
      catch(err){
        console.log(err);
      }
    } else {
      this.submitted = true;
    }
  }
}
