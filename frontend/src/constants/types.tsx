type Action = { name: string, description: string };
type Node = {id: number, key: string, type: NodeType, image: string, label?: string, title?: any};
type NodeType = { id: number, name: string, description: string, icon: string };

export type {
  Action,
  Node,
  NodeType
}
