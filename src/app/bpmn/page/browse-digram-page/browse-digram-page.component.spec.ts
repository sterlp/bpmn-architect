import { LayoutModule } from '@angular/cdk/layout';
import { _ParseAST } from '@angular/compiler';
import { DebugElement, Predicate } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BpmnElementIconComponent } from 'src/app/shared/bpmn-element-icon/bpmn-element-icon.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { findByInnerText } from 'src/app/shared/test/selectors';
import { BpmnType, newElement } from '../../model/diagram-model';
import { AppDbService } from '../../service/app-db.service';
import { BpmnDiagramService } from '../../service/bpmn-diagram.service';
import { BpmnElementService } from '../../service/bpmn-element.service';

import { BrowseDigramPageComponent } from './browse-digram-page.component';

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
        MatToolbarModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatDividerModule
      ]
    }).compileComponents();
  }));

  beforeEach(async () => {
    await TestBed.inject(AppDbService).clear();
    fixture = TestBed.createComponent(BrowseDigramPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

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
    await component.ds.doReload();
    fixture.detectChanges();

    // THEN
    expect(fixture.debugElement.query(findByInnerText('Folder 1', 'td'))).withContext('Folder 1').toBeTruthy();    
    expect(fixture.debugElement.query(findByInnerText('Folder 2', 'td'))).withContext('Folder 2').toBeTruthy();    
    expect(fixture.debugElement.query(findByInnerText('Folder 3', 'td'))).withContext('Folder 3 should not be found').toBeFalsy();
  });

  

  it('should display root diagrams', async () => {
    // GIVEN
    const f1 = await elementService.save(newElement('Folder 1', BpmnType.folder));
    await diagramService.newDiagram('D1', 'xml1');
    await diagramService.newDiagram('D2', 'xml2', f1.id);

    // WHEN
    await component.ds.doReload();
    fixture.detectChanges();

    // THEN
    expect(fixture.debugElement.query(findByInnerText('D1', 'td'))).withContext('D1 should be found').toBeTruthy();
    // should auto expand the node!
    expect(fixture.debugElement.query(findByInnerText('D2', 'td'))).toBeTruthy();
  });

  it('new folder and edit folder name should work', async () => {
    // GIVEN
    fixture.debugElement.nativeElement.querySelector('[aria-label="Open menu"]').click();
    await fixture.whenStable();
    // WHEN
    fixture.debugElement.query(findByInnerText('Add folder', 'button')).nativeElement.click();
    fixture.detectChanges();
    // THEN
    let el = fixture.debugElement.nativeElement.querySelector('[aria-label="enter folder name"]');
    expect(el).toBeTruthy();

    // WHEN
    await sendInput(el, 'folder 1');
    await component.doSaveElement();
    fixture.detectChanges();
    // THEN
    expect(component.editElement).toBeFalsy();
    expect(fixture.debugElement.query(findByInnerText('folder 1', 'td'))).toBeTruthy();
  });

  it('delete folder should remove the folder', async () => {
    // GIVEN
    const d1 = await elementService.save(newElement('folder 1'));
    await component.ds.doReload();
    fixture.detectChanges();
    expect(fixture.debugElement.query(findByInnerText('folder 1', 'td'))).toBeTruthy();
    // WHEN
    await component._deleteElement(d1);
    fixture.detectChanges();
    // THEN
    expect(fixture.debugElement.query(findByInnerText('folder 1', 'td'))).toBeFalsy();
  });

  async function sendInput(input: any, value: string): Promise<any> {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return await fixture.whenStable();
  }
});
