import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEleveComponent } from './new-eleve.component';

describe('NewEleveComponent', () => {
  let component: NewEleveComponent;
  let fixture: ComponentFixture<NewEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEleveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
