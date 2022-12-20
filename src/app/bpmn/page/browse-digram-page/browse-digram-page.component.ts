import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BpmnElement, BpmnType, newElement } from '../../model/diagram-model';
import { BpmnElementService } from '../../service/bpmn-element.service';
import { BpmnDiagramService } from '../../service/bpmn-diagram.service';
import { AppDbService } from '../../service/app-db.service';
import { Router } from '@angular/router';


/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
interface FlatTreeNode {
  name: string;
  type: BpmnType;
  level: number;
  expandable: boolean;
  source: BpmnElement;
  updateDate?: number;
}

@Component({
  selector: 'app-browse-digram-page',
  templateUrl: './browse-digram-page.component.html',
  styleUrls: ['./browse-digram-page.component.scss']
})
export class BrowseDigramPageComponent implements OnInit {

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<BpmnElement, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<BpmnElement, FlatTreeNode>;

  private readonly flatTreeNodeCache = new Map<BpmnElement, FlatTreeNode>();
  private readonly elementMap = new Map<number, BpmnElement>();

  editElement?: BpmnElement;
  parent?: BpmnElement;

  constructor(
    private router: Router,
    private elementService: BpmnElementService, 
    private diagramService: BpmnDiagramService, 
    private db: AppDbService) {

    this.treeFlattener = new MatTreeFlattener(
      (n, l) => this._nodeTransformer(n, l),
      n => n.level,
      n => n.expandable,
      n => n.children ? n.children : null
    );

    this.treeControl = new FlatTreeControl(n => n.level, n => n.expandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.doReload();
  }

  cancelEdit = () => {
    // if the edit element is a new element, we have to remove it
    if (this.editElement && this.parent && this.editElement.id === undefined 
      && this.parent.children!.indexOf(this.editElement) >= 0) {      
      this.parent.children!.splice(this.parent.children!.indexOf(this.editElement), 1);
    }
    const d = this.dataSource.data.filter(el => el.id !== undefined);
    this.parent = undefined;
    this.editElement = undefined;
    this.dataSource.data = [];
    this.dataSource.data = d;
    
  };

  isEditNode = (_: number, node: FlatTreeNode): boolean => {
    const r = this.editElement != undefined && node && node.source
      && (this.editElement == node.source 
        || (node.source.id != undefined && this.editElement.id != undefined && node.source.id == this.editElement.id));
    
    return r;
  };

  toQueryParams(node?: FlatTreeNode) {
    return {parent: node?.source?.id || 0};
  }

  doEditNode(node: FlatTreeNode) {
    if (node.type == BpmnType.diagram) {
      this.router.navigate(['/diagrams', node.source.id || 'new']);
    } else {
      this.editElement = node.source;
      const d = this.dataSource.data;
      this.dataSource.data = [];
      this.dataSource.data = d;
    }
  }

  async doDelete(node: FlatTreeNode): Promise<void> {
    await this.diagramService.delete(node.source.id);
    await this.elementService.delete(node.source.id);
    this.flatTreeNodeCache.delete(node.source);
    // if we have children on the deleted node, we have to reload
    if (node.source.children?.length || 0 > 0) {
      this.doReload();
    } else {
      this.dataSource.data = this.dataSource.data.filter(el => el != node.source || el.id !== node.source.id);
    }
  }

  async doReload(): Promise<void> {
    this.flatTreeNodeCache.clear();
    this.elementMap.clear();

    const elements = await this.elementService.findAll();
    const indexMap = new Map<number, BpmnElement>();
    const rootElements = new Array<BpmnElement>();
  
    // First pass: identify root elements and create element map
    for (const e of elements) {
      e.children = [];
      indexMap.set(e.id!, e);
      if (e.parentId == 0) {
        rootElements.push(e);
      }
    }
  
    // Second pass: process children of each element
    for (const e of elements) {
      if (e.parentId && e.parentId != 0) {
        indexMap.get(e.parentId)?.children?.push(e);
      }
    }

    const openState = this.treeControl.expansionModel.selected;
    this.dataSource.data = rootElements;
    if (openState.length > 0) {
      this.expandById(openState.map(n => n.source.id!));
    } else {
      const lastElement = await this.elementService.getLastChangedElement();
      this.expandById(lastElement.filter(l => l.parentId).map(l => l.parentId!));
    }
  }

  expandById(ids: Array<number>) {
    for (let n of this.flatTreeNodeCache.values()) {
      if (n.source.id && ids.includes(n.source.id)) this.treeControl.expand(n);
    }
  }

  async doCreateNewFolder() {
    if (this.editElement && this.editElement.name && this.editElement.name.length > 0) {
      await this.elementService.save(this.editElement);
      const id = this.editElement.parentId || 0;
      this.editElement = undefined;
      await this.doReload();
      if (id > 0) {
        this.flatTreeNodeCache.forEach((n, e) => {
          if (n.expandable && n.source.id === id) this.treeControl.expand(n);
        });
      }
    }
  }

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;
  isEmptyFolder = (_: number, node: FlatTreeNode) => !node.expandable && node.source && node.source.type === BpmnType.folder;
  isFolder = (node?: FlatTreeNode) => node &&  node.type === BpmnType.folder;

  /** Transform the data to something the tree can read. */
  private _nodeTransformer(node: BpmnElement, level: number): FlatTreeNode {
    let r = this.flatTreeNodeCache.get(node);
    if (!r) {
      r = {
        name: node.name,
        type: node.type,
        level,
        expandable: node.children != undefined && node.children.length > 0,
        updateDate: node.updateDate,
        source: node
      };
      this.flatTreeNodeCache.set(node, r);
    }
    return r;
  }

  async doClear() {
    await this.db.clear();
    await this.doReload();
  }

  isFolderWithActions(node: FlatTreeNode) {
    return node.source.id && node.source.type == BpmnType.folder;
  }

  doAddFolder(node?: FlatTreeNode) {
    const folder = this.editElement = newElement('', BpmnType.folder, node?.source.id);

    if (node && node.source.id) {
      this.parent = node.source;
      this.parent.children!.push(folder);
      node.expandable = true;
      this.dataSource.data = this.dataSource.data;
      this.treeControl.expand(node);
    } else {      
      this.dataSource.data = new Array<BpmnElement>(folder).concat(this.dataSource.data);
    }
  }
}
