import { TestBed } from '@angular/core/testing';
import { BpmnDiagram, BpmnType, newElement } from '../model/diagram-model';

import { BpmnDiagramService } from './bpmn-diagram.service';
import { BpmnElementService } from './bpmn-element.service';

describe('BpmnService', () => {
  let service: BpmnDiagramService;
  let elementService: BpmnElementService;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmnDiagramService);
    elementService = TestBed.inject(BpmnElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow saves', async () => {
    const diagram = await service.newDiagram('foo', 'bar');
    // then
    expect(diagram.id).toBeTruthy();

    // when
    const d1 = await service.get(diagram.id!);

    // then
    expect(diagram.element.name).toBe('foo');
    expect(diagram.xml).toBe('bar');
    expect(diagram.element.id).toBe(diagram.id);
    expect(d1?.element.name).toBe('foo');
    expect(d1?.xml).toBe('bar');
  });

  it('newDiagram should save parent', async () => {
    // given
    const f1 = await elementService.save(newElement('f1'));
    
    // when
    const d1 = await service.newDiagram('foo', 'bar', f1.id);

    // then
    expect(d1.element.parentId).toBe(f1.id);
  });

  it('save should save parent', async () => {
    // given
    const f1 = await elementService.save(newElement('f1'));
    let d1: BpmnDiagram = {xml: 'hhhh', element: newElement('d1', BpmnType.diagram, f1.id)};
    
    // then
    await service.save(d1);
    expect(d1.element.parentId).toBe(f1.id);
    

    // when
    d1 = (await service.get(d1.id!))!;

    // then
    expect(d1.element.parentId).toBe(f1.id);
  });
});
