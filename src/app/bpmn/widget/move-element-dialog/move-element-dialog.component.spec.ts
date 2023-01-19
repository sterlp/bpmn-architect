import { NoopAnimationPlayer } from '@angular/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MoveElementDialogComponent } from './move-element-dialog.component';

describe('MoveElementDialogComponent', () => {
  let component: MoveElementDialogComponent;
  let fixture: ComponentFixture<MoveElementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveElementDialogComponent ],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatInputModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveElementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
