import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllClasseDEcoleComponent } from './get-all-classe-d-ecole.component';

describe('GetAllClasseDEcoleComponent', () => {
  let component: GetAllClasseDEcoleComponent;
  let fixture: ComponentFixture<GetAllClasseDEcoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllClasseDEcoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAllClasseDEcoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
