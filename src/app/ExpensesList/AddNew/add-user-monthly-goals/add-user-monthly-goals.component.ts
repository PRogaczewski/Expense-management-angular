import { DatePipe } from '@angular/common';
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
  isNotSuccessfully: boolean = false;

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
    console.log(this.months);
    this.success = false;
    this.isNotSuccessfully = false;
    this.submitted = false;

    this.categories = await this.service.GetCategories();

    this.newUserGoalsForm = this.formBuilder.group({
      limit: '',
      category: ['', Validators.required],
      monthChosenForGoal: ''
    });
  }

  async AddUserGoals() {
    if (this.newUserGoalsForm.valid) {

      let dateTimeMonth;

      if(!this.components['monthChosenForGoal'].value){
        dateTimeMonth = (new Date().getMonth() + 1).toString() + "-" + (new Date().getDate()).toString() + '-' + (new Date().getFullYear()).toString()
      }
      else{
        dateTimeMonth = (parseInt(this.components['monthChosenForGoal'].value) + 1).toString() + "-" + (new Date().getDate()).toString() + '-' + (new Date().getFullYear()).toString()
      }

      console.log(dateTimeMonth);
      let newDate = new DatePipe('en-US').transform(dateTimeMonth, 'yyyy-MM-dd');

      console.log(newDate);

      let UserExpenseGoalDto = {
        userExpensesListId: this.listId!,
        userCategoryGoals:[{
          limit: this.components['limit'].value.toString(),
        category: parseInt(this.components['category'].value),
        }],
        
        monthChosenForGoal: newDate,
      };

      console.log(UserExpenseGoalDto);

      if(await this.service.AddUserGoals(UserExpenseGoalDto)){
        console.log("git");
        this.success = true;
      }else{
        console.log("nie git");
        this.isNotSuccessfully = true;
      }  

      this.newUserGoalsForm.reset();
      this.submitted = false;

    } else {
      this.submitted = true;
      console.log("Aaaaaa")
    }
  }
}
