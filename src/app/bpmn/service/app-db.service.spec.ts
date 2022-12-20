import { TestBed } from '@angular/core/testing';
import { BpmnType, newElement } from '../model/diagram-model';

import { AppDbService } from './app-db.service';

describe('AppDbService', () => {
  let service: AppDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Dexie should work', async () => {
    // given
    await service.bpmnDiagrams.clear();
    await service.bpmnDiagrams.add({element: newElement('foo', BpmnType.diagram), xml: 'Hallo'});

    // when
    let diagrams = await service.bpmnDiagrams.toArray();

    expect(diagrams.length).toBe(1);
    expect(diagrams[0].id).toBeTruthy();
    expect(diagrams[0].xml).toBe('Hallo');
  });
});
