export type Length = number;

export type ID = number;

export interface Node {
  id: ID;
  name: string;
  children: Array<Node>;
  type: string;
}

export interface LayoutNode extends Node {}
export interface ScreenNode extends Node {
  width: Length;
  height: Length;
}
export interface TextNode extends Node {
  rich: string;
  plain: string;
}
