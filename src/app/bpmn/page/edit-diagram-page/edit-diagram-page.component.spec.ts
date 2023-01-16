import { LayoutModule } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BpmnModelerComponent } from 'src/app/bpmn/widget/bpmn-modeler/bpmn-modeler.component';
import { UploadButtonComponent } from 'src/app/shared/upload-button/upload-button.component';

import { EditDiagramPageComponent } from './edit-diagram-page.component';

describe('EditDiagramPageComponent', () => {
  let component: EditDiagramPageComponent;
  let fixture: ComponentFixture<EditDiagramPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDiagramPageComponent, BpmnModelerComponent, UploadButtonComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        NoopAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDiagramPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and init', () => {
    expect(component).toBeTruthy();
    expect(component.modeler).toBeTruthy();
  });
});
