import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-user-monthly-goals',
  templateUrl: './add-user-monthly-goals.component.html',
  styleUrls: ['./add-user-monthly-goals.component.css'],
})
export class AddUserMonthlyGoalsComponent implements OnInit {
  @Input() listId?: number;
  newUserGoalsForm!: FormGroup;
  categories: any[] = [];
  submitted: boolean = false;
  success: boolean = false;

  months = [{value:'January', key:0},
  {value:'Feburary', key:1},
  {value:'March', key:2},
  {value:'April', key:3},
  {value:'May', key:4},
  {value:'June', key:5},
  {value:'July', key:6},
  {value:'August', key:7},
  {value:'September', key:8},
  {value:'October', key:9},
  {value:'Novamber', key:10},
  {value:'December', key:11}
]


  constructor(private formBuilder: FormBuilder, private service: ApiService) {}

  month = new Date().toLocaleString('default', { month: 'long' });

  get components() {
    return this.newUserGoalsForm.controls;
  }

  async ngOnInit() {
    this.success = false;
    this.submitted = false;

    this.categories = await this.service.GetCategories();

    this.newUserGoalsForm = this.formBuilder.group({
      limit: '',
      category: ['', Validators.required],
    });
  }

  AddUserGoals() {
    if (this.newUserGoalsForm.valid) {
      let goalRequest = {
        limit: this.components['limit'].value.toString(),
        category: parseInt(this.components['category'].value),
        userExpensesListId: this.listId!,
      };

      console.log(goalRequest);

      this.service.AddUserGoals(goalRequest);

      this.success = true;
    } else {
      this.submitted = true;
    }
  }
}
