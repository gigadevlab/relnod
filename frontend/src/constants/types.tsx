type Action = { name: string, description: string };
type Node = {id: number | string, key: string, type: NodeType, image: string, label?: string, title?: any};
type Edge = {id: number | string, from: number | string, to: number | string};
type NodeType = { id: number, name: string, description: string, icon: string };

export type {
  Action,
  Node,
  Edge,
  NodeType,
}
