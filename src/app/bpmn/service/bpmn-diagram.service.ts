import { Injectable } from '@angular/core';
import { AppDbService } from './app-db.service';
import { BpmnDiagram, BpmnType, newElement } from '../model/diagram-model';
import { BpmnElementService } from './bpmn-element.service';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BpmnDiagramService {

  constructor(private elementService: BpmnElementService, private db: AppDbService) { }

  async findIdByName(name?: string): Promise<number | undefined> {
    let result: Promise<number | undefined> = Promise.resolve(undefined);
    if (name) {
      const e = await this.elementService.findByNameAndType(name, BpmnType.diagram);
      if (e) result = Promise.resolve(e.id);
    }
    return result;
  }
  async delete(id?: number): Promise<void> {
    if (id) {
      await this.elementService.delete(id);
      await this.db.bpmnElements.delete(id);
    }
  }
  async get(id: number): Promise<BpmnDiagram | undefined> {
    const r = await this.db.bpmnDiagrams.get(id);
    if (r) r.element = await this.elementService.get(r.id!) || newElement('', BpmnType.diagram);
    return r;
  }
  async newDiagram(name: string, xml: string, parentId?: number): Promise<BpmnDiagram> {
    const element = await this.elementService.save(newElement(name, BpmnType.diagram, parentId));
    const result = {
      id: element.id!,
      xml: xml
    } as BpmnDiagram;
    result.id = await this.db.bpmnDiagrams.put(result);
    result.element = element;
    if (result.id != element.id) throw `Element Id ${element.id} is but diagram has ${result.id}`;
    return result;
  }
  async save(diagram: BpmnDiagram): Promise<BpmnDiagram> {
    const element = await this.elementService.getOrCreate(diagram.element);
    diagram.id = element.id;
    const id = await this.db.bpmnDiagrams.put(diagram);
    if (id != element.id) throw `Element Id ${element.id} is but diagram has ${id}`;
    return diagram;
  }
}
