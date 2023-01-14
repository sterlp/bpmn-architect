import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { findByInnerText } from 'src/app/shared/test/selectors';
import { AppDbService } from '../../service/app-db.service';
import { BpmnDiagramService } from '../../service/bpmn-diagram.service';
import { BpmnElementService } from '../../service/bpmn-element.service';
import { BpmnModelerComponent } from './bpmn-modeler.component';

describe('BpmnModelerComponent', () => {
  let component: BpmnModelerComponent;
  let fixture: ComponentFixture<BpmnModelerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmnModelerComponent ],
      providers: [BpmnElementService, BpmnDiagramService, AppDbService],
    })
    .compileComponents();
    
    await TestBed.inject(AppDbService).clear();
    TestBed.inject(BpmnDiagramService);
    fixture = TestBed.createComponent(BpmnModelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await component.ngAfterContentInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display bpmn-js empty diagram', async () => {
    // GIVEN
    await fixture.whenStable();
    // THEN
    expect(fixture.debugElement.queryAll(By.css('.djs-group')).length).toBeGreaterThanOrEqual(1);
    expect(fixture.debugElement.queryAll(By.css('.djs-palette-entries')).length).toBeGreaterThanOrEqual(1);
    
  });

  it('should display diagram', async () => {
    // GIVEN
    expect(fixture.debugElement.queryAll(By.css('.djs-group')).length).toBeGreaterThanOrEqual(1);
    const d1 = await TestBed.inject(BpmnDiagramService).newDiagram('Diagram1', diagram1);
    // WHEN
    component.doOpen(d1);
    await fixture.whenStable();
    fixture.detectChanges();
    // THEN
    expect(fixture.debugElement.queryAll(By.css('.djs-group')).length).toBeGreaterThanOrEqual(3);
  });

  it('should diplay diagram link', async () => {
    // GIVEN
    const diagramService = TestBed.inject(BpmnDiagramService);
    await diagramService.newDiagram('Diagram1', diagram1);
    const d2 = await diagramService.newDiagram('Diagram2', diagram2);

    // WHEN
    await component.ngAfterContentInit();
    component.doOpen(d2);
    fixture.detectChanges();
    await fixture.whenStable();
  
    // THEN   
    expect(fixture.debugElement.query(findByInnerText('Diagram1'))).toBeTruthy();
    expect(fixture.debugElement.query(findByInnerText('Diagram2'))).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('.diagram-link')).length).toBe(1);
  });
});



const diagram1 = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
    <bpmn:task id="Activity_1jbrmkn" name="Diagram2" />
    <bpmn:task id="Activity_1rgw1ze" name="Bar" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="133" y="122" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1jbrmkn_di" bpmnElement="Activity_1jbrmkn">
        <dc:Bounds x="230" y="100" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1rgw1ze_di" bpmnElement="Activity_1rgw1ze">
        <dc:Bounds x="410" y="100" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const diagram2 = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
    <bpmn:task id="Activity_0liyt7s" name="Diagram1" />
    <bpmn:task id="Activity_0o4krvk" name="Foo" />
    <bpmn:task id="Activity_00geomc" name="Diagram2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0liyt7s_di" bpmnElement="Activity_0liyt7s">
        <dc:Bounds x="410" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0o4krvk_di" bpmnElement="Activity_0o4krvk">
        <dc:Bounds x="260" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_143lsyb" bpmnElement="Activity_00geomc">
        <dc:Bounds x="550" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
