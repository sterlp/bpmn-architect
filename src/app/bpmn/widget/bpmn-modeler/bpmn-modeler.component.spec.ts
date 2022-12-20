import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { BpmnModelerComponent } from './bpmn-modeler.component';

describe('BpmnModelerComponent', () => {
  let component: BpmnModelerComponent;
  let fixture: ComponentFixture<BpmnModelerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmnModelerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpmnModelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
