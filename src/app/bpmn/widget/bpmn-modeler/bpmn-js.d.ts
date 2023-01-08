declare module 'bpmn-js/dist/bpmn-modeler.production.min.js' {
    export default class BpmnJS {
        constructor(param?: any);
    }
}

declare module 'diagram-js/lib/draw/BaseRenderer.js' {
    export default class BaseRenderer {
        static readonly DEFAULT_RENDER_PRIORITY = 1000;
        constructor(eventBus: any, renderPriority: number)
    }
}

declare module 'bpmn-js/lib/util/ModelUtil';
declare module 'bpmn-js/lib/features/modeling/util/ModelingUtil';