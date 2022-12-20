import { AfterContentInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

export interface BpmnContent {
  xml: string;
}

@Component({
  selector: 'app-bpmn-modeler',
  templateUrl: './bpmn-modeler.component.html',
  styleUrls: ['./bpmn-modeler.component.scss']
})
export class BpmnModelerComponent implements AfterContentInit, OnDestroy {
  @ViewChild('diagram', { static: true }) 
  private diagram?: ElementRef<HTMLElement>;
  private modeler: any;

  constructor(private elementRef: ElementRef, private zone: NgZone) {
    this.modeler = new BpmnJS({
      keyboard: {
        bindTo: document
      }
    });

    this.modeler.on('import.done', (e: any) => {
      console.info('import.done', e);
      if (!e || !e.error) {
        this.modeler.get('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    if (this.diagram) {
      this.modeler.attachTo(this.diagram.nativeElement);
      this.zone.run(() => this.modeler.createDiagram());
    } else {
      throw 'diagram element not found in DOM';
    }
  }

  ngOnDestroy(): void {
    this.modeler.destroy();
  }

  doOpen(diagram: String): Promise<any> {
    return this.modeler.importXML(diagram);
  }

  doSave(): Promise<BpmnContent> {
    return this.modeler.saveXML({ format: true });
  }
}
