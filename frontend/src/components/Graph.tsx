import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import vis, { Network } from 'vis-network';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

import { MEDIA_URL, typeInfoService } from "../api/services";
import { Edge, Node, NodeType } from '../constants/types';
import { download } from "../utils/fileIO";

import Actions from './Actions';
import InfoBox from './InfoBox';
import Toolbox from './Toolbox';

import "../index.css";


const Graph = () => {
  const [network, setNetwork] = React.useState<Network>();
  const networkContainer = React.useRef<HTMLDivElement>(null);

  const [options, setOptions] = React.useState<vis.Options>({});

  const [nodeMap, setNodeMap] = React.useState<{ [key: string]: Node }>({});
  const [edgeMap, setEdgeMap] = React.useState<{ [key: string]: Edge }>({});

  const [selectedNodes, setSelectedNodes] = React.useState<any[]>([]);
  const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);

  const [types, setTypes] = React.useState<NodeType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    typeInfoService({
      callback: (types: NodeType[]) => {
        setTypes(types)
      }
    });
  }, []);

  const nodeArr2nodeMap = (nodes: Node[]) => {
    let newNodeMap: { [key: string]: Node } = {};

    nodes.forEach((node: Node) => {
      node.id = node.key;
      node.label = `${node.key}\n${node.short_description}`;
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

    edges.forEach((edge: Edge) => {
      edge.id = `${edge.from}-${edge.to}`;
      newEdgeMap[edge.id] = edge;
    });

    setEdgeMap({...edgeMap, ...newEdgeMap});
  }

  const getFromLocal = () => {
    setNodeMap({...nodeMap, ...JSON.parse(window.localStorage.getItem("nodeMap") || "{}")});
    setEdgeMap({...edgeMap, ...JSON.parse(window.localStorage.getItem("edgeMap") || "{}")});
  };

  const saveToLocal = () => {
    window.localStorage.setItem("nodeMap", JSON.stringify(nodeMap));
    window.localStorage.setItem("edgeMap", JSON.stringify(edgeMap));
  };

  const exportAsJSON = () => {
    download(JSON.stringify({nodeMap: nodeMap, edgeMap: edgeMap}, null, 4), "data.json", "application/JSON");
  };

  const getFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    let files = Array.from(event.target.files);
    let reader = new FileReader()

    reader.onload = event => {
      const newData = JSON.parse(event.target?.result as string || "{nodeMap: {}, edgeMap: {}}");
      setNodeMap({...nodeMap, ...newData.nodeMap});
      setEdgeMap({...edgeMap, ...newData.edgeMap});
    }
    reader.readAsText(files[0]);
  };

  const exportAsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [
      "key1", "type1",
      "relation_name",
      "key2", "type2",
      "short_description_1", "short_description_2"
    ].join(",") + "\r\n"

    Object.values(edgeMap).map((edge) => {
      let node1 = nodeMap[edge.to];
      let node2 = nodeMap[edge.from];

      if (node1 && node2) {
        let row = [
          node1.key, node1.type.id,
          edge.label,
          node2.key, node2.type.id,
          node1.short_description, node2.short_description
        ].join(",");
        csvContent += row + "\r\n";
      }
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  }

  const getFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    let files = Array.from(event.target.files);
    let reader = new FileReader()

    reader.onload = event => {
      let rows: string[][];
      const headers = ["key1", "type1", "relation_name", "key2", "type2", "short_description_1", "short_description_2"];
      const csvContent = event.target?.result as string || "";

      rows = csvContent.split("\r\n").map(row => row.split(","));

      if (rows[0].sort().toString() !== headers.sort().toString()) {
        console.log("Invalid CSV data format!");
        return;
      }

      let nodes: Node[] = [];
      let edges: Edge[] = [];
      let typeMap: {[key: number]: NodeType} = {};

      types.forEach(type => typeMap[type.id] = type);

      rows.slice(1).forEach((row) => {
        let key1 = row[0];
        let type1 = typeMap[parseInt(row[1])];
        let relation_name = row[2];
        let key2 = row[3];
        let type2 = typeMap[parseInt(row[4])];
        let short_description_1 = row[5];
        let short_description_2 = row[6];

        if (key1 && key2 && type1 && type2) {
          edges.push({from: key1, to: key2, id: "", label: relation_name});
          nodes.push({
            id: key1,
            key: key1,
            type: type1,
            image: MEDIA_URL + type1?.icon,
            short_description: short_description_1,
          });
          nodes.push({
            id: key2,
            key: key2,
            type: type2,
            image: MEDIA_URL + type2?.icon,
            short_description: short_description_2,
          });
        }
      });

      pushNodes(nodes);
      pushEdges(edges);
    }
    reader.readAsText(files[0]);
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
        hover: true,
        selectConnectedEdges: true,
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

      network.on('select', (properties) => {
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

  const handleDeleteEdge = (edgesToDel: Edge[]) => {
    let newEdgeMap = {...edgeMap};

    edgesToDel.forEach((edge) => {
      delete newEdgeMap[edge.id];
    });

    setEdgeMap(newEdgeMap);
    setSelectedEdges([]);
  }

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div ref={networkContainer} id="network-container"/>
      {selectedNodes[0] && <InfoBox node={selectedNodes[0]} onNodeInfoFetched={node => handleCreateNode(node)}/>}
      <Stack
        direction={"column"}
        // spacing={2}
        sx={{
          backgroundColor: "lightyellow",
          position: "absolute",
          border: "1px solid lightgray",
          float: "left",
          top: "2%",
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
          <Button
            variant={"outlined"}
            startIcon={<DownloadIcon/>}
            onClick={exportAsJSON}
          >JSON</Button>
          <Button
            variant={"outlined"}
            component={"label"}
            startIcon={<UploadIcon/>}
          >JSON<input hidden accept="application/JSON" type="file" onChange={
            (event => getFromJSON(event))}/></Button>
          <Button
            variant={"outlined"}
            startIcon={<DownloadIcon/>}
            onClick={exportAsCSV}
          >CSV</Button>
          <Button
            variant={"outlined"}
            component={"label"}
            startIcon={<UploadIcon/>}
          >CSV<input hidden accept=".csv" type="file" onChange={
            (event => getFromCSV(event))}/></Button>
        </Stack>
        <Accordion sx={{backgroundColor: "lightyellow"}} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Toolbox</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0}}>
            <div id="toolbox-container">
              <Toolbox
                types={types}
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
                actionCallFront={() => setLoading(true)}
                actionCallback={({nodes, edges}: { nodes: Node[], edges: Edge[] }) => {
                  pushNodes(nodes);
                  pushEdges(edges);
                  setLoading(false);
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
