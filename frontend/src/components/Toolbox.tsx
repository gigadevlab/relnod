import React from 'react';
import { Avatar, Button, Grid, Stack, TextField } from '@mui/material';

import { MEDIA_URL } from "../api/services";
import { Edge, Node, NodeType } from '../constants/types';

import "../static/menu.css";

import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';


interface ToolboxProps {
  types: NodeType[];
  selectedNodes: Node[];
  selectedEdges: Edge[];
  onCreateNode?: (node: Node) => void;
  onDeleteNode?: (nodes: Node[]) => void;
  onDeleteOthers?: (nodes: Node[]) => void;
  onRelateNode?: (edges: { [key: string]: Edge }) => void;
  onDeleteEdge?: (edges: Edge[]) => void;
}

const Toolbox = (props: ToolboxProps) => {
  const [key, setKey] = React.useState<string>("");

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

  const handleDeleteOthers = (nodes: Node[]) => {
    if (props.onDeleteOthers) {
      props.onDeleteOthers(nodes);
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
          props.types.map((type) => (
            <Grid item xs={3} key={type.name}>
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
            <Button
              startIcon={<DeleteOutlineIcon/>}
              onClick={() => handleDelete(props.selectedNodes)}
            >Delete Selected Node(s)</Button>
            }
            {props.selectedNodes.length > 0 &&
            <Button
              startIcon={<DeleteSweepOutlinedIcon/>}
              onClick={() => handleDeleteOthers(props.selectedNodes)}
            >Delete Non-Selected Node(s)</Button>
            }
            {props.selectedNodes.length > 1 &&
            <Button
              startIcon={<AddLinkIcon/>}
              onClick={() => handleRelate(props.selectedNodes)}
            >Relate Node(s)</Button>
            }
            {props.selectedEdges.length > 0 &&
            <Button
              startIcon={<LinkOffIcon/>}
              onClick={() => handleDerelate(props.selectedEdges)}
            >Delete Relation(s)</Button>
            }
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default Toolbox;
