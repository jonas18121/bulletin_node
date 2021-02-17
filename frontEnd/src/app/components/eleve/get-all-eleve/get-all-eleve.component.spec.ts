import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllEleveComponent } from './get-all-eleve.component';

describe('GetAllEleveComponent', () => {
  let component: GetAllEleveComponent;
  let fixture: ComponentFixture<GetAllEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllEleveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAllEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
