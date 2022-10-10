import React from 'react';
import { IconButton } from "@mui/material";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { nodeInfoService } from "../api/services";
import { Node } from '../constants/types';


const InfoBox = (props: { node: Node }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [shortDescription, setShortDescription] = React.useState<string>("");
  const [longDescription, setLongDescription] = React.useState<string>("");

  return (
    <div style={{position: "absolute", padding: "0.5rem", top: 0}}>
      {!open ?
        <IconButton
          color="primary"
          onClick={() => {
            setOpen(true);
            nodeInfoService({
              type: props.node.type.description,
              key: props.node.key,
              callback: (res: { short_description: string, long_description: string }) => {
                setShortDescription(res.short_description || "");
                setLongDescription(res.long_description || "");
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
