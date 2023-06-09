import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/HelperService';
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
  @Output() public getlistComponent = new EventEmitter();

  mappedCategoires = new Map();

  // months = new Map(
  //   [
  //     [0, 'January'],
  //     [1, 'Feburary'],
  //     [2, 'March'],
  //     [3, 'April'],
  //     [4, 'May'],
  //     [5, 'June'],
  //     [6, 'July'],
  //     [7, 'August'],
  //     [8, 'September'],
  //     [9, 'October'],
  //     [10, 'Novamber'],
  //     [11, 'December'],
  //   ]
  // );
  months:Map<number,string> = new Map;

  constructor(private formBuilder: FormBuilder, private service: ApiService, private helper: HelperService) {
    this.helper.GetMonths().subscribe((data)=>{
      this.months = data;
    })
    
  }

  get components() {
    return this.newUserGoalsForm.controls;
  }

  async ngOnInit() {
    this.success = false;
    this.isNotSuccessfully = false;
    this.submitted = false;

    this.newUserGoalsForm = this.formBuilder.group({
      limit: '',
      category: [0, Validators.required],
      monthChosenForGoal: new Date().getMonth()
    });

    this.categories = await this.service.GetCategories();

    this.mappedCategoires = new Map(this.categories.map((value, index) => [index, value]));
  }

  async AddUserGoals() {
    if (this.newUserGoalsForm.valid) {

      let dateTimeMonth;

      dateTimeMonth = (parseInt(this.components['monthChosenForGoal'].value) + 1).toString() + "-" + (new Date().getDate()).toString() + '-' + (new Date().getFullYear()).toString()

      let newDate = new DatePipe('en-US').transform(dateTimeMonth, 'yyyy-MM-dd');

      let UserExpenseGoalDto = {
        userExpensesListId: this.listId!,
        userCategoryGoals:[{
          limit: this.components['limit'].value.toString(),
        category: parseInt(this.components['category'].value),
        }],
        
        monthChosenForGoal: newDate,
      };

      try{
        await this.service.AddUserGoals(UserExpenseGoalDto).then(()=>{
          try{
            this.getlistComponent.emit(this.listId);
            this.success = true;
          }
          catch(err){
            console.log(err);
            this.isNotSuccessfully = true;
          }    
        });
      }
      catch(err){
        console.log(err);
        this.isNotSuccessfully = true;
      }

      this.newUserGoalsForm.reset();
      this.submitted = false;

    } else {
      this.submitted = true;
    }
  }
}
