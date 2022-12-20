import { Injectable } from '@angular/core';
import { BpmnElement, BpmnType, newElement } from '../model/diagram-model';
import { AppDbService } from './app-db.service';

@Injectable({
  providedIn: 'root'
})
export class BpmnElementService {
  
  async getLastChangedElement(): Promise<BpmnElement[]> {
    return this.db.bpmnElements.where('parentId').notEqual(0).limit(1).reverse().sortBy('updateDate');
  }
  
  async deleteAll(): Promise<void> {
    await this.db.bpmnElements.clear();
  }
  async count(): Promise<number> {
    return this.db.bpmnElements.count();
  }

  async delete(id?: number): Promise<void> {
    if (id) {
      const e = await this.db.bpmnElements.get(id);
      if (e) {
        await this.db.bpmnElements.where("parentId").equals(id).modify({parentId: e.parentId});
        await this.db.bpmnElements.delete(id);
      }
    }
  }

  constructor(private db: AppDbService) { }

  async findAll(): Promise<BpmnElement[]> {
    return this.db.bpmnElements.orderBy('name').toArray();
  }

  async get(id: number): Promise<BpmnElement | undefined> {
    return this.db.bpmnElements.get(id);
  }

  async getOrCreate(element: BpmnElement): Promise<BpmnElement> {
    let existing = element.id ? await this.db.bpmnElements.get(element.id) : undefined;
    if (existing) {
      this._merge(element, existing);
    } else {
      existing = element;
    }
    existing.updateDate = new Date().getTime();
    existing.id = await this.db.bpmnElements.put(existing);
    return existing;
  }

  private _merge(source: BpmnElement, target: BpmnElement) {
    target.name = source.name;
    target.type = source.type;
  }

  async save(element: BpmnElement): Promise<BpmnElement> {
    if (element.parentId == undefined) element.parentId = 0;
    else {
      const parent = await this.db.bpmnElements.get(element.parentId);
      if (!parent) { // parent wasn't found so we move the folder to the top
        element.parentId = 0;
      }
    }
    element.id = await this.db.bpmnElements.put(element);
    return element;
  }

  async getFolderByParent(parentId: number = 0): Promise<BpmnElement[]> {
    return this.db.bpmnElements.where('parentId').equals(parentId).sortBy('name');
  }
}
