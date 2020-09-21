import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertFormConversionTableComponent } from './convert-form-conversion-table.component';

describe('ConvertFormConversionTableComponent', () => {
  let component: ConvertFormConversionTableComponent;
  let fixture: ComponentFixture<ConvertFormConversionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertFormConversionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertFormConversionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
