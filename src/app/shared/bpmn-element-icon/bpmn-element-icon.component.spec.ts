import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { BpmnElementIconComponent } from './bpmn-element-icon.component';

describe('BpmnElementIconComponent', () => {
  let component: BpmnElementIconComponent;
  let fixture: ComponentFixture<BpmnElementIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmnElementIconComponent ],
      imports:[MatIconModule] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpmnElementIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
