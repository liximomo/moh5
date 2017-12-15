export default function generateTree() {
  let tree = {
    0: {
      id: 0,
      childIds: [],
      name: 'root',
    },
  };

  for (let i = 1; i < 4; i++) {
    let parentId = Math.floor(Math.pow(Math.random(), 2) * i);
    tree[i] = {
      id: i,
      name: `node_${i}`,
      childIds: [],
    };
    tree[parentId].childIds.push(i);
  }

  return tree;
}
