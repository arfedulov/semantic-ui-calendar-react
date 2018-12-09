import { ReactInstance } from 'react';
import * as ReactDOM from 'react-dom';

export default function findHTMLElement(e: ReactInstance): HTMLElement | undefined {
  const el = ReactDOM.findDOMNode(e);
  if (el && (el as HTMLElement).focus) {
    return el as HTMLElement;
  }

  return undefined;
}
