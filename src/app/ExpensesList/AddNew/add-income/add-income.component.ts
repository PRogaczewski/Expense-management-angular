import { Component, EventEmitter, Input, OnInit,Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  @Output() public getlistComponent = new EventEmitter();

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

  async AddUserIncome() {
    this.StringContainsComma(this.getComponents['income'].value)

    if (this.newIncomeForm.valid) {
      let income = {
        userExpensesListId: this.listId!,
        income: parseFloat(this.getComponents['income'].value)};

        try{
          await this.service.AddIncome(income).then(()=>{
            try{
              this.getlistComponent.emit(this.listId)
            }
            catch(err){
              console.log(err)
            }
          });

          //window.location.reload();
        }
        catch(err){
          console.log(err)
        }
      
    }
    else{
      this.submitted=true;
    }
  }

  StringContainsComma(value: string){
    if(value.includes(',')){
      this.newIncomeForm.setErrors({commaValidator: true})
    }
  }
}
