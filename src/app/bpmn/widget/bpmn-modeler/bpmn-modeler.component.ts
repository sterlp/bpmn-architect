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

export interface BpmnContent {
  xml: string;
}

function linkRenderer(viewer: any) {
  // Get the default renderer
  var renderer = viewer.getRenderer();

  // Override the renderLabel method
  renderer.renderLabel = function(parentGfx: any, element: any) {
    // Get the default rendering configuration for the label
    var config = renderer._getLabel(element);

    // Create a link element
    var link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLLinkElement;
    link.href = '#';
    link.textContent = config.text;

    // Add the link element to the parent graphics node
    parentGfx.appendChild(link);

    // Return the modified rendering configuration
    return {
      align: config.align,
      width: config.width,
      height: config.height
    };
  };

  // Return the modified renderer
  return renderer;
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

  constructor(private zone: NgZone) {

    this.modeler = new BpmnJS({
      keyboard: {
        bindTo: document
      },
      additionalModules: [
        {
          __init__: [ 'myRenderer' ],
          myRenderer: [ 'type', MyRenderer ]
        }
      ],
    });

    this.modeler.on('element.click', function(e: any) {
      console.info('element.click on modeler', e, arguments);
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

class MyRenderer extends BaseRenderer {
  static readonly $inject: [ 'eventBus', 'bpmnRenderer' ];
  bpmnRenderer: any;
  constructor (eventBus: any, bpmnRenderer: any) {
    super(eventBus, 1500);
    this.bpmnRenderer = bpmnRenderer;

    console.info('constructor:MyRenderer', eventBus, bpmnRenderer);

    eventBus.on('element.changed', (event: any) => {
      console.log('element ', event.element, ' changed');
    });
  }

  canRender(element: any) {
    return isAny(element, [ 'bpmn:Task' ]) && !element.labelTarget;
  }

  drawShape(parentNode: any, element: any) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);



    const rect = this.drawRect(parentNode, 30, 20, 1, '#cc1000');

    svgAttr(rect, {
      transform: 'translate(-20, -10)'
    });

    parentNode.addEventListener('click', () => {
      console.log('SVG was clicked');
    });

    shape.addEventListener('click', () => {
      console.log('SVG shape was clicked');
    });

    rect.setAttribute('onclick', 'console.log("SVG was clicked aaa")');

    return shape;
  }

  // copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
  prependTo(newNode: any, parentNode: any, siblingNode?: any) {
    parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
  }

  // copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
  drawRect(parentNode: any, width: number, height: number, borderRadius: number, strokeColor: string = '#000') {
    const rect = svgCreate('rect');
  
    svgAttr(rect, {
      width: width,
      height: height,
      rx: borderRadius,
      ry: borderRadius,
      stroke: strokeColor,
      strokeWidth: 2,
      fill: '#fff'
    });
  
    svgAppend(parentNode, rect);
  
    return rect;
  }

}
