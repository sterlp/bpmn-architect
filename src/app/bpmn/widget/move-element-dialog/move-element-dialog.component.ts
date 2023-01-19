import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BpmnElement, BpmnType } from '../../model/diagram-model';
import { BpmnElementService } from '../../service/bpmn-element.service';

@Component({
  selector: 'app-move-element-dialog',
  templateUrl: './move-element-dialog.component.html',
  styleUrls: ['./move-element-dialog.component.scss']
})
export class MoveElementDialogComponent {

  readonly displayedColumns: string[] = ['select', 'type', 'name'];
  dataSource: BpmnElement[] = [];
  selection = new SelectionModel<BpmnElement>(false);

  constructor(
    private elementService: BpmnElementService,
    private dialogRef: MatDialogRef<MoveElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {element?: BpmnElement}){

      this.doFilter();
    }

  async doFilter(query?: string | any): Promise<void> {
    let d: BpmnElement[] = [];
    if (query && query.length > 0) {
      d = await this.elementService.searchByNameAndType(query, BpmnType.folder);
    } else {
      d = this.dataSource = await this.elementService.findByType(BpmnType.folder);
    }
    if (d.length > 10) d = d.slice(0, 10);
    this.dataSource = d;
  }

  doSelect(): void {
    this.dialogRef.close(this.selection.selected.pop());
  }

  doDismiss(): void {
    this.dialogRef.close();
  }

  onChangeEvent(e: Event) {
    this.doFilter((e.target as HTMLInputElement).value);
  }
  doSelectRow(row: BpmnElement) {
    console.info('select', row);
  }
}
