import { DebugElement, Predicate } from "@angular/core";

export function findByInnerText(text: string, type?: string, debug = false): Predicate<DebugElement> {
  return e => {
    if (debug && e.nativeNode.innerText && e.nativeNode.innerText != '') {
    console.info('findByInnerText', text, '=>', e.nativeNode.innerText.indexOf(text) >= 0, e.nativeNode.innerText, e.nativeNode);
    }
    return e.nativeNode.innerText && e.nativeNode.innerText.indexOf(text) >= 0 && (!type ||  e.nativeNode.localName == type)
  };
}