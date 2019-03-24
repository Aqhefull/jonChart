import { createGroup, createInfoDot, createPath, createRect, createLine, createText } from "./tools";
import { axisSign } from './axis'

export default class Graph  {
  constructor(data){
    this.graphId = data.graphId;
    this.monthNames = data.monthNames;
    this.svgWidth = data.svgWidth
    this.svgHeight = data.svgHeight
    this.graphData = data.graphData
    this.startPointId = data.startPointId || 1;
    this.endPointId = data.endPointId || this.graphData.columns[0].length;
    this.coefScale = data.coefScale || 1
    this.graphX = this.graphData.columns[0]
    this.maximumY = 0
    this.graphLines = new Array();
    this.hoverArr = new Array();
    this.init()
  }
  init() {
    if (document.querySelector(`#jonSurface${this.graphId} .jon-line-dots-rect`)) document.querySelector(`#jonSurface${this.graphId} .jon-line-dots-rect`).remove()
    if (document.querySelector(`#jonSurface${this.graphId} .mini-graph-line`)) {
      Array.from(document.querySelectorAll(`#jonSurface${this.graphId} .mini-graph-line`)).forEach(elem => {
        elem.remove()
      })
    }
    this.dotGRect = createGroup({
      where: document.querySelector(`#jonSurface${this.graphId}`),
      className: "jon-line-dots-rect"
    });
    this.searchMaxY()
    this.createLines()
    this.hoverEvents()
  }
  searchMaxY() {
    for (var name in this.graphData.names) {
      for (let i = 0; i < this.graphData.columns.length; i++) {
        const column = this.graphData.columns[i];
        if(column[0] == name && localStorage.getItem(`${name}_${this.graphId}`) === "true") {
          for (let i = this.startPointId; i < this.endPointId; i++) {
            const element = column[i];
            if (element > this.maximumY) this.maximumY = element;
          }
        }
      }
      // for maximum, it is completely divisible by 25
      if (this.maximumY % 25 != 0) this.maximumY = this.maximumY + (25 - this.maximumY % 25)
    }
  }
  createLines() {
    for (var name in this.graphData.names) {
      for (let i = 0; i < this.graphData.columns.length; i++) {
        const column = this.graphData.columns[i];
        if (column[0] == name && localStorage.getItem(`${name}_${this.graphId}`) === "true") {
          this.graphLines.push(this.createSingleLine(column, this.graphData.colors[name], name));
        }
      }
    }
  }
  createSingleLine(graphY, color, name) {
    const lineG = createGroup({
      where: document.querySelector(`#jonSurface${this.graphId}`),
      className: "jon-line"
    });
    const dotG = createGroup({
      where: lineG,
      className: "jon-line-dots"
    });
    if (document.querySelector(`#jonSurface${this.graphId} .jon-cartesian-axis-ticks-x`)) {
      document.querySelector(`#jonSurface${this.graphId} .jon-cartesian-axis-ticks-x`).remove()
    }
    if (document.querySelector(`#jonSurface${this.graphId} .jon-cartesian-axis-ticks-y`)) {
      document.querySelector(`#jonSurface${this.graphId} .jon-cartesian-axis-ticks-y`).remove()
    }
    const axisTicksX = createGroup({
      "where": document.querySelector(`#jonSurface${this.graphId} .jon-xAxis`),
      "className": "jon-cartesian-axis-ticks-x"
    });
    const axisTicksY = createGroup({
      "where": document.querySelector(`#jonSurface${this.graphId} .jon-yAxis`),
      "className": "jon-cartesian-axis-ticks-y"
    });
    /*
    Parameters for cook line!
    */

    let cx = 80;
    const coefY = (this.svgHeight - 73) / this.maximumY;
    const dotsCoordinatesSVG = [];
    const dotsCoordinatesMini = [];
    const axisSignArr = []
    const dotsCoordinatesXYD = []
    for (let d = this.startPointId; d < this.endPointId; d++) {
      const cy = Math.ceil(Math.abs(coefY * graphY[d] - (this.svgHeight - 73)))
      dotsCoordinatesSVG.push(`${cx}, ${cy}`);
      dotsCoordinatesXYD.push([cx, cy, this.graphX[d], graphY[d]]);
      axisSignArr.push({
        cx,
        cy,
        //transform: this.transform,
        unix_timestamp: this.graphX[d],
        coefScale: this.coefScale
      });
      cx += ((this.svgWidth - 100) / graphY.length) / this.coefScale
    }
    axisSign(axisSignArr, this.maximumY, this.svgWidth, this.svgHeight, axisTicksX, axisTicksY, this.graphId);
    /*
      Unite dots!
    */

    const graphLine = createPath({
      "stroke": color,
      "strokeWidth": 3,
      "fill": "none",
      "dotsInfo": { coordSVG: dotsCoordinatesSVG, elem: dotG},
      "element": lineG,
      //"transform": this.transform
    });

    let cxMini = 80;
    const coefYMini = 40 / this.maximumY;
    for (let i = 1; i < graphY.length - 1; i++) {
      const cyMini = Math.ceil((Math.abs(graphY[i] * coefYMini - (this.svgHeight))))
      dotsCoordinatesMini.push(`${cxMini}, ${cyMini}`);
      cxMini += document.querySelector(`#jonSurface${this.graphId} .jon-cartesian-grid`).getBoundingClientRect().width / graphY.length;
    }

    const miniGraphLine = createPath({
      "stroke": color,
      "strokeWidth": 3,
      "fill": "none",
      "dotsInfo": { coordSVG: dotsCoordinatesMini },
      "inBeforeParent": document.querySelector(`#jonSurface${this.graphId} .jon-control`),
      "inBeforeFirst": document.querySelector(`#jonSurface${this.graphId} .jon-mini-graph`),
      "className": "mini-graph-line"
      //"transform": this.transform
    });
    this.hoverArr.push({ dotsCoordinatesXYD, color, graphY });
    return lineG
  }
  hoverEvents() {
    const hoverDotsLine = (e ) => {
      const posLineX = document.querySelector(`#jonSurface${this.graphId} .jon-line`).getBoundingClientRect().x
      let cursorPosition = Math.abs(posLineX - e.clientX - 80);
      const buildArr = []
      this.hoverArr.map(el => {
        for (let i = 0; i < el.dotsCoordinatesXYD.length; i++) {
          const element = el.dotsCoordinatesXYD[i];
          this.leftPart = (element[0] - (((this.svgWidth - 100) / el.graphY.length) / this.coefScale) / 2)
          this.rightPart = (element[0] + (((this.svgWidth - 100) / el.graphY.length) / this.coefScale) / 2)
          if (cursorPosition > this.leftPart && cursorPosition < this.rightPart) {
            buildArr.push({element, color: el.color})
            break;
          }
        }
      });
      if (document.querySelectorAll(`#jonSurface${this.graphId} .jon-dot-info-g`)) {
        Array.from(document.querySelectorAll(`#jonSurface${this.graphId} .jon-dot-info-g`)).forEach(element => {
          element.remove();
        });
        Array.from(document.querySelectorAll(`#jonSurface${this.graphId} .vertical-grid-line`)).forEach(element => {
          element.remove();
        });
        Array.from(document.querySelectorAll(`#jonSurface${this.graphId} .jon-line-dot`)).forEach(element => {
          element.remove();
        });
      }
      const dotInfoGroup = createGroup({
        where: document.querySelector(`#jonSurface${this.graphId}`),
        className: "jon-dot-info-g"
      });
      let countDx = 0;
      buildArr.forEach(obj => {
        this.verticalGridLine = () => createLine({
          "strokeDasharray": "none",
          "stroke": "#ccc",
          "fill": "none",
          "x": 80,
          "y": 5,
          "width": this.svgWidth - 100,
          "height": this.svgHeight - 78,
          "x1": obj.element[0],
          "y1": 5,
          "x2": obj.element[0],
          "y2": this.svgHeight - 73,
          "className": 'vertical-grid-line',
          "element": dotInfoGroup
        });
        this.infoDot = () => createInfoDot({
          "stroke": obj.color,
          "r": 5,
          "strokeWidth": 3,
          "fill": "#fff",
          "width": this.svgWidth - 100,
          "height": this.svgHeight - 78,
          "className": 'jon-dot jon-line-dot',
          "cx": obj.element[0],
          "cy": obj.element[1],
          "style": 'cursor: pointer; transition: all 0.3s',
          "element": dotInfoGroup
        })
        this.jonDotInfoG = () => {
          let group;
          if(document.querySelector(`#jonSurface${this.graphId} .jon-dot-info`)){
            group = document.querySelector(`#jonSurface${this.graphId} .jon-dot-info`);
          } else {
            group = createGroup({
            "where": dotInfoGroup,
            "className": "jon-dot-info"
            });
            const rectInfo = createRect({
              "stroke": "#666",
              "fill": "#fff",
              "x": obj.element[0] - 30,
              "y": 5,
              "rx": 5,
              "ry": 5,
              "width": 120,
              "height": 60,
              "className": "jon-rect-dot-info",
              "element": group
            })
          }
          const unix_timestamp = obj.element[2];
          const date = new Date(unix_timestamp * 1000);
          let text;
          if (document.querySelector(`#jonSurface${this.graphId} .jon-dot-info-text-month`)) {
            text = document.querySelector(`#jonSurface${this.graphId} .jon-dot-info-text-month`);
          } else {
            text = createText({
              "fill": "#666",
              "x": obj.element[0],
              "y": 25,
              "width": 60,
              "height": this.svgHeight - 78,
              "className": "jon-dot-info-text-month",
              "textAnchor": "start",
              "dy": "0.355em",
              "offSpan": true
            });
          }
          if (!document.querySelector(`#jonSurface${this.graphId} .jon-dot-info-text-month-name`)) {
            const spanMonth = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            spanMonth.innerHTML = `${this.monthNames[date.getMonth()]} ${date.getDate()}`;
            spanMonth.setAttributeNS(null, "class", "jon-dot-info-text-month-name");
            text.appendChild(spanMonth);
          }
          if (!document.querySelector(`#jonSurface${this.graphId} .jon-dot-info-text-data`)) {
            this.textDataContainer = createGroup({
              "where": group,
              "className": "jon-dot-info-text-data"
            });
            this.textDataContainerText = createText({
              fill: "#666",
              x: obj.element[0],
              y: 50,
              width: 60,
              height: this.svgHeight - 78,
              className: "jon-dot-info-text",
              textAnchor: "start",
              dy: "0.355em",
              offSpan: true
            });
            this.textDataContainer.appendChild(this.textDataContainerText)
          }
          const spanData = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          spanData.innerHTML = obj.element[3];
          spanData.setAttributeNS(null, 'fill', obj.color)
          spanData.setAttributeNS(null, "dx", countDx);
          countDx += 10
          this.textDataContainerText.appendChild(spanData);

          group.appendChild(text);

        }
       

        // Vertical grid line
        if (!document.querySelector(`#jonSurface${this.graphId} .vertical-grid-line`)) {
          this.verticalGridLine()
        }
        this.infoDot()
        this.jonDotInfoG();
        
        
      });
    }
    document.querySelector(`#jonSurface${this.graphId} .jon-cartesian-grid-horizontal`).addEventListener("mousemove", hoverDotsLine, true);

  }
  removeGraphs() {
    this.graphLines.forEach(element => {
      element.remove()
    });
  }
};