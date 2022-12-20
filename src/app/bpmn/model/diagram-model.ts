export enum BpmnType {
    folder,
    diagram
}

export function newElement(name: string, type: BpmnType = BpmnType.folder, parentId?: number): BpmnElement {
    const now = new Date().getTime();
    return {
        name,
        parentId,
        type: type,
        createDate: now,
        updateDate: now,
    }
}
export interface BpmnElement {
    id?: number;
    parentId?: number;
    name: string;
    type: BpmnType;
    createDate: number;
    updateDate: number;
    /// optional reference to it's children
    children?: Array<BpmnElement>;
}

export interface BpmnDiagram {
    id?: number;
    xml: string;
    element: BpmnElement;
}