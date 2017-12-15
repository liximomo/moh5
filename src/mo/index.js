import { ARTBOARD } from '../TypeOfInternalComponent';
let id = 0;

export function genId() {
  id += 1;
  return id;
}

// $todo 创建 node 后 normalize
export function createElement(type, attrs = {}, children = []) {
  const node = Object.create(null);

  for (const key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      node[key] = attrs[key];
    }
  }

  node.type = type;
  node.children = children;
  node.id = genId();
  node.name = `${node.type}-${node.id}`;

  return node;
}

export function getDemisioinPropertyNames() {
  return ['width', 'height'];
}


export function getPositionPropertyNames() {
  return ['position', 'x', 'y'];
}

export const createArtborad = createElement.bind(null, ARTBOARD);
