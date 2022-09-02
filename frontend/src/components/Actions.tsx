import React from 'react';

import { actionService, typeActionService } from "../api/services";
import { Action, Node } from '../constants/types';
import DateRangePicker from './DateRangePicker';


const Actions = (props: { selectedNodes: Node[] }) => {
  const [actions, setActions] = React.useState<Action[]>([]);
  const [dateRange, setDateRange] = React.useState<{ start?: Date, end?: Date }>({start: undefined, end: undefined});

  React.useEffect(() => {
    if (props.selectedNodes.length === 1) {
      typeActionService({
        callback: (actions: Action[]) => {
          setActions(actions)
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
              style={{display: "block", width: "100%", margin: "5px 0 0 0"}}
              onClick={() => {
                actionService({
                  callback: () => {
                    console.log("ACTION COMPLETED")
                  },
                  pk: action.name,
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
        </tr>
        </thead>
        <tbody>
        {
          props.selectedNodes.map((node) =>
            <>
              <tr>
                <td>{node.type.name}</td>
                <td>{node.key}</td>
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
