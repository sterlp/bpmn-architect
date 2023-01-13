import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { BpmnModelerComponent } from 'src/app/bpmn/widget/bpmn-modeler/bpmn-modeler.component';
import { FileUploadContent } from 'src/app/shared/upload-button/upload-button.component';
import { BpmnDiagram, BpmnType, newElement } from '../../model/diagram-model';
import { BpmnDiagramService } from '../../service/bpmn-diagram.service';
import { BpmnElementService } from '../../service/bpmn-element.service';

@Component({
  selector: 'app-edit-diagram-page',
  templateUrl: './edit-diagram-page.component.html',
  styleUrls: ['./edit-diagram-page.component.scss']
})
export class EditDiagramPageComponent implements OnInit, AfterContentInit {
  @ViewChild(BpmnModelerComponent, {static: true}) 
  modeler!: BpmnModelerComponent;

  diagram: BpmnDiagram = { xml: '', element: newElement('', BpmnType.diagram) };

  constructor(
    private bpmnService: BpmnDiagramService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id != 'new') {
        this.diagram.id = parseInt(id);
        this.doUndo();
      } else {
        const parent = parseInt(this.route.snapshot.queryParams['parent'] || '0');
        this.diagram.element.parentId = parent;
      }
    });    
  }

  ngAfterContentInit() {
  }

  async doUndo() {
    const loaded = await this.bpmnService.get(this.diagram.id!);
    if (loaded) {
      this.diagram = loaded;
      this.modeler.doOpen(this.diagram);
    }
    else this.diagram.id = undefined;
  }
  doSave() {
    this.modeler.doSave()
        .then( async (v) => {
            this.diagram.xml = v.xml;
            if (this.diagram.id) this.diagram = await this.bpmnService.save(this.diagram);
            else this.diagram = await this.bpmnService.newDiagram(this.diagram.element.name, this.diagram.xml, this.diagram.element.parentId);
          }
        );
  }

  doDownload() {
    this.modeler.doSave()
        .then(v => {
            console.info('EditDiagramPageComponent.doSave', v);
            FileSaver.saveAs(new Blob([v.xml], {type: 'application/xml'}), `${this.diagram.element.name}.bpmn`);
          }
        );
  }

  onUpload(upload: FileUploadContent): void {
    this.modeler.doOpen({xml: upload.value, element: newElement('', BpmnType.diagram)})
        .then( ({warnings}) => console.info('success', warnings))
        .catch(er => console.error('upload failed', er));
  }
}
