import vis from 'vis-network';

type Action = {
  name: string,
  description: string,
  nodes: {key: string, type: number}[],
};

interface Node extends vis.Node {
  id: number | string;
  key: string;
  type: NodeType;
  image: string;
  label?: string;
  title?: any;
  short_description?: string;
  long_description?: string;
};

interface Edge extends vis.Edge {id: number | string, from: number | string, to: number | string, label?: string};

type NodeType = { id: number, name: string, description: string, icon: string };

export type {
  Action,
  Node,
  Edge,
  NodeType,
}
