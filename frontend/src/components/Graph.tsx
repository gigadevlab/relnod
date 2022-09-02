import React from 'react';
import vis, { Network, Edge } from 'vis-network';

import { infoService, MEDIA_URL, relationService } from "../api/services";
import { Node } from '../constants/types';

import Actions from './Actions';
import Toolbox from './Toolbox';

import "../index.css";
import Popup from './Popup';


const Graph = () => {
  const networkContainer = React.useRef<HTMLDivElement>(null);
  const optionsContainer = React.useRef<HTMLDivElement>(null);

  // const [network, setNetwork] = React.useState<Network | null>(null);
  const [popup, setPopup] = React.useState<{ node: Node, left: number, top: number }>();

  const [nextNodeId, setNextNodeId] = React.useState<number>(1);
  const [nodesOrdered, setNodesOrdered] = React.useState<any[]>([]);

  const [nodes, setNodes] = React.useState<any[]>([]);
  const [edges, setEdges] = React.useState<any[]>([]);
  const [options, setOptions] = React.useState<vis.Options>();

  const [selectedNodes, setSelectedNodes] = React.useState<any[]>([]);

  React.useEffect(() => {
    infoService((nodes: any) => {
      let newNodes: Array<Node> = new Array<Node>();

      nodes.forEach((node: Node) => {
        node.label = node.key;
        node.image = MEDIA_URL + node.type.icon;
        node.title = "Popup";
        // newNodes.splice(node.id, 0, node);
        newNodes[node.id] = node;

        if (node.id > nextNodeId) setNextNodeId(node.id);
      });

      setNodesOrdered(newNodes);
    });
    relationService((edges: any) => {
      setEdges(edges);
    });
  }, []);

  React.useEffect(() => {
    let filtered: vis.Node[] = nodesOrdered.filter((el: Node) => el);
    setNodes(filtered);
  }, [nodesOrdered]);

  React.useEffect(() => {
    setOptions({
      autoResize: true,
      height: '100%',
      width: '100%',
      nodes: {
        shape: "circularImage",
        scaling: {
          min: 10,
          max: 30,
        },
        font: {
          size: 12,
          face: "Tahoma",
        },
      },
      edges: {
        color: {inherit: true},
        width: 0.15,
        smooth: {
          enabled: true,
          type: "continuous",
          roundness: 1
        },
      },
      interaction: {
        hideEdgesOnDrag: true,
        tooltipDelay: 200,
        multiselect: true,
        hover: true
      },
      configure: {
        filter: function (option: any, path: any) {
          if (option === "inherit") {
            return true;
          }
          if (option === "type" && path.indexOf("smooth") !== -1) {
            return true;
          }
          if (option === "roundness") {
            return true;
          }
          if (option === "width") {
            return true;
          }
          if (option === "shape") {
            return true;
          }
          if (option === "hideEdgesOnDrag") {
            return true;
          }
          if (option === "hideNodesOnDrag") {
            return true;
          }
          return false;
        },
        container: optionsContainer.current,
        showButton: false,
      },
      physics: true,
      // manipulation: {
      //   enabled: true,
      //   initiallyActive: true,
      //   addNode: (node: any, callback: any) => {
      //     console.log("Add Node");
      //     node = {
      //       label: 'New',
      //       image: MEDIA_URL + "person-icon.png",
      //       type: {
      //         key: 1,
      //         name: "Person"
      //       }
      //     }
      //     setNodes([...nodes, node]);
      //     console.log("Added Node", nodes);
      //     callback(node);
      //   },
      //   // addEdge: true,
      //   editNode: (node: any, callback: any) => {
      //     console.log("edit:", node);
      //     // callback(handleNodeEdit(node));
      //   },
      //   editEdge: true,
      //   deleteNode: true,
      //   deleteEdge: true,
      // }
    });
  }, []);

  React.useEffect(() => {
    let tsest: {[id: string]: Edge} = {
      "e35074b5-2e9a-4c13-b72e-a7dc996caeb7": {
        "from": 1,
        "to": 2,
        "id": "e35074b5-2e9a-4c13-b72e-a7dc996caeb7"
      }
    }

    let edges = Object.values(tsest)

    console.log(edges, tsest);

    const network =
      networkContainer.current &&
      new Network(networkContainer.current, {nodes, edges}, options);

    // setNetwork(network);

    if (network) {
      network.on('click', (properties) => {
        let selNodes = properties.nodes.map((id: number) => nodesOrdered[id]);
        setSelectedNodes(selNodes);

        let selEdges = properties.edges.map((id: number) => id)

        console.log(selEdges);

        setPopup(undefined);
      });
      network.on('hoverNode', (properties) => {
        const {x, y} = properties.pointer.DOM;
        setPopup({node: nodesOrdered[properties.node], left: x, top: y});
      });
    }
  }, [networkContainer, nodes, edges, options]);

  const handleCreateNode = (node: Node) => {
    setNodesOrdered([...nodes, node]);
    console.log("New node: ", node);
  }

  const handleDeleteNode = (nodesToDel: Node[]) => {
    let newNodes = [...nodesOrdered];

    nodesToDel.forEach((node) => {
      newNodes.splice(node.id, 1, null);
    });

    setNodesOrdered(newNodes);
    setSelectedNodes([]);
  }

  const handleRelateNodes = (newEdges: Edge[]) => {
    setEdges([...edges, ...newEdges]);
    console.log([...edges, ...newEdges]);
  }

  return (
    <div className="grid-container">
      <div ref={networkContainer} id="network-container"/>
      <div ref={optionsContainer} id="options-container"/>
      <div id="toolbox-container">
        <Toolbox
          // network={network}
          nextNodeId={nextNodeId}
          selectedNodes={selectedNodes}
          onCreateNode={(node: Node) => handleCreateNode(node)}
          onDeleteNode={(nodesToDel: Node[]) => handleDeleteNode(nodesToDel)}
          onRelateNodes={(newEdges: Edge[]) => handleRelateNodes(newEdges)}
        />
      </div>
      <div id="actionsMenu-container">
        <Actions
          selectedNodes={selectedNodes}
        />
        {/*{popup && <Popup position={{left: popup.left, top: popup.top}} content node={popup.node}/>}*/}
      </div>
    </div>
  );
};

export default Graph;
