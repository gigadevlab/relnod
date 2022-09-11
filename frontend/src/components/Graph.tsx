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
  const [network, setNetwork] = React.useState<Network>();

  const networkContainer = React.useRef<HTMLDivElement>(null);
  const optionsContainer = React.useRef<HTMLDivElement>(null);

  const [options, setOptions] = React.useState<vis.Options>({});

  const [nodeMap, setNodeMap] = React.useState<{[key: string]: Node}>({});
  const [edgeMap, setEdgeMap] = React.useState<{[key: string]: Edge}>({});

  const [selectedNodes, setSelectedNodes] = React.useState<any[]>([]);
  const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);

  const nodeArr2nodeMap = (nodes: Node[]) => {
    let newNodeMap: {[key: string]: Node} = {};

    nodes.forEach((node: Node) => {
      node.id = node.key;
      node.label = node.key;
      node.image = MEDIA_URL + node.type.icon;
      node.title = "Popup";

      newNodeMap[node.key] = node;
    });

    return newNodeMap
  }

  const pushNodes = (nodes: Node[]) => {
    setNodeMap({...nodeMap, ...nodeArr2nodeMap(nodes)});
  }

  const pushEdges = (edges: Edge[]) => {
    let newEdgeMap: {[key: string]: Edge} = {};

    edges.forEach((edge: Edge, ix: number) => {
      edge.id = `${edge.from}-${edge.to}`;
      newEdgeMap[edge.id] = edge;
    });

    setEdgeMap({...edgeMap, ...newEdgeMap});
  }

  // React.useEffect(() => {
  //   infoService((nodes: any) => {
  //     let localNodesStr = window.localStorage.getItem("nodes");
  //     let localNodes: Node[];
  //     if (localNodesStr) {
  //       localNodes = JSON.parse(localNodesStr);
  //       // console.log("local:", JSON.parse(localNodesStr));
  //     }
  //
  //     pushNodes(nodes);
  //   });
  //
  //   relationService((edges: any) => {
  //     pushEdges(edges);
  //   });
  // }, []);

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
        borderWidth: 1,
        borderWidthSelected: 5,
      },
      edges: {
        color: {inherit: true},
        width: 1,
        selectionWidth: 5,
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
      physics: false,
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
    if (networkContainer.current) setNetwork(new Network(networkContainer.current, {}, {}))
  }, [networkContainer])

  React.useEffect(() => {
    if (network) {
      let nodes: vis.Node[] = Object.values(nodeMap);
      let edges: vis.Edge[] = Object.values(edgeMap);

      network.setData({nodes, edges});
      network.setOptions(options);

      network.on('click', (properties) => {
        console.log(nodeMap, edgeMap);

        let selNodes = properties.nodes.map((id: string) => nodeMap[id]);
        setSelectedNodes(selNodes);

        let selEdges = properties.edges.map((id: number) => edgeMap[id]);
        setSelectedEdges(selEdges);

        console.log(selNodes, selEdges);
      });
      network.on('hoverNode', (properties) => {
        const {x, y} = properties.pointer.DOM;
      });
    }
  }, [network, nodeMap, edgeMap, options]);

  const handleCreateNode = (node: Node) => {
    setNodeMap({...nodeMap, [node.key]: node});
  }

  const handleDeleteNode = (nodesToDel: Node[]) => {
    let newNodeMap = {...nodeMap};

    nodesToDel.forEach((node) => {
      delete newNodeMap[node.id];
    });

    setNodeMap(newNodeMap);
    setSelectedNodes([]);
  }

  const handleDeleteOtherNodes = (nodesToNotDel: Node[]) => {
    setNodeMap(nodeArr2nodeMap(nodesToNotDel));
  }

  const handleRelateNode = (newEdges: {[key: string]: Edge}) => {
    setEdgeMap({...edgeMap, ...newEdges})
  }

  const handleDeleteEdge = (egdesToDel: Edge[]) => {
    let newEdgeMap = {...edgeMap};

    egdesToDel.forEach((edge) => {
      delete newEdgeMap[edge.id];
    });

    setEdgeMap(newEdgeMap);
    setSelectedEdges([]);
  }

  return (
    <div>
      <div ref={networkContainer} id="network-container"/>
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
        // spacing={2}
        sx={{backgroundColor: "lightyellow"}}
      >
        <Accordion style={{backgroundColor: "lightyellow"}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Toolbox</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div id="toolbox-container">
              <Toolbox
                selectedNodes={selectedNodes}
                selectedEdges={selectedEdges}
                onCreateNode={(node: Node) => handleCreateNode(node)}
                onDeleteNode={(nodesToDel: Node[]) => handleDeleteNode(nodesToDel)}
                onRelateNode={(newEdges: {[key: string]: Edge}) => handleRelateNode(newEdges)}
                onDeleteEdge={(edgesToDel: Edge[]) => handleDeleteEdge(edgesToDel)}
                onDeleteOthers={(nodesToNotDel: Node[]) => handleDeleteOtherNodes(nodesToNotDel)}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{backgroundColor: "lightyellow"}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Actions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div id="actionsMenu-container">
              {network &&
                <Actions
                  network={network}
                  selectedNodes={selectedNodes}
                  actionCallback={({nodes, edges}: {nodes: Node[], edges: Edge[]}) => {
                    console.log(nodes, edges);
                    pushNodes(nodes);
                    pushEdges(edges);
                  }}
                />
              }
            </div>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </div>
  );
};

export default Graph;
