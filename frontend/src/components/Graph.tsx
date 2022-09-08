import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import vis, { Network } from 'vis-network';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { infoService, MEDIA_URL, relationService } from "../api/services";
import { Edge, Node } from '../constants/types';

import Actions from './Actions';
import Toolbox from './Toolbox';

import "../index.css";
import Popup from './Popup';


const Graph = () => {
  const networkContainer = React.useRef<HTMLDivElement>(null);
  const optionsContainer = React.useRef<HTMLDivElement>(null);

  const [popup, setPopup] = React.useState<{ node: Node, left: number, top: number }>();

  const [nextNodeId, setNextNodeId] = React.useState<number>(1);
  const [nodesOrdered, setNodesOrdered] = React.useState<any[]>([]);

  const [nextEdgeId, setNextEdgeId] = React.useState<number>(1);
  const [edgesOrdered, setEdgesOrdered] = React.useState<any[]>([]);

  const [nodes, setNodes] = React.useState<any[]>([]);
  const [edges, setEdges] = React.useState<any[]>([]);
  const [options, setOptions] = React.useState<vis.Options>();

  const [selectedNodes, setSelectedNodes] = React.useState<any[]>([]);
  const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);

  React.useEffect(() => {
    infoService((nodes: any) => {
      let newNodes: Array<Node> = new Array<Node>();

      let localNodesStr = window.localStorage.getItem("nodes");
      let localNodes: Node[];
      if (localNodesStr) {
        localNodes = JSON.parse(localNodesStr);
        console.log("local:", JSON.parse(localNodesStr));
      }

      nodes.forEach((node: Node) => {
        node.label = node.key;
        node.image = MEDIA_URL + node.type.icon;
        node.title = "Popup";
        newNodes[node.id] = node;

        if (node.id > nextNodeId) setNextNodeId(node.id + 1);
      });

      console.log(newNodes);

      setNodesOrdered(newNodes);
    });

    relationService((edges: any) => {
      let newEdges: Array<Edge> = new Array<Edge>();

      edges.forEach((edge: Edge, ix: number) => {
        edge.id = ix;
        newEdges[ix] = edge;
      });

      console.log(newEdges);

      setNextEdgeId(edges.length);
      setEdgesOrdered(newEdges);
    });
  }, []);

  React.useEffect(() => {
    let filtered: vis.Node[] = nodesOrdered.filter((el: Node) => el);
    setNodes(filtered);

    window.localStorage.setItem("nodes", JSON.stringify(nodesOrdered));
  }, [nodesOrdered]);

  React.useEffect(() => {
    let filtered: vis.Edge[] = edgesOrdered.filter((el: Edge) => el);
    setEdges(filtered);
  }, [edgesOrdered]);

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
      // configure: {
      //   filter: function (option: any, path: any) {
      //     if (option === "inherit") {
      //       return true;
      //     }
      //     if (option === "type" && path.indexOf("smooth") !== -1) {
      //       return true;
      //     }
      //     if (option === "roundness") {
      //       return true;
      //     }
      //     if (option === "width") {
      //       return true;
      //     }
      //     if (option === "shape") {
      //       return true;
      //     }
      //     if (option === "hideEdgesOnDrag") {
      //       return true;
      //     }
      //     if (option === "hideNodesOnDrag") {
      //       return true;
      //     }
      //     return false;
      //   },
      //   container: optionsContainer.current,
      //   showButton: false,
      // },
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
    const network =
      networkContainer.current &&
      new Network(networkContainer.current, {nodes, edges}, options);

    if (network) {
      network.on('click', (properties) => {
        console.log(nodesOrdered, edgesOrdered);
        console.log(properties.nodes, properties.edges);

        let selNodes = properties.nodes.map((id: number) => nodesOrdered[id]);
        setSelectedNodes(selNodes);

        let selEdges = properties.edges.map((id: number) => edgesOrdered[id]);
        setSelectedEdges(selEdges);

        setPopup(undefined);
      });
      network.on('hoverNode', (properties) => {
        const {x, y} = properties.pointer.DOM;
        setPopup({node: nodesOrdered[properties.node], left: x, top: y});
      });
    }
  }, [networkContainer, nodes, edges, options]);

  const handleCreateNode = (node: Node) => {
    console.log([...nodesOrdered, node]);

    setNodesOrdered([...nodesOrdered, node]);
    setNextNodeId(nextNodeId + 1);
  }

  const handleDeleteNode = (nodesToDel: Node[]) => {
    let newNodes = [...nodesOrdered];

    nodesToDel.forEach((node) => {
      newNodes.splice(node.id, 1, null);
    });

    setNodesOrdered(newNodes);
    setSelectedNodes([]);
  }

  const handleRelateNode = (newEdges: Edge[]) => {
    console.log([...edges, ...newEdges]);
    setEdgesOrdered([...edgesOrdered, ...newEdges]);
    setNextEdgeId(nextEdgeId + 1);
  }

  const handleDeleteEdge = (egdesToDel: Edge[]) => {
    let newEdges = [...edgesOrdered];
    egdesToDel.forEach((edge) => {
      newEdges.splice(edge.id, 1, null);
    });

    setEdgesOrdered(newEdges);
    setSelectedEdges([]);
  }

  return (
    <div>
      <div ref={networkContainer} id="network-container"/>
      {/*<div ref={optionsContainer} id="options-container"/>*/}
      <Stack
        style={{
          position: "absolute",
          border: "1px solid lightgray",
          float: "right",
          top: "3%",
          left: "74%",
          width: "450px"
        }}
        direction={"column"}
        spacing={2}
      >
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Toolbox</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div id="toolbox-container">
              <Toolbox
                nextNodeId={nextNodeId}
                nextEdgeId={nextEdgeId}
                selectedNodes={selectedNodes}
                selectedEdges={selectedEdges}
                onCreateNode={(node: Node) => handleCreateNode(node)}
                onDeleteNode={(nodesToDel: Node[]) => handleDeleteNode(nodesToDel)}
                onRelateNode={(newEdges: Edge[]) => handleRelateNode(newEdges)}
                onDeleteEdge={(edgesToDel: Edge[]) => handleDeleteEdge(edgesToDel)}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Actions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div id="actionsMenu-container">
              <Actions
                selectedNodes={selectedNodes}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </div>
  );
};

export default Graph;
