import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseDigramPageComponent } from './bpmn/page/browse-digram-page/browse-digram-page.component';
import { EditDiagramPageComponent } from './bpmn/page/edit-diagram-page/edit-diagram-page.component';

const routes: Routes = [
  { path: 'diagrams/:id', title: 'Edit Diagram', component: EditDiagramPageComponent },
  { path: 'diagrams', title: 'Edit Diagram', component: BrowseDigramPageComponent },
  { path: '',   redirectTo: '/diagrams', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
