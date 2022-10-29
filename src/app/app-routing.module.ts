import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetListComponent } from './ExpensesList/get-list/get-list.component';
import { AddExpensesListComponent } from './ExpensesLists/CRUD/add-expenses-list/add-expenses-list.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'ExpensesList/:id', component: GetListComponent},
  {path: 'ExpensesList', component: AddExpensesListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
