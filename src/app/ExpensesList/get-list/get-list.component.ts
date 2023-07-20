import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Decimation,
  Filler,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  PieController,
  ArcElement,
} from 'chart.js';
import { AuthService } from 'src/app/AuthService';
import { ApiService } from 'src/app/services/api.service';
import { __values } from 'tslib';
import { AddUserMonthlyGoalsComponent } from '../AddNew/add-user-monthly-goals/add-user-monthly-goals.component';
import { HelperService } from 'src/app/HelperService';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-get-list',
  templateUrl: './get-list.component.html',
  styleUrls: ['./get-list.component.css'],
})
export class GetListComponent implements OnInit {
  expensesList: any;
  monthlyCharts: any[] = [];

  currMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  prevMonth: number = 0;
  totalOutgoings: number = 0;
  isBetterMonth: boolean = false;

  colors: string[] = [
    'rgb(28, 185, 28)',
    'rgb(232, 9, 240)',
    'rgb(239, 240, 9)',
    'rgb(245, 154, 18)',
    'rgb(240, 9, 9)',
    'rgb(174, 9, 240)',
    'rgb(92, 228, 148)',
    'rgb(3, 5, 124)',
    'rgb(48, 116, 65)',
    'rgb(153, 144, 65)',
    'rgb(4, 35, 211)',
    'rgb(165, 5, 93)',
    'rgb(248, 162, 92)',
    'rgb(138, 230, 95)',
    'rgb(98, 243, 243)',
    'rgb(122, 35, 122)',
    'rgb(81, 107, 179)',
    'rgb(128, 44, 44)',
    'rgb(133, 175, 35)',
  ];

  curr = new Date();
  first = this.curr.getDate() - this.curr.getDay() + (this.curr.getDay() === 0 ? -6 : 1);
  last = this.first + 6;

  firstday = new Date(this.curr.setDate(this.first)).toLocaleString('default', {day: '2-digit',});
  lastday = new Date(this.curr.setDate(this.last)).toLocaleString('default', {day: '2-digit',});
  month =
    parseInt(this.lastday) > parseInt(this.firstday) || this.curr.getDay() >= 0
      ? new Date().getMonth() + 1
      : new Date().getMonth() + 0;
  currWeek = this.firstday + ' - ' + this.lastday + '.' + this.month.toString();

  currentId?: number;
  isMonthlyGoal: boolean = false;
  isCompareMonths: boolean = false;
  weeklyExpenses: number = 0;

  summaryChart!: Chart<"pie", any[], string>;
  monthSummaryChart!: Chart<"bar", any[], string>;
  annualSummaryChart!: Chart<"bar", any[], string>;
  weekSummaryChart!: Chart<"doughnut", any[], string>;

  months:Map<number,string> = new Map;
  SelectMonthSummaryForm!: FormGroup;

  @ViewChild(AddUserMonthlyGoalsComponent) monthlyGoalsComponent: any;

  constructor(
    private formBuilder: FormBuilder,
    private service: ApiService,
    private route: Router,
    private currRoute: ActivatedRoute,
    private auth: AuthService,
    private helper: HelperService
  ) {
    Chart.register(
      BarElement,
      PieController,
      ArcElement,
      BarController,
      LinearScale,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip
    );

    this.helper.GetMonths().subscribe((data)=>{
      this.months = data;
    })
  }

get components(){
  return this.SelectMonthSummaryForm.controls;
}

  async InitializeValues() {
    let id = this.currRoute.snapshot.paramMap.get('id');
    this.currentId = parseInt(id!);

    await this.GetExpensesList(parseInt(id!));

    if(this.expensesList !== undefined){

      this.prevMonth = this.expensesList.previousMonthTotalResult - this.expensesList.outgoings;

      if(this.prevMonth < 0){
        this.prevMonth = (this.prevMonth * -1)
        this.isBetterMonth = false;
      }
      else{
        this.isBetterMonth = true;
      }

      if(this.expensesList.outgoings !== 0 || this.expensesList.monthlyResult !== 0) {
        this.SummaryChart();
      } else {
        let element = document.getElementById('noDataPieChartSummary') as HTMLInputElement;
        element.style.display = 'block'
      }
      
      if(Object.keys(this.expensesList.totalMonthByCategories).length > 0){
        this.CurrentMonthByCategoriesChart();
      } else {
        let element = document.getElementById('noDataMonthExpensesChart') as HTMLInputElement;
        element.style.display = 'block'
      }

      if(Object.keys(this.expensesList.annualSummary).length > 0){
        this.AnnualSummaryChart();
      } else {
        let element = document.getElementById('noDataAnnualSummaryChart') as HTMLInputElement;
        element.style.display = 'block'
      }

      if(Object.keys(this.expensesList.currentWeekByCategories).length > 0){
        this.CurrentWeekExpensesChart();
      } else {
        let element = document.getElementById('noDataWeekExpensesChart') as HTMLInputElement;
        element.style.display = 'block'
      }
     
      if(Object.keys(this.expensesList.userGoals).length > 0){
        this.MonthlyGoals();
      } else {
        let element = document.getElementById('noDataMonthlyGoals') as HTMLInputElement;
        element.style.display = 'block'
      }
    }
  }

