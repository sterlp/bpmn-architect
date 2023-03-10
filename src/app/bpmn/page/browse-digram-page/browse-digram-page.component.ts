import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BpmnElement, BpmnType, newElement } from '../../model/diagram-model';
import { BpmnElementService } from '../../service/bpmn-element.service';
import { BpmnDiagramService } from '../../service/bpmn-diagram.service';
import { AppDbService } from '../../service/app-db.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { BrowseDiagramDataSource, FlatTreeNode } from './browse-diagram-data-source';
import { MoveElementDialogComponent } from '../../widget/move-element-dialog/move-element-dialog.component';


@Component({
  selector: 'app-browse-digram-page',
  templateUrl: './browse-digram-page.component.html',
  styleUrls: ['./browse-digram-page.component.scss']
})
export class BrowseDigramPageComponent implements OnInit {

  @ViewChild('inputName') inputName?: ElementRef;

  readonly displayedColumns = ['name', 'date', 'actions']

  editElement?: BpmnElement;
  parent?: BpmnElement;

  ds: BrowseDiagramDataSource;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private elementService: BpmnElementService, 
    private diagramService: BpmnDiagramService, 
    private db: AppDbService) {

    this.ds = new BrowseDiagramDataSource(elementService);
  }

  ngOnInit() {
    this.ds.doReload();
  }

  cancelEdit = () => {
    // if the edit element is a new element, we have to remove it
    if (this.editElement && this.parent && this.editElement.id === undefined 
      && this.parent.children!.indexOf(this.editElement) >= 0) {      
      this.parent.children!.splice(this.parent.children!.indexOf(this.editElement), 1);
    }
    this.parent = undefined;
    this.editElement = undefined;
    this.ds.removeElementsWithoutId();
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
      this._doEditFolderNode(node);
    }
  }

  private _doEditFolderNode(node: FlatTreeNode) {
    this.editElement = node.source;
    this.ds.rerenderAllElements();
    this._focusInput();
  }

  doAddFolder(node?: FlatTreeNode) {
    const folder = this.editElement = newElement('', BpmnType.folder, node?.source.id);

    if (node && node.source.id) {
      this.parent = node.source;
      this.parent.children!.push(folder);
      node.expandable = true;
      this.ds.dataSource.data = this.ds.dataSource.data;
      this.ds.treeControl.expand(node);
    } else {      
      this.ds.dataSource.data = new Array<BpmnElement>(folder).concat(this.ds.dataSource.data);
    }
    this._focusInput();
  }

  private _focusInput() {
    setTimeout(() => {
      if (this.inputName) this.inputName.nativeElement.focus();
    }, 1);
  }

  doMoveElement(node: FlatTreeNode) {
    const ref: MatDialogRef<MoveElementDialogComponent, BpmnElement> = this.dialog.open(
      MoveElementDialogComponent, {
      data: {element: node.source},
      width: '80%',
    });
    ref.afterClosed().subscribe(async (newParent) => {
      if (newParent) {
        await this.elementService.moveElement(node.source, newParent.id);
        await this.ds.doReload();
      }
    });
    
  }

  doDelete(node: FlatTreeNode) {
    this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(`Should '${node.name}' be deleted?`, 'Confirm delete')}
    ).afterClosed().subscribe(okay => okay ? this._deleteElement(node.source) : null);
  }

  async _deleteElement(element: BpmnElement): Promise<void> {
    await this.diagramService.delete(element.id);
    await this.elementService.delete(element.id);
    this.ds.flatTreeNodeCache.delete(element);
    await this.ds.doReload();
  }

  async doSaveElement(): Promise<void> {
    if (this.editElement && this.editElement.name && this.editElement.name.length > 0) {
      await this.elementService.save(this.editElement);
      this.editElement = undefined;
      await this.ds.doReload();
    }
  }

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;
  isEmptyFolder = (_: number, node: FlatTreeNode) => !node.expandable && node.source && node.source.type === BpmnType.folder;

  async doClear() {
    this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(`Do your really want to delete all data? Everything will be removed.`, 'Confirm clear data')}
    ).afterClosed().subscribe(async (okay) => {
      if (okay) {
        await this.db.clear();
        await this.ds.doReload();
      }
    });
    
  }
}
