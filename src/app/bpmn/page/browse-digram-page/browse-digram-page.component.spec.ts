import { LayoutModule } from '@angular/cdk/layout';
import { _ParseAST } from '@angular/compiler';
import { DebugElement, Predicate } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BpmnElementIconComponent } from 'src/app/shared/bpmn-element-icon/bpmn-element-icon.component';
import { BpmnType, newElement } from '../../model/diagram-model';
import { AppDbService } from '../../service/app-db.service';
import { BpmnDiagramService } from '../../service/bpmn-diagram.service';
import { BpmnElementService } from '../../service/bpmn-element.service';

import { BrowseDigramPageComponent } from './browse-digram-page.component';

function findByInnerText(text: string, type?: string): Predicate<DebugElement> {
  return e => {
    if (e.nativeNode.innerText && e.nativeNode.innerText != '') {
      //console.info('findByInnerText', text, '=>', e.nativeNode.innerText.indexOf(text) >= 0, e.nativeNode.innerText, e.nativeNode);
    }
    return e.nativeNode.innerText && e.nativeNode.innerText.indexOf(text) >= 0 && (!type ||  e.nativeNode.localName == type)
  };
}

describe('BrowseDigramPageComponent', () => {
  let component: BrowseDigramPageComponent;
  let fixture: ComponentFixture<BrowseDigramPageComponent>;
  let elementService: BpmnElementService;
  let diagramService: BpmnDiagramService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseDigramPageComponent, BpmnElementIconComponent ],
      providers: [BpmnElementService, BpmnDiagramService, AppDbService],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        LayoutModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatTreeModule,
        MatToolbarModule,
        MatTooltipModule
      ]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(BrowseDigramPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await TestBed.inject(AppDbService).clear();
    elementService = TestBed.inject(BpmnElementService);
    diagramService = TestBed.inject(BpmnDiagramService);
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should display root folders', async () => {
    // GIVEN
    await elementService.save(newElement('Folder 1', BpmnType.folder));
    const f2 = await elementService.save(newElement('Folder 2', BpmnType.folder));
    await elementService.save(newElement('F3', BpmnType.folder, f2.parentId));

    // WHEN
    await component.doReload();
    fixture.detectChanges();

    // THEN
    expect(fixture.debugElement.query(findByInnerText('Folder 1', 'mat-tree-node'))).withContext('Folder 1').toBeTruthy();    
    expect(fixture.debugElement.query(findByInnerText('Folder 2', 'mat-tree-node'))).withContext('Folder 2').toBeTruthy();    
    expect(fixture.debugElement.query(findByInnerText('Folder 3', 'mat-tree-node'))).withContext('Folder 3 should not be found').toBeFalsy();
  });

  

  it('should display root diagrams', async () => {
    // GIVEN
    const f1 = await elementService.save(newElement('Folder 1', BpmnType.folder));
    await diagramService.newDiagram('D1', 'xml1');
    await diagramService.newDiagram('D2', 'xml2', f1.id);

    // WHEN
    await component.doReload();
    fixture.detectChanges();

    // THEN
    expect(fixture.debugElement.query(findByInnerText('D1', 'mat-tree-node'))).withContext('D1 should be found').toBeTruthy();
    // should auto expand the node!
    expect(fixture.debugElement.query(findByInnerText('D2', 'mat-tree-node'))).toBeTruthy();
  });
});
