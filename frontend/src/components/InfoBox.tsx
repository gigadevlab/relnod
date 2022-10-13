import React from 'react';
import { IconButton } from "@mui/material";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { nodeInfoService } from "../api/services";
import { Node } from '../constants/types';


interface InfoBoxProps {
  node: Node;
  onNodeInfoFetched?: (node: Node) => void;
}

const InfoBox = (props: InfoBoxProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [shortDescription, setShortDescription] = React.useState<string>("");
  const [longDescription, setLongDescription] = React.useState<string>("");

  React.useEffect(() => {
    setOpen(false);
    setShortDescription("");
    setLongDescription("");
  }, [props.node]);

  return (
    <div style={{position: "absolute", padding: "0.5rem", top: 0}}>
      {!open ?
        <IconButton
          color="primary"
          onClick={() => {
            const node: Node = props.node;
            setOpen(true);
            nodeInfoService({
              type: node.type.description,
              key: node.key,
              callback: (res: { short_description: string, long_description: string }) => {
                let {short_description, long_description} = res;
                short_description = short_description || "";
                long_description = long_description || "";

                setShortDescription(short_description);
                setLongDescription(long_description);

                node.label = `${node.key}\n${short_description}`;
                node.short_description = short_description;
                node.long_description = long_description;
                props.onNodeInfoFetched?.(node);
              }
            });
          }}
        >
          <InfoOutlinedIcon/>
        </IconButton> :
        <div style={{
          width: "500px",
          backgroundColor: "lightyellow",
          border: "1px solid lightgray",
        }}>
          <IconButton
            color="primary"
            onClick={() => {
              setOpen(false)
            }}
          >
            <InfoOutlinedIcon/>
          </IconButton>
          <div
            style={{padding: "1rem", display: "flex" }}
            dangerouslySetInnerHTML={{ __html: longDescription }}
          />
        </div>
      }
    </div>
  )
}

export default InfoBox;
