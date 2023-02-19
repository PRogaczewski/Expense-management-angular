import { NONE_TYPE } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BarController,
  PieControllerChartOptions,
  BarElement,
  CategoryScale,
  Chart,
  Decimation,
  Filler,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  registerables,
  PieController,
  ArcElement,
  ChartConfiguration,
  BubbleController,
} from 'chart.js';
import { ApiService } from 'src/app/services/api.service';
import { __values } from 'tslib';
import { AddUserMonthlyGoalsComponent } from '../AddNew/add-user-monthly-goals/add-user-monthly-goals.component';

@Component({
  selector: 'app-get-list',
  templateUrl: './get-list.component.html',
  styleUrls: ['./get-list.component.css'],
})
export class GetListComponent implements OnInit {
  expensesList: any;
  monthlyCharts:any[]=[];

  currMonth = new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear().toString();
  colors: any[]=['rgb(28, 185, 28)','rgb(232, 9, 240)', 'rgb(239, 240, 9)', 'rgb(245, 154, 18)', 'rgb(240, 9, 9)', 'rgb(174, 9, 240)', 'rgb(92, 228, 148)', 'rgb(3, 5, 124)', 'rgb(48, 116, 65)', 'rgb(153, 144, 65)', 'rgb(4, 35, 211)', 'rgb(165, 5, 93)',  'rgb(248, 162, 92)', 'rgb(138, 230, 95)', 'rgb(98, 243, 243)', 'rgb(122, 35, 122)', 'rgb(81, 107, 179)', 'rgb(128, 44, 44)', 'rgb(133, 175, 35)'];

  curr = new Date;
  first = this.curr.getDate() - this.curr.getDay() + (this.curr.getDay()===0 ? -6:1);

  last = this.first + 6;

  firstday = new Date(this.curr.setDate(this.first)).toLocaleString('default', {day: '2-digit'});
  lastday = new Date(this.curr.setDate(this.last)).toLocaleString('default', {day: '2-digit'});
  currWeek = this.firstday + ' - ' + this.lastday + '.' + (new Date().getMonth() + 1).toString();

  currentId?: number;
  isMonthlyGoal:boolean = false;
  isCompareMonths:boolean = false;
  weeklyExpenses: number = 0;

  @ViewChild(AddUserMonthlyGoalsComponent) monthlyGoalsComponent:any;

  constructor(
    private service: ApiService,
    //private nav: NavbarHomeComponent,
    private currRoute: ActivatedRoute,
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
  }

  async InitializeValues(){
    let id = this.currRoute.snapshot.paramMap.get('id');
    await this.GetExpensesList(parseInt(id!));

    this.SummaryChart();
    this.CurrentWeekExpensesChart();
    this.CurrentMonthByCategoriesChart();
    this.MonthlyGoals(); 

    this.currentId=parseInt(id!);
  }

  async ngOnInit() {

    await this.InitializeValues();
    
    if(this.curr.getDate() >= 25 && this.expensesList.userGoals != null){
    }
  }

  async GetExpensesList(id: number) {
    await this.service.GetExpensesList(id).then((res) => {
      console.log(res.data);
      this.expensesList = res.data;
    });
  }

  SummaryChart(){
    var pieChartResult;

    if (this.expensesList.monthlyResult < 0) {
      pieChartResult = 0;
      var summary = document.getElementById('summary') as HTMLElement;
      summary.setAttribute('style', 'color: red')
    } else {
      pieChartResult = this.expensesList.monthlyResult;
    }

    var myChart = new Chart('PieChartSummary', {
      type: 'pie',
      data: {
        labels: ['Summary', 'Outgoings'],
        datasets: [
          {
            label: 'Weekly summary',
            data: [
              pieChartResult,
              this.expensesList.outgoings,
            ],
            backgroundColor: ['#1fd655', 'rgb(255, 99, 132)'],
            hoverOffset: 4,
          },
        ],
      },
    });
  }

  CurrentMonthByCategoriesChart(){
    const labels: any[]=[];
    const data: any[]=[];

    Object.entries(this.expensesList.totalMonthByCategories).forEach(
      ([key, value]) => {
        labels.push(key);
        data.push(value);
      }
    );

    var myChart = new Chart('MonthExpensesChart', {
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
      options:{
        plugins:{
          legend:{
            display:false,
          },
      }
    },
    });
  }

  CurrentWeekExpensesChart(){
    const labels: any[]=[];
    const data: any[]=[];

    Object.entries(this.expensesList.currentWeekByCategories).forEach(
      ([key, value]) => {
        labels.push(key);
        data.push(value);

        if(typeof value==='number'){
          this.weeklyExpenses += value;
        }
        
      }
    );

    var myChart = new Chart('WeekExpensesChart', {
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

  MonthlyGoals(){
    
    var maxValue:number = 0;
    const enumColors =['rgb(28, 185, 28)', 'rgb(245, 154, 18)', 'rgb(240, 9, 9)'];

    let getColors: any = enumColors[2];

    Object.entries(this.expensesList.userGoals).forEach(
      ([secKey, secValue]) => {

        if((secKey in this.expensesList.userExpenses)==false){
          this.expensesList.userExpenses[secKey] = 0;
        }

        const labels: any[]=[];
        const data: any[]=[];

        labels.push(secKey);

        Object.entries(this.expensesList.userExpenses).forEach(
          ([key, value]) => {
            if(key === secKey){
              if(typeof value === 'number' && typeof secValue === 'number') {

                data.push(value);
                maxValue = secValue;

                  if(value <= secValue*0.6){
                    getColors = enumColors[0];
                  }
                  else if(value <= secValue*0.9){
                    getColors = enumColors[1];
                  }

                    var canvas = document.createElement('canvas'),
                    chartId = 'chart' + secKey.toString();
                    canvas.id = chartId;
                    document.getElementById("goalCharts")?.appendChild(canvas)
                    var element = document.getElementById(chartId)! as HTMLCanvasElement;
                    var context = element.getContext('2d')!;

                    var newChart = new Chart(context, {
                      type: 'bar',
                      data: {
                            labels: labels,
                            datasets: [{
                                indexAxis: 'y',
                                data: data,
                                backgroundColor: getColors,
                                barThickness: 15,
                                borderWidth: 1,
                              }],
                          },
                      options:{
                            indexAxis: 'y',
                            maintainAspectRatio: false,
                            plugins:{
                              legend:{
                                display:false,
                              },
                            },
                            scales:{
                              x:{
                                min: 0,
                                max: maxValue,
                                ticks:{
                                  maxTicksLimit: 3,
                                  callback(tickValue, index, ticks) {
                                    if(index === 2){
                                      return tickValue + '.00 PLN Limit';
                                    }
                                    else if(index == 1){
                                      return value + ' PLN';
                                    }
                                    return tickValue + '.00 PLN';
                                  },
                                }
                              }
                            },
                          }
                    })
              }
            }
          });   
      });
  }
}