import React from "react";

import { Node } from '../constants/types';


interface PopupProps {
  position: { left: number, top: number };
  content: any;
  node: Node;
}

const Popup = (props: PopupProps) => {
  return(
    <div style={{
      position: "absolute",
      left: props.position.left,
      top: props.position.top,
      backgroundColor: "#ffbebe",
      borderRadius: "9px",
      opacity: 0.5,
    }}>
      <h2>{props.node.type.name} | {props.node.key}</h2>

    </div>
  )
}

export default Popup;
