import React from 'react';
import { Avatar, Button, Grid, Stack, TextField } from '@mui/material';

import { MEDIA_URL, typeInfoService } from "../api/services";
import { Edge, Node, NodeType } from '../constants/types';

import "../static/menu.css";


interface ToolboxProps {
  selectedNodes: Node[];
  selectedEdges: Edge[];
  onCreateNode?: (node: Node) => void;
  onDeleteNode?: (nodes: Node[]) => void;
  onRelateNode?: (edges: { [key: string]: Edge }) => void;
  onDeleteEdge?: (edges: Edge[]) => void;
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

  const handleCreate = (type: NodeType) => {
    if (props.onCreateNode && key) {
      let node: Node = {
        id: key,
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
    if (props.onRelateNode) {
      let newEdgeMap: { [key: string]: Edge } = {};

      nodes.forEach((node, ix) => {
        if (ix !== props.selectedNodes.length - 1) {
          let id = `${node.id}-${nodes[ix + 1].id}`;
          newEdgeMap[id] = {id: id, from: node.id, to: nodes[ix + 1].id};
        }
      })

      props.onRelateNode(newEdgeMap);
    }
  }

  const handleDerelate = (edges: Edge[]) => {
    if (props.onDeleteEdge) {
      props.onDeleteEdge(edges);
    }
  };

  return (
    <div>
      <Grid container spacing={1}>
        {
          types.map((type) => (
            <Grid item xs={6} key={type.name}>
              <Button
                onClick={() => handleCreate(type)}
                variant={"outlined"}
              >
                <Avatar src={MEDIA_URL + type.icon} sx={{width: 24, height: 24}}/>
                <div style={{display: "inline-block", float: "right"}}>{type.name}</div>
              </Button>
            </Grid>
          ))
        }
        <Grid item xs={12}>
          <Stack direction="column" spacing={1}>
            <TextField
              type="text"
              label="Key"
              size={"small"}
              value={key}
              onChange={(event) => {
                setKey(event.target.value);
              }}
            />
            {props.selectedNodes.length > 0 &&
            <Button onClick={() => handleDelete(props.selectedNodes)}>Delete Node</Button>
            }
            {props.selectedNodes.length > 1 &&
            <Button onClick={() => handleRelate(props.selectedNodes)}>Relate Node</Button>
            }
            {props.selectedEdges.length > 0 &&
            <Button onClick={() => handleDerelate(props.selectedEdges)}>Delete Relation</Button>
            }
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default Toolbox;
