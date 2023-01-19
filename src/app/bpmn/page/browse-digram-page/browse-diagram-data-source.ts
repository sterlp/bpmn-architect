import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { BpmnElement, BpmnType } from "../../model/diagram-model";
import { BpmnElementService } from "../../service/bpmn-element.service";

export interface FlatTreeNode {
    name: string;
    type: BpmnType;
    level: number;
    expandable: boolean;
    source: BpmnElement;
    updateDate?: number;
}

export class BrowseDiagramDataSource {
  
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<BpmnElement, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<BpmnElement, FlatTreeNode>;

  public readonly flatTreeNodeCache = new Map<BpmnElement, FlatTreeNode>();

  constructor(private elementService: BpmnElementService) {

    this.treeFlattener = new MatTreeFlattener(
      (n, l) => this._nodeTransformer(n, l),
      n => n.level,
      n => n.expandable,
      n => n.children ? n.children : null
    );

    this.treeControl = new FlatTreeControl(n => n.level, n => n.expandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

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

  removeElementsWithoutId() {
    const d = this.dataSource.data.filter(el => el.id !== undefined);
    this.dataSource.data = [];
    this.dataSource.data = d;
  }

  rerenderAllElements() {
    const d = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = d;
  }

  async doReload(): Promise<void> {
    this.flatTreeNodeCache.clear();

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
      this._expandById(openState.map(n => n.source.id!));
    } else {
      const lastElement = await this.elementService.getLastChangedElement();
      this._expandById(lastElement.filter(l => l.parentId).map(l => l.parentId!));
    }
  }

  private _expandById(ids: Array<number>) {
    for (let n of this.flatTreeNodeCache.values()) {
      if (n.source.id && ids.includes(n.source.id)) this.treeControl.expand(n);
    }
  }
}