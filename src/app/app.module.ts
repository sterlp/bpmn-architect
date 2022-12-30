import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { BpmnModelerComponent } from './bpmn/widget/bpmn-modeler/bpmn-modeler.component';
import { EditDiagramPageComponent } from './bpmn/page/edit-diagram-page/edit-diagram-page.component';
import { UploadButtonComponent } from './shared/upload-button/upload-button.component';
import { BrowseDigramPageComponent } from './bpmn/page/browse-digram-page/browse-digram-page.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { BpmnElementIconComponent } from './shared/bpmn-element-icon/bpmn-element-icon.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    MenuLayoutComponent,
    BpmnModelerComponent,
    EditDiagramPageComponent,
    UploadButtonComponent,
    BrowseDigramPageComponent,
    BpmnElementIconComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule,
    MatTableModule,
    MatBadgeModule,
    MatTooltipModule,
    MatCardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
