/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IdcardComponent } from './idcard.component';

describe('IdcardComponent', () => {
  let component: IdcardComponent;
  let fixture: ComponentFixture<IdcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
