import React from 'react';
import { Network } from 'vis-network';
import { IconButton, Stack } from '@mui/material';

import { actionService, typeActionService } from "../api/services";
import { Action, Edge, Node } from '../constants/types';
import DateRangePicker from './DateRangePicker';

import WorkspacesIcon from '@mui/icons-material/Workspaces';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


interface ActionsProps {
  network: Network;
  selectedNodes: Node[];
  actionCallback?: ({nodes, edges}: { nodes: Node[], edges: Edge[] }) => void;
  onNodeChange?: (node: Node) => void
}

const Actions = (props: ActionsProps) => {
  const [actions, setActions] = React.useState<Action[]>([]);
  const [dateRange, setDateRange] = React.useState<{ start?: Date, end?: Date }>({start: undefined, end: undefined});

  React.useEffect(() => {
    if (props.selectedNodes.length === 1) {
      typeActionService({
        callback: (actions: Action[]) => {
          let nodes = props.selectedNodes.map((node) => {
            return {key: node.key, type: node.type.id}
          });
          actions.forEach((action) => action.nodes = nodes);
          setActions(actions);
        },
        pk: props.selectedNodes[0].type.name.toLowerCase()
      });
    } else {
      // TODO: Handle multi-node actions.
      setActions([]);
    }
  }, [props.selectedNodes]);

  const renderTypeActions = (actions: Action[]) => {
    return (
      <div>
        {
          actions.map((action) => (
            <button
              key={action.name}
              style={{display: "block", width: "100%", margin: "5px 0 0 0"}}
              onClick={() => {
                actionService({
                  callback: ({nodes, edges}: { nodes: Node[], edges: Edge[] }) => {
                    props.actionCallback?.({nodes, edges});
                  },
                  name: action.name,
                  nodes: action.nodes,
                  filter: {date__between: [dateRange.start, dateRange.end]}
                })
              }}
            >
              {action.name} | Description: {action.description}
            </button>
          ))
        }
      </div>
    )
  };

  return (
    <div>
      <h3>Selected Nodes</h3>
      <table>
        <thead>
        <tr>
          <th>Type</th>
          <th>Key</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {
          props.selectedNodes.map((node) =>
            <>
              <tr key={node.key}>
                <td>{node.type.name}</td>
                <td>{node.key}</td>
                <td>
                  <Stack direction={"row"}>
                    <IconButton
                      disabled={node.physics}
                      size={"small"}
                      onClick={() => {
                        node.physics = true;
                        props.onNodeChange?.(node);
                      }}
                    >{!node.physics && <LockOpenOutlinedIcon fontSize={"inherit"}/>}
                    </IconButton>
                    <IconButton
                      size={"small"}
                      onClick={() => props.network.clusterByConnection(node.key)}
                    ><WorkspacesIcon fontSize={"inherit"}/></IconButton>
                    <IconButton
                      size={"small"}
                      onClick={() => props.network.focus(node.key)}
                    ><MyLocationIcon fontSize={"inherit"}/></IconButton>
                  </Stack>
                </td>
              </tr>
            </>
          )
        }
        </tbody>
      </table>

      <h3>Actions</h3>
      <DateRangePicker onChange={(start, end) => {
        setDateRange({start: start, end: end})
      }}/>
      {renderTypeActions(actions)}
    </div>
  )
};

export default Actions;