  async ngOnInit() {
    this.SelectMonthSummaryForm = this.formBuilder.group({
      month: new Date().getMonth()
    });

    if (!this.auth.GetUserContext()) {
      console.log('user not authenticated');
      this.route.navigate(['']);
    }
    await this.InitializeValues();
  }

  async GetCurrentMonth(){
    let month = parseInt(this.components['month'].value) + 1;

    try{
        await this.service.GetExpensesInCurrentMonth(this.currentId!, month.toString()).then((res)=>{

        this.expensesList.totalMonthByCategories = res.data.monthSummary;

        if(this.monthSummaryChart!==undefined){
          this.monthSummaryChart.destroy();
        }
        
        if(Object.keys(this.expensesList.totalMonthByCategories).length > 0) {
          this.CurrentMonthByCategoriesChart();
          let element2 = document.getElementById('noDataMonthExpensesChart') as HTMLInputElement;
          element2.style.display = 'none'
        } else {
          let element2 = document.getElementById('noDataMonthExpensesChart') as HTMLInputElement;
          element2.style.display = 'block'
        }      
      });
    }
    catch(err){
      console.log(err )
    }   
  }

  async GetExpensesList(id: number) {
    try {
      await this.service.GetExpensesList(id).then((res) => {

        if(res.status !== 200){
          throw Error(res.status.toString());
        } else {
          this.expensesList = res.data;
        }
      });

    } catch (err) {
      console.log(err);
    }
  }

  async UpdateCharts(id: number) {
    await this.GetExpensesList(id);
    var pieChartResult;
    var summary = document.getElementById('summary') as HTMLElement;

    if (this.expensesList === undefined || this.expensesList.monthlyResult < 0) {
      pieChartResult = 0;
      summary.setAttribute('style', 'color: red');
    } else {
      pieChartResult = this.expensesList.monthlyResult;
      summary.setAttribute('style', 'color: black');
    }

    if(this.summaryChart === undefined) {
      let element = document.getElementById('noDataPieChartSummary') as HTMLInputElement;
      element.style.display = 'none';

      this.SummaryChart();
    } else {
      this.summaryChart.data.datasets[0].data[0] = pieChartResult;
      this.summaryChart.data.datasets[0].data[1] = this.expensesList.outgoings;
  
      this.summaryChart.update();
    }

    if(this.annualSummaryChart !== undefined){
      this.annualSummaryChart.destroy();
    } 
    
    this.AnnualSummaryChart();

    if(this.annualSummaryChart !== undefined && document.getElementById('noDataAnnualSummaryChart')?.style.display === 'block') {
      let element = document.getElementById('noDataAnnualSummaryChart') as HTMLInputElement;
      element.style.display = 'none';
    }
    
    this.prevMonth = this.expensesList.previousMonthTotalResult - this.expensesList.outgoings;
    if(this.prevMonth < 0){
      this.prevMonth = this.prevMonth * -1
      this.isBetterMonth = false;
    }
    else{
      this.isBetterMonth = true;
    }

    if(this.monthSummaryChart !== undefined){
      this.monthSummaryChart.destroy();
    } else {
      let element = document.getElementById('noDataMonthExpensesChart') as HTMLInputElement;
      element.style.display = 'none';
    }

    this.CurrentMonthByCategoriesChart();

    if(this.weekSummaryChart !== undefined){
      this.weekSummaryChart.destroy();
      this.weeklyExpenses = 0;
    } else {
      let element = document.getElementById('noDataWeekExpensesChart') as HTMLInputElement;
      element.style.display = 'none';
    }
   
    this.CurrentWeekExpensesChart();

    const element = document.getElementById('chart');
    if(element){
        element.innerHTML = '';
    }

    this.MonthlyGoals();
    
    if(element?.querySelector('div') !== null) {
      let element = document.getElementById('noDataMonthlyGoals') as HTMLInputElement;
      element.style.display = 'none';
    }
  }

  SummaryChart() {
    var pieChartResult;

    if (this.expensesList === undefined || this.expensesList.monthlyResult < 0) {
      pieChartResult = 0;
      var summary = document.getElementById('summary') as HTMLElement;
      summary.setAttribute('style', 'color: red');
    } else {
      pieChartResult = this.expensesList.monthlyResult;
    }

    this.summaryChart = new Chart('PieChartSummary', {
      type: 'pie',
      data: {
        labels: ['Summary', 'Outgoings'],
        datasets: [
          {
            label: 'Weekly summary',
            data: [pieChartResult, this.expensesList.outgoings],
            backgroundColor: ['#1fd655', 'rgb(255, 99, 132)'],
            hoverOffset: 4,
          },
        ],
      },
    });
  }

