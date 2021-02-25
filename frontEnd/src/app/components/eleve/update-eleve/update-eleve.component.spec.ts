import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEleveComponent } from './update-eleve.component';

describe('UpdateEleveComponent', () => {
  let component: UpdateEleveComponent;
  let fixture: ComponentFixture<UpdateEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEleveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
