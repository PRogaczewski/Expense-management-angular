import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpensesListComponent } from './add-expenses-list.component';

describe('AddExpensesListComponent', () => {
  let component: AddExpensesListComponent;
  let fixture: ComponentFixture<AddExpensesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpensesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
