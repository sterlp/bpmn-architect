import { Component, Input } from '@angular/core';
import { BpmnElement, BpmnType } from 'src/app/bpmn/model/diagram-model';

@Component({
  selector: 'app-bpmn-element-icon',
  templateUrl: './bpmn-element-icon.component.html',
  styleUrls: ['./bpmn-element-icon.component.scss']
})
export class BpmnElementIconComponent {

  @Input() element?: BpmnElement;

  getIcon(): string {
    if (this.element?.type == BpmnType.diagram) return 'account_tree';
    return 'folder';
  }
}
