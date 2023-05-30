import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './Authentication/authentication/authentication.component';
import { LoginComponent } from './Authentication/login/login.component';
import { RegisterComponent } from './Authentication/register/register.component';
import { GetListComponent } from './ExpensesList/get-list/get-list.component';
import { AddExpensesListComponent } from './ExpensesLists/CRUD/add-expenses-list/add-expenses-list.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './Account/account/account.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'ExpensesList/:id', component: GetListComponent},
  {path: 'ExpensesList', component: AddExpensesListComponent},
  {path: 'Login', component: LoginComponent},
  {path: 'Register', component: RegisterComponent},
  {path: 'Authentication', component: AuthenticationComponent},
  {path: 'Account', component: AccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
