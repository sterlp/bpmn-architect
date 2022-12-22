import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { BpmnDiagram, BpmnElement } from '../model/diagram-model';

@Injectable({
  providedIn: 'root'
})
export class AppDbService extends Dexie {

  bpmnElements!: Table<BpmnElement, number>;
  bpmnDiagrams!: Table<BpmnDiagram, number>;

  constructor() {
    super('bpmn-architect-db');
    this.version(1).stores({
      bpmnElements: '++id, parentId, name, type, hasChildren, createDate, updateDate',
      bpmnDiagrams: '++id, name, xml',
    });
  }

  async clear(): Promise<void> {
    await this.bpmnElements.clear();
    await this.bpmnDiagrams.clear();
  }
}
