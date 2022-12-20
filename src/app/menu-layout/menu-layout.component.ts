import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { from, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BpmnDiagramService } from '../bpmn/service/bpmn-diagram.service';
import { BpmnDiagram } from '../bpmn/model/diagram-model';
@Component({
  selector: 'app-menu-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.scss']
})
export class MenuLayoutComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  diagrams$: Observable<BpmnDiagram[]> = from([]);

  constructor(private breakpointObserver: BreakpointObserver, bpmnService: BpmnDiagramService) {
    //this.diagrams$ = from(bpmnService.findAllModels());
  }

}
