import { 
  createSVG, 
  createGroup, 
  createLine, 
  createText, 
  createInfoDot, 
  createPath, 
  createRect,
  createDate
} from "./tools"

import { createControl, createGraphSettings } from './control'
import { createAxis } from './axis'
import Graph from './graph'

export default class JonChart {
  constructor(data){
    localStorage.clear()
    this.data = data
    this.svgWidth = 800; 
    this.svgHeight = 400
    this.yMax = 0
    this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    this.createGroup = createGroup
    this.createLine = createLine
    this.createText = createText
    this.createInfoDot = createInfoDot
    this.createPath = createPath
    this.createRect = createRect
    this.createDate = createDate
    this.createGraph = (data) => new Graph(data)
    this.createGraphSettings = createGraphSettings
    this.createAxis = createAxis
    this.init()
  }

  init() {
    console.log('DATABASE', this.data)

    this.data.map((graphElement, graphId) => {
      this.createSVG = createSVG(this.svgWidth, this.svgHeight, graphId);
      createGroup({
        where: document.querySelector(`#jonSurface${graphId}`),
        className: "jon-cartesian-grid"
      });
      this.createControl = createControl(this.monthNames, this.svgWidth, this.svgHeight, graphElement, graphId);
      this.createAxis(this.svgWidth, this.svgHeight, graphId)
      this.createGraphSettings(graphElement.names, {
        monthNames: this.monthNames,
        svgWidth: this.svgWidth,
        svgHeight: this.svgHeight,
        graphData: graphElement
      }, graphId, graphElement.colors);
      this.createGraph({
        monthNames: this.monthNames,
        svgWidth: this.svgWidth,
        svgHeight: this.svgHeight,
        graphData: graphElement,
        graphId: graphId
      });
    });
  }
}