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
