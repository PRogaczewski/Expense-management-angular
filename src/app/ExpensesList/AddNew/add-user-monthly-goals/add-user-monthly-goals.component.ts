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

//   months = [
//   {value:'January', key:1},
//   {value:'Feburary', key:2},
//   {value:'March', key:3},
//   {value:'April', key:4},
//   {value:'May', key:5},
//   {value:'June', key:6},
//   {value:'July', key:7},
//   {value:'August', key:8},
//   {value:'September', key:9},
//   {value:'October', key:10},
//   {value:'Novamber', key:11},
//   {value:'December', key:12}
// ]

months = [
  'January',
  'Feburary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'Novamber',
  'December'
]

  constructor(private formBuilder: FormBuilder, private service: ApiService) {}

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
      month: ['']
    });
  }

  AddUserGoals() {
    if (this.newUserGoalsForm.valid) {
      let goalRequest = {
        limit: this.components['limit'].value.toString(),
        category: parseInt(this.components['category'].value),
        month: (parseInt(this.components['month'].value) + 1).toString() + '-' + (new Date().getFullYear()).toString() ,
        userExpensesListId: this.listId!,
      };

      if(!goalRequest.month){
        console.log("adafaga")
        goalRequest.month = (new Date().getMonth() + 1).toString() + '-' + (new Date().getFullYear()).toString();
      }

      console.log(goalRequest);
      console.log((new Date().getMonth() + 1).toString() + '-' + (new Date().getFullYear()).toString());

      this.service.AddUserGoals(goalRequest);

      this.success = true;
    } else {
      this.submitted = true;
      console.log("Aaaaaa")
    }
  }
}
