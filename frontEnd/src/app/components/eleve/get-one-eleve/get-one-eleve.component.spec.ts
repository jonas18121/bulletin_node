import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetOneEleveComponent } from './get-one-eleve.component';

describe('GetOneEleveComponent', () => {
  let component: GetOneEleveComponent;
  let fixture: ComponentFixture<GetOneEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetOneEleveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetOneEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
