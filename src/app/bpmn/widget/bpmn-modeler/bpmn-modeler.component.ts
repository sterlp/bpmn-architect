import { AfterContentInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer.js';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg';
import { BpmnDiagramService } from '../../service/bpmn-diagram.service';
import { Router } from '@angular/router';

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
  private _diagram?: ElementRef<HTMLElement>;
  private _modeler: any;

  constructor(private _zone: NgZone, private _router: Router, private _diagramService: BpmnDiagramService) {

    this._modeler = new BpmnJS({
      keyboard: {
        bindTo: document
      },
      additionalModules: [
        { __init__: [ 'myRenderer' ], myRenderer: [ 'type', MyRenderer ] },
        { 'diagramService': ['value', _diagramService] },
        { 'router': ['value', _router] }
      ],
    });
  }

  ngAfterContentInit(): void {
    if (this._diagram) {
      this._modeler.attachTo(this._diagram.nativeElement);
      this._zone.run(() => this._modeler.createDiagram());
    } else {
      throw 'diagram element not found in DOM';
    }
  }

  ngOnDestroy(): void {
    this._modeler.destroy();
  }

  doOpen(diagram: String): Promise<any> {
    return this._modeler.importXML(diagram);
  }

  doSave(): Promise<BpmnContent> {
    return this._modeler.saveXML({ format: true });
  }
}

class MyRenderer extends BaseRenderer {
  static $inject?: Array<string>;

  constructor (private eventBus: any, private bpmnRenderer: any, 
    private diagramService: BpmnDiagramService,
    private router: Router) {

    super(eventBus, 1500);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element: any) {
    return isAny(element, [ 'bpmn:Task' ]) && !element.labelTarget;
  }

  drawShape(parentNode: any, element: any) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);   

    const elementName = element.businessObject.name;
    if (elementName) {
      this.addLinkIcon(elementName, parentNode);
    }

    return shape;
  }

  async addLinkIcon(name: string, parentNode: any) {
    const id = await this.diagramService.findIdByName(name);
    if (id) {
      const rect = this.newLink(id);
      svgAppend(parentNode, rect);
      svgAttr(rect, {
        transform: 'translate(2, -25)'
      });
    }
  }

  newLink(id: number): SVGGraphicsElement {
    const g = svgCreate('g');
    g.setAttribute('class', 'diagram-link');
    svgAttr(g, {
      width: '24',
      height: '24'
    });

    const svg = svgCreate('svg');
    g.appendChild(svg);

    const a = svgCreate('a');
    svg.appendChild(a);

    const rect = svgCreate('rect');
    svgAttr(rect, {
      width: '24',
      height: '24'
    });
    a.appendChild(rect);
    
    // Create the link path
    const linkPath = svgCreate('path');
    linkPath.setAttribute('d', 'M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z');
    a.appendChild(linkPath);

    a.addEventListener('click', (e) => {
      console.info('SVG click to diagram ' + id, e);
      this.router.navigate(['/diagrams', id]);
    });
    return g;
  }
}
MyRenderer.$inject = [ 'eventBus', 'bpmnRenderer', 'diagramService', 'router' ];
