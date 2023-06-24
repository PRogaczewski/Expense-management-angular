import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GetListsComponent } from './ExpensesLists/get-lists/get-lists.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { GetListComponent } from './ExpensesList/get-list/get-list.component';
import { HomeComponent } from './home/home.component';
import { NavbarHomeComponent } from './navbar-home/navbar-home.component';
import { AddExpenseComponent } from './ExpensesList/AddNew/add-expense/add-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddIncomeComponent } from './ExpensesList/AddNew/add-income/add-income.component';
import { AddExpensesListComponent } from './ExpensesLists/CRUD/add-expenses-list/add-expenses-list.component';
import { AddUserMonthlyGoalsComponent } from './ExpensesList/AddNew/add-user-monthly-goals/add-user-monthly-goals.component';
import { LoginComponent } from './Authentication/login/login.component';
import { RegisterComponent } from './Authentication/register/register.component';
import { AuthenticationComponent } from './Authentication/authentication/authentication.component';
import { DeleteListComponent } from './ExpensesList/delete-list/delete-list.component';
import { AccountComponent } from './Account/account/account.component';
import { GetExpensesComponent } from './ExpensesList/get-expenses/get-expenses.component';

@NgModule({
  declarations: [
    AppComponent,
    GetListsComponent,
    GetListComponent,
    HomeComponent,
    NavbarHomeComponent,
    AddExpenseComponent,
    AddIncomeComponent,
    AddExpensesListComponent,
    AddUserMonthlyGoalsComponent,
    LoginComponent,
    RegisterComponent,
    AuthenticationComponent,
    DeleteListComponent,
    AccountComponent,
    GetExpensesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [GetListsComponent, GetListComponent, NavbarHomeComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