  CurrentMonthByCategoriesChart() {
    const labels: any[] = [];
    const data: any[] = [];

    Object.entries(this.expensesList.totalMonthByCategories).forEach(
      ([key, value]) => {
        labels.push(key);
        data.push(value);
      }
    );

    this.monthSummaryChart = new Chart('MonthExpensesChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Month expenses',
            data: data,
            backgroundColor: this.colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  AnnualSummaryChart() {
    const labels: any[] = [];
    const data: any[] = [];
    const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December' ];

    Object.entries(this.expensesList.annualSummary).forEach(
      ([key, value]) => {
       
        const monthName = monthNames[Number(key)-1];
        labels.push(monthName);
        data.push(value);
      }
    );

    this.annualSummaryChart = new Chart('AnnualSummaryChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total expenses in month',
            data: data,
            backgroundColor: "#b3e0ff",
            borderColor: "#66c2ff",
            borderWidth: 3,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  CurrentWeekExpensesChart() {
    const labels: any[] = [];
    const data: any[] = [];

    Object.entries(this.expensesList.currentWeekByCategories).forEach(
      ([key, value]) => {
        labels.push(key);
        data.push(value);

        if (typeof value === 'number') {
          this.weeklyExpenses += value;
        }
      }
    );

    this.weekSummaryChart = new Chart('WeekExpensesChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly summary',
            data: data,
            backgroundColor: this.colors,
            hoverOffset: 4,
          },
        ],
      },
    });
  }

  MonthlyGoals() {
    var maxValue: number = 0;
    const enumColors = [
      'rgb(28, 185, 28)',
      'rgb(245, 154, 18)',
      'rgb(240, 9, 9)',
    ];

    let elementHeight = document.getElementById('chartHeight') as HTMLInputElement;

    Object.entries(this.expensesList.userGoals).forEach(
      ([secKey, secValue]) => {
        if (secKey in this.expensesList.userExpenses == false) {
          this.expensesList.userExpenses[secKey] = 0;
        }

        const labels: any[] = [];
        const data: any[] = [];

        labels.push(secKey);

        Object.entries(this.expensesList.userExpenses).forEach(
          ([key, value]) => {
            if (key === secKey) {
              if (typeof value === 'number' && typeof secValue === 'number') {
                data.push(value);
                maxValue = secValue;
                let getColors: string = enumColors[2];

                if (value <= secValue * 0.6) {
                  getColors = enumColors[0];
                } else if (value <= secValue * 0.9) {
                  getColors = enumColors[1];
                }

                let barPr: number;
                barPr = Math.round((value / secValue) * 100 * 100) / 100;

                let maxPr = barPr > 100 ? 100 : barPr;
                let element = document.getElementById('chart') as HTMLInputElement;
                
                elementHeight.style.height +=650;

                if (element != null) {
                  const mainLabel = document.createElement('h5');

                  mainLabel.textContent = key + ' ' + barPr + '%';
                  mainLabel.className = 'category';

                  const firstDiv = document.createElement('div');
                  firstDiv.style.background = 'rgb(226, 226, 226)';
                  firstDiv.style.width = '100%';
                  firstDiv.style.height = '30px';

                  const innerWrapper = document.createElement('div');
                  innerWrapper.style.height = '30px';
                  innerWrapper.style.width = `${maxPr}%`;
                  innerWrapper.style.backgroundColor = getColors;
                  firstDiv.appendChild(innerWrapper);

                  const labelWrapper = document.createElement('div');
                  labelWrapper.style.marginTop = '1%';

                  const label1 = document.createElement('label');
                  label1.style.width = '33.33%';
                  label1.style.textAlign = 'left';
                  label1.textContent = '0,00 PLN';
                  labelWrapper.appendChild(label1);

                  const label2 = document.createElement('label');
                  label2.style.width = '33.33%';
                  label2.style.textAlign = 'center';
                  label2.textContent = `${value} PLN`;
                  labelWrapper.appendChild(label2);

                  const label3 = document.createElement('label');
                  label3.style.width = '33.33%';
                  label3.style.textAlign = 'right';
                  label3.textContent = `${secValue} PLN`;
                  labelWrapper.appendChild(label3);
                  const remainingAmount = document.createElement('label');
                  remainingAmount.style.fontSize = '1.1rem';
                  remainingAmount.textContent = `Remaining amount: ${(secValue - value).toFixed(2)} PLN`;

                  element.appendChild(mainLabel);
                  element.appendChild(firstDiv);
                  element.appendChild(labelWrapper);
                  element.appendChild(remainingAmount);
                  element.appendChild(document.createElement('hr'));
                }
              }
            }
          }
        );
      }
    );
    const lastHrEl = document.getElementById('chart');

    if (lastHrEl != null && lastHrEl.lastChild?.nodeName === 'HR') {
      lastHrEl.removeChild(lastHrEl.lastChild!);
    }
  }
}
