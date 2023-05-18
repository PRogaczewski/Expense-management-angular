import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../AuthService';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
readonly port = "5800"
//7165
readonly HomeApiUrl="https://localhost:" + this.port + "/Home/";
readonly AnalysisApiUrl = "https://localhost:" + this.port + "/ExpensesList/";
categories=[];

  constructor(private httpClient:HttpClient, private authService: AuthService) {
    axios.interceptors.request.use(
    config => {
      if(config && config.headers){
        
        const token = authService.GetToken();

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
} 

  //Lists
  //---------------------------------------
  async GetCategories(){
    const {data:categories} = await axios.get(this.HomeApiUrl + 'GetCategories');
    return categories;
  }

  async GetExpensesLists(){
    return await axios.get(this.HomeApiUrl);
  }

  async CreateExpensesList(name: any){
    await axios.post(this.HomeApiUrl, name);
  }

  async DeleteExpensesList(id: number){
    await axios.delete(this.HomeApiUrl + id);
  }

  //Expenses
  //--------------------------------------
  async GetExpensesList(id: number){
    return await axios.get(this.AnalysisApiUrl + id);
  }

  async GetExpensesInCurrentMonth(id: number, month: string){
    return await axios.get(this.AnalysisApiUrl + "TotalInMonthByCategories/" + id + "?month=" + month);
  }

  async AddIncome(income:any){
    return axios.post(this.AnalysisApiUrl + 'UserIncome', income);
  }

  async AddExpense(expense:any){
    return axios.post(this.AnalysisApiUrl, expense);
  }

  async AddUserGoals(UserExpenseGoalDto: any){
    return axios.post(this.AnalysisApiUrl + 'ExpensesMonthlyGoal', UserExpenseGoalDto);
  }
}
