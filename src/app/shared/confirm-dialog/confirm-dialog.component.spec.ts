import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { findByInnerText } from '../test/selectors';

import { ConfirmDialogComponent, ConfirmDialogModel } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      imports: [
        MatButtonModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: new ConfirmDialogModel('my message', 'my title') }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    expect(fixture.debugElement.query(findByInnerText('my title', 'h1'))).toBeTruthy();
  });

  it('should display message', () => {
    expect(fixture.debugElement.query(findByInnerText('my message', 'div'))).toBeTruthy();
    expect(fixture.debugElement.query(findByInnerText('my message', 'h1'))).toBeFalsy();
  });

  it('should have two buttons', () => {
    expect(fixture.debugElement.queryAll(By.css('button')).length).toBe(2);
  });
});
