import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetListsComponent } from './get-lists.component';

describe('GetListsComponent', () => {
  let component: GetListsComponent;
  let fixture: ComponentFixture<GetListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
