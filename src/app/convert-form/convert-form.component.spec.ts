import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertFormComponent } from './convert-form.component';

describe('ConvertFormComponent', () => {
  let component: ConvertFormComponent;
  let fixture: ComponentFixture<ConvertFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
