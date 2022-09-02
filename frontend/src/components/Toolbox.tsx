import React from 'react';
import { Edge } from 'vis-network';

import { MEDIA_URL, typeInfoService } from "../api/services";
import { Node, NodeType } from '../constants/types';

import "../static/menu.css";


interface ToolboxProps {
  // network: Network,
  nextNodeId: number;
  selectedNodes: Node[];
  onCreateNode?: (node: Node) => any;
  onDeleteNode?: (nodes: Node[]) => any;
  onRelateNodes?: (edges: Edge[]) => any;
}

const Toolbox = (props: ToolboxProps) => {
  const [types, setTypes] = React.useState<NodeType[]>([]);
  const [key, setKey] = React.useState<string>();

  React.useEffect(() => {
    typeInfoService({
      callback: (types: NodeType[]) => {
        setTypes(types)
      }
    });
  }, []);

  // React.useEffect(() => {
  //   props.network.on('hoverNode', (properties) => {
  //     console.log("Hover:", properties.node);
  //   });
  // }, [props.network]);

  const handleCreate = (type: NodeType) => {
    if (props.onCreateNode && key) {
      let node: Node = {
        id: props.nextNodeId,
        key: key,
        type: type,
        label: key,
        image: MEDIA_URL + type.icon
      };
      props.onCreateNode(node);
    }
  };

  const handleDelete = (nodes: Node[]) => {
    if (props.onDeleteNode) {
      props.onDeleteNode(nodes);
    }
  };

  const handleRelate = (nodes: Node[]) => {
    if (props.onRelateNodes) {
      let newEdges: Edge[] = [];

      nodes.forEach((node, ix) => {
        if (ix !== props.selectedNodes.length - 1)
          newEdges.push({from: node.id, to: nodes[ix + 1].id})
      })

      console.log(newEdges);

      props.onRelateNodes(newEdges);
    }
  }

  return (
    <div>
      <h2>Toolbox</h2>
      <div className="cards">
        {
          types.map((type) => (
            <button
              className="cards__item"
              aria-details={"Description:" + type.description}
              onClick={() => handleCreate(type)}
            >
              <img src={MEDIA_URL + type.icon} width={32} height={32} style={{objectFit: "contain"}}/>
              <div style={{display: "inline-block", float: "right"}}>{type.name}</div>
            </button>
          ))
        }
      </div>
      <div style={{margin: "20px", float: "left"}}>
        <div>
          <label>Key: </label>
          <input
            type="text"
            name="key"
            value={key}
            onChange={(event) => {
              setKey(event.target.value);
            }}
          />
          {props.selectedNodes.length > 0 &&
          <>
            <button onClick={() => handleDelete(props.selectedNodes)}>Delete</button>
          </>
          }
          {props.selectedNodes.length > 1 &&
          <>
            <button onClick={() => handleRelate(props.selectedNodes)}>Relate</button>
          </>
          }
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
