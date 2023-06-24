import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetExpensesComponent } from './get-expenses.component';

describe('GetExpensesComponent', () => {
  let component: GetExpensesComponent;
  let fixture: ComponentFixture<GetExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
