import merge from 'lodash-es/merge';

export default function normalizeNodes(nodes) {
  return [].concat(nodes).reduce((obj, node) => doNormalize(node, obj), {});
}

function doNormalize(entity, object) {
  object[entity.id] = entity;

  const ids = [];
  entity.children.forEach(child => {
    ids.push(child.id);
    merge(object[child.id], child);
    doNormalize(child, object);
  });
  delete entity.children;
  entity.childIds = ids;

  return object;
}
