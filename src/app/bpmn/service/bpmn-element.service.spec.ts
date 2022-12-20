import { TestBed } from '@angular/core/testing';
import { BpmnType, newElement } from '../model/diagram-model';

import { BpmnElementService } from './bpmn-element.service';

describe('FolderService', () => {
  let service: BpmnElementService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmnElementService);
    await service.deleteAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('delete should move childs', async () => {
    // GIVEN
    const r = await service.save(newElement('root'));
    const f1 = await service.save(newElement('F1', BpmnType.folder, r.id));
    const f2 = await service.save(newElement('F2', BpmnType.folder, f1.id));
    const d1 = await service.save(newElement('D1', BpmnType.diagram, f1.id));
    expect(((await service.count()))).toBe(4);

    // WHEN
    await service.delete(f1.id);

    // THEN
    expect((await service.get(f2.id!))?.parentId).toBe(r.id);
    expect((await service.get(d1.id!))?.parentId).toBe(r.id);

    // WHEN
    await service.delete(r.id);

    // THEN
    expect((await service.get(f2.id!))?.parentId).toBe(0);
    expect((await service.get(d1.id!))?.parentId).toBe(0);
    expect(((await service.count()))).toBe(2);
  });
});
