/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumericInputComponent } from './numeric-input.component';

describe('NumericInputComponent', () => {
  let component: NumericInputComponent;
  let fixture: ComponentFixture<NumericInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
