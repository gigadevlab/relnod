import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography } from '@mui/material';
import vis, { Network } from 'vis-network';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { MEDIA_URL } from "../api/services";
import { Edge, Node } from '../constants/types';

import Actions from './Actions';
import Toolbox from './Toolbox';

import "../index.css";

import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';


const Graph = () => {
  const [network, setNetwork] = React.useState<Network>();
  const networkContainer = React.useRef<HTMLDivElement>(null);

  const [options, setOptions] = React.useState<vis.Options>({});

  const [nodeMap, setNodeMap] = React.useState<{ [key: string]: Node }>({});
  const [edgeMap, setEdgeMap] = React.useState<{ [key: string]: Edge }>({});

  const [selectedNodes, setSelectedNodes] = React.useState<any[]>([]);
  const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);

  const nodeArr2nodeMap = (nodes: Node[]) => {
    let newNodeMap: { [key: string]: Node } = {};

    nodes.forEach((node: Node) => {
      node.id = node.key;
      node.label = node.key.toString();
      node.image = MEDIA_URL + node.type.icon;
      node.title = `${node.type.name} | ${node.key}`;

      newNodeMap[node.key] = node;
    });

    return newNodeMap
  }

  const pushNodes = (nodes: Node[]) => {
    setNodeMap({...nodeMap, ...nodeArr2nodeMap(nodes)});
  }

  const pushEdges = (edges: Edge[]) => {
    let newEdgeMap: { [key: string]: Edge } = {};

    edges.forEach((edge: Edge, ix: number) => {
      edge.id = `${edge.from}-${edge.to}`;
      newEdgeMap[edge.id] = edge;
    });

    setEdgeMap({...edgeMap, ...newEdgeMap});
  }


  const getFromLocal = () => {
    let localNodeMapStr = window.localStorage.getItem("nodeMap");
    let localEdgeMapStr = window.localStorage.getItem("edgeMap");

    if (localNodeMapStr) {
      console.log(JSON.parse(localNodeMapStr));
      setNodeMap({...nodeMap, ...JSON.parse(localNodeMapStr)});
    }
    if (localEdgeMapStr) setEdgeMap({...edgeMap, ...JSON.parse(localEdgeMapStr)});
  };

  const saveToLocal = () => {
    window.localStorage.setItem("nodeMap", JSON.stringify(nodeMap));
    window.localStorage.setItem("edgeMap", JSON.stringify(edgeMap));
  };

  React.useEffect(() => {
    setOptions({
      autoResize: true,
      height: '100%',
      width: '100%',
      nodes: {
        shape: "circularImage",
        physics: true,
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
      physics: {
        enabled: true,
        barnesHut: {
          theta: 0.5,
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0
        },
        forceAtlas2Based: {
          theta: 0.5,
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springConstant: 0.08,
          springLength: 100,
          damping: 0.4,
          avoidOverlap: 0
        },
        repulsion: {
          centralGravity: 0.2,
          springLength: 200,
          springConstant: 0.05,
          nodeDistance: 100,
          damping: 0.09
        },
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 100,
          springConstant: 0.01,
          nodeDistance: 120,
          damping: 0.09,
          avoidOverlap: 0
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'barnesHut',
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true
        },
        timestep: 0.5,
        adaptiveTimestep: true,
        wind: {x: 0, y: 0}
      },
      layout: {
        randomSeed: undefined,
        improvedLayout: false,
        clusterThreshold: 150,
        hierarchical: {
          enabled: false,
          levelSeparation: 150,
          nodeSpacing: 200,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'UD',        // UD, DU, LR, RL
          sortMethod: 'hubsize',  // hubsize, directed
          shakeTowards: 'leaves'  // roots, leaves
        }
      }
    });
  }, []);

  React.useEffect(() => {
    if (networkContainer.current) setNetwork(new Network(networkContainer.current, {}, {}))
  }, [networkContainer])

  React.useEffect(() => {
    if (network) {
      let nodes: Node[] = Object.values(nodeMap);
      let edges: Edge[] = Object.values(edgeMap);

      network.setData({nodes, edges});
      network.setOptions(options);

      network.on('click', (properties) => {
        let selNodes = properties.nodes.map((id: string) => nodeMap[id]);
        setSelectedNodes(selNodes);

        let selEdges = properties.edges.map((id: number) => edgeMap[id]);
        setSelectedEdges(selEdges);
      });
      network.on('dragEnd', (properties) => {
        let dragNodeMap: { [key: string]: Node } = {};

        properties.nodes.forEach((id: string) => {
          dragNodeMap[id] = {...nodeMap[id], ...network.getPosition(id), physics: false}
        })

        if (Object.entries(dragNodeMap).length !== 0) setNodeMap({...nodeMap, ...dragNodeMap});
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

  const handleRelateNode = (newEdges: { [key: string]: Edge }) => {
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
        direction={"column"}
        // spacing={2}
        sx={{
          backgroundColor: "lightyellow",
          position: "absolute",
          border: "1px solid lightgray",
          float: "left",
          top: "3%",
          left: "calc(100% - 500px - 1rem)",
          width: "500px",
          transformOrigin: "top right",
        }}
      >
        <Stack direction={"row"} sx={{padding: "0.5rem"}} spacing={1}>
          <Button
            variant={"outlined"}
            startIcon={<CloudDownloadOutlinedIcon/>}
            onClick={saveToLocal}
          >Save</Button>
          <Button
            variant={"outlined"}
            startIcon={<CloudUploadOutlinedIcon/>}
            onClick={getFromLocal}
          >Get</Button>
        </Stack>
        <Accordion sx={{backgroundColor: "lightyellow"}} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Toolbox</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0}}>
            <div id="toolbox-container">
              <Toolbox
                selectedNodes={selectedNodes}
                selectedEdges={selectedEdges}
                onCreateNode={(node: Node) => handleCreateNode(node)}
                onDeleteNode={(nodesToDel: Node[]) => handleDeleteNode(nodesToDel)}
                onRelateNode={(newEdges: { [key: string]: Edge }) => handleRelateNode(newEdges)}
                onDeleteEdge={(edgesToDel: Edge[]) => handleDeleteEdge(edgesToDel)}
                onDeleteOthers={(nodesToNotDel: Node[]) => handleDeleteOtherNodes(nodesToNotDel)}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{backgroundColor: "lightyellow"}} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Actions</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0}}>
            <div id="actionsMenu-container">
              {network &&
              <Actions
                network={network}
                selectedNodes={selectedNodes}
                actionCallback={({nodes, edges}: { nodes: Node[], edges: Edge[] }) => {
                  console.log(nodes, edges);
                  pushNodes(nodes);
                  pushEdges(edges);
                }}
                onNodeChange={(node) => pushNodes([node])}
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
