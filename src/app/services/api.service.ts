import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
readonly HomeApiUrl="https://localhost:7165/Home/";
readonly AnalysisApiUrl = "https://localhost:7165/ExpensesList/"
expensesLists=[];
categories=[];

  constructor(private httpClient:HttpClient) { }

  //Lists
  async GetCategories(){
    const {data:categories} = await axios.get(this.HomeApiUrl + 'enum')
    return categories;
  }
  async GetExpensesLists(){
    const{data:expensesLists}=await axios.get(this.HomeApiUrl);
    return expensesLists;
  }

  async createExpensesList(name: any){
    await axios.post(this.HomeApiUrl, name);
  }


  //Expenses
  async GetExpensesList(id: number){
    return await axios.get(this.AnalysisApiUrl + id)
  }

  async AddIncome(income:any){
    return axios.post(this.AnalysisApiUrl + 'UserIncome', income)
  }

  async AddExpense(expense:any){
    return axios.post(this.AnalysisApiUrl, expense)
  }

  async AddUserGoals(UserExpenseGoalDto: any){
    return axios.post(this.AnalysisApiUrl + 'ExpensesMonthlyGoal', UserExpenseGoalDto)
  }
}
