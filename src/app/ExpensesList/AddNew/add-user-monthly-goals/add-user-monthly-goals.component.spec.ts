import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserMonthlyGoalsComponent } from './add-user-monthly-goals.component';

describe('AddUserMonthlyGoalsComponent', () => {
  let component: AddUserMonthlyGoalsComponent;
  let fixture: ComponentFixture<AddUserMonthlyGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserMonthlyGoalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserMonthlyGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
