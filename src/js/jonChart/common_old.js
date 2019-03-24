import { createSVG, createGroup, createLine, createText, createInfoDot, createPath, createRect} from "./tools"

export default class JonChart {
  constructor(data){
    this.data = data
    this.svgWidth = 800
    this.svgHeight = 400
    this.selectedElement = false
    this.yMax = 0
    this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    this.coefScale = 1
    this.createSVG = createSVG(this.svgWidth, this.svgHeight);
    this.createGroup = createGroup
    this.createLine = createLine
    this.createText = createText
    this.createInfoDot = createInfoDot
    this.createPath = createPath
    this.createRect = createRect
    this.createGrid()
    this.createGraphLine()
  }


  
  //
  // Create Axis
  //

  createAxisTicks(element, type, cx, date, transform) {
    const axisTicks = this.createGroup({
      "where": element, 
      "className": "jon-cartesian-axis-ticks"
    });
    if (type === 'hor') {
      const line = this.createLine({
        "stroke": "none", 
        "fill": "none", 
        "x": 80, 
        "y": this.svgHeight - 73, 
        "width": this.svgWidth - 100, 
        "height": 30, 
        "x1": cx, 
        "y1": this.svgHeight - 67, 
        "x2": cx, 
        "y2": this.svgHeight - 73,
        "transform": transform
      });
      const text = this.createText({
        "fill": "#666",
        "x": cx,
        "y": this.svgHeight - 65,
        "width": this.svgWidth - 100,
        "height": 30,
        "className": "jon-text",
        "textAnchor": "middle",
        "dy": "1em",
        "textData": `${this.monthNames[date.getMonth()]} ${date.getDate()}`,
        "transform": transform
      });
      this.createAxisTick(axisTicks, type, line, text);

    } else if (type === 'ver') {
      let count = 5;
      const y = ((this.svgHeight - 78) / 4);
      let yName = 0;
      for (let j = 0; j < 5; j++) {
        const line = this.createLine({
          "stroke": "#666",
          "fill": "none",
          "x": 20,
          "y": 5,
          "width": 60,
          "height": this.svgHeight - 78,
          "x1": 74,
          "y1": count,
          "x2": 80,
          "y2": count
        });
        const text = this.createText({
          "fill": "#666",
          "x": 72,
          "y": count,
          "width": 60,
          "height": this.svgHeight - 78,
          "className": "jon-text",
          "textAnchor": "end",
          "dy": "0.355em",
          "textData": (this.yMax - yName)
        });
        yName += (this.yMax / 4)
        count += y;
        this.createAxisTick(axisTicks, type, line, text);
      }
    }
  }
  createAxisTick(element, type, line, text) {
    const axisTick = this.createGroup({
      "where": element,
      "className": "jon-cartesian-axis-tick"
    });
    if (line) axisTick.appendChild(line);
    if (text) {
      axisTick.appendChild(text);
    }
  }

  //
  // Create Grid 
  //

  createGrid(){
    this.createGroup({
      where: document.querySelector("#jonSurface"),
      className: "jon-cartesian-grid"
    });
    this.createGridHorizontal()
    //this.createGridVertical()
  }
  createGridHorizontal(){
    const gridHor = this.createGroup({
      where: document.querySelector(".jon-cartesian-grid"),
      className: "jon-cartesian-grid-horizontal"
    });
    let count = 5;
    const y = ((this.svgHeight - 78) / 4);
    for (let index = 0; index < 5; index++) {
      this.createLine({
        "strokeDasharray": "none",
        "stroke": "#e4e4e4",
        "fill": "none",
        "x": 80,
        "y": 5,
        "width": this.svgWidth - 100,
        "height": this.svgHeight - 78,
        "x1": 80,
        "y1": count,
        "x2": this.svgWidth - 30,
        "y2": count,
        "element": gridHor
      });
      count += y;
    }
  }


  //
  // Create Graphs
  //

  createGraphLine() {
    const lineG = this.createGroup({
      where: document.querySelector("#jonSurface"),
      className: "jon-line"
    });
    this.createControl(lineG)
  }
  createGraph(elem, transform, coefScale){
    for (let i = 0; i < this.data[0].columns[1].length; i++) {
      const element = this.data[0].columns[1][i];
      if (element > this.yMax) this.yMax = element;
    }
    // for maximum, it is completely divisible by 25
    if (this.yMax % 25 != 0) this.yMax = this.yMax + (25 - this.yMax % 25)

    const dotG = this.createGroup({
      where: elem,
      className: "jon-line-dots"
    });

    const coefY = (this.svgHeight - 73) / this.yMax;
    let cx = 80;
    const dotsCoordinates = []

    // Create Axis Horizontal

    const jonGridH = this.createGroup({
      where: document.querySelector("#jonSurface"),
      className: "jon-cartesian-axis jon-xAxis xAxis"
    });

    this.createLine({
      "stroke": "#666",
      "fill": "none",
      "x": 80,
      "y": this.svgHeight - 73,
      "width": this.svgWidth - 100,
      "height": 30,
      "x1": 80,
      "y1": this.svgHeight - 73,
      "x2": this.svgWidth - 30,
      "y2": this.svgHeight - 73,
      "element": jonGridH
    });

    // Create Axis Vertical

    const jonGridV = this.createGroup({
      where: document.querySelector("#jonSurface"),
      className: "jon-cartesian-axis jon-yAxis yAxis"
    });
    this.createLine({
      "stroke": "#666",
      "fill": "none",
      "x": 20,
      "y": 5,
      "width": 60,
      "height": this.svgHeight - 78,
      "x1": 80,
      "y1": 5,
      "x2": 80,
      "y2": this.svgHeight - 73,
      "element": jonGridV
    })

    this.createAxisTicks(jonGridV, "ver");

    // Create verical Grid
    const gridVer = this.createGroup({
      where: document.querySelector(".jon-cartesian-grid"),
      className: "jon-cartesian-grid-vertical"
    });


    const tickPushArray = []
    let tick = 0;
    for (let t = 0; t < 6; t++) {
      tickPushArray.push(Math.ceil(tick === 0 ? 1 : tick));
      tick = (tick + (this.data[0].columns[1].length - 1) / (coefScale * 5));
    }
    for (let i = 1; i < this.data[0].columns[1].length; i++) {
      const cy = Math.ceil(Math.abs(coefY * this.data[0].columns[1][i] - (this.svgHeight - 73)))

      // Create Dot

      dotsCoordinates.push(`${cx}, ${cy}`)
      const infoDot = this.createInfoDot({
        "stroke": '#8884d8',
        "r": 4,
        "strokeWidth": 1,
        "fill": "#fff",
        "width": this.svgWidth - 100,
        "height": this.svgHeight - 78,
        "className": 'jon-dot jon-line-dot',
        "cx": cx,
        "cy": cy, 
        "transform": transform,
        "style": 'cursor: pointer; transition: all 0.3s',
        "element": dotG
      })

      // Vertical grid line

      const verticalGridLine = this.createLine({
        "strokeDasharray": "none",
        "stroke": "#e4e4e4",
        "fill": "none",
        "x": 80,
        "y": 5,
        "width": this.svgWidth - 100,
        "height": this.svgHeight - 78,
        "x1": cx,
        "y1": 5,
        "x2": cx,
        "y2": this.svgHeight - 73,
        "transform": transform,
        "element": gridVer
      });

      // Hover dot


      infoDot.addEventListener("mouseover", () => {
        infoDot.setAttributeNS(null, "r", 5);
        verticalGridLine.setAttributeNS(null, "stroke", "#ccc");
      });
      infoDot.addEventListener("mouseleave", () => {
        infoDot.setAttributeNS(null, "r", 4);
        verticalGridLine.setAttributeNS(null, "stroke", "#e4e4e4");
      });

      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      const unix_timestamp = this.data[0].columns[0][i]
      const date = new Date(unix_timestamp * 1000);
      title.innerHTML = `${this.monthNames[date.getMonth()]} ${date.getDate()}, users: ${this.data[0].columns[1][i]}`
      infoDot.appendChild(title)
      //this.createInfoDot('#b80000', 3, 2, '#fff', this.svgWidth - 100, 242, 'jon-dot jon-line-dot', count, countYTwo, )

      // Create month text and ticks
      if (tickPushArray.includes(i)) this.createAxisTicks(jonGridH, "hor", cx, date, transform * coefScale);



      cx = (cx + ((this.svgWidth - 100) / this.data[0].columns[1].length) * this.coefScale)

    }
    return [dotsCoordinates, dotG];
  }

  //
  //Create control
  //

  createControl(lineG) {
    const controlG = this.createGroup({
      where: document.querySelector("#jonSurface"),
      className: "jon-control"
    });
    this.createRect({
      "stroke": "#666",
      "fill": "#fff",
      "x": 80,
      "y": this.svgHeight - 40,
      "width": this.svgWidth - 110,
      "height": 40,
      "element": controlG
    })
    this.createRect({
      "stroke": "none",
      "fill": "#666",
      "fillOpacity": "0.2",
      "x": 80,
      "y": this.svgHeight - 40,
      "width": this.svgWidth - 110,
      "height": 40,
      "className": "jon-control-slide",
      "style": 'cursor: move;',
      "element": controlG
    })
    const controlLeftG = this.createGroup({
      where: controlG,
      className: "jon-brush-traveller",
      style: "cursor: col-resize;"
    });
    this.createRect({
      "stroke": "none",
      "fill": "#666",
      "x": 80,
      "y": this.svgHeight - 40,
      "width": 5,
      "height": 40,
      "className": "jon-brush-traveller__wrap left",
      "element": controlLeftG
    })

    const controlRightG = this.createGroup({
      where: controlG,
      className: "jon-brush-traveller",
      style: "cursor: col-resize;"
    });
    this.createRect({
      "stroke": "none",
      "fill": "#666",
      "x": this.svgWidth - 35,
      "y": this.svgHeight - 40,
      "width": 5,
      "height": 40,
      "className": "jon-brush-traveller__wrap right",
      "element": controlRightG
    })
    const self = this;
    const crlLeftDom = document.querySelector('.jon-brush-traveller__wrap.left')
    const crlRightDom = document.querySelector('.jon-brush-traveller__wrap.right')
    function makeDraggable(controlElem) {
      let offset;
      controlElem.addEventListener('mousedown', startDrag);
      controlElem.addEventListener('mousemove', drag);
      controlElem.addEventListener('mouseup', endDrag);
      controlElem.addEventListener('mouseleave', endDrag);
      controlElem.addEventListener('touchstart', startDrag);
      controlElem.addEventListener('touchmove', drag);
      controlElem.addEventListener('touchend', endDrag);
      controlElem.addEventListener('touchleave', endDrag);
      controlElem.addEventListener('touchcancel', endDrag);
      function getMousePosition(evt) {
        var CTM = controlElem.getScreenCTM();
        return {
          x: (evt.clientX - CTM.e) / CTM.a
        };
      }
      function startDrag(evt) {
        if (evt.target.classList.contains('jon-brush-traveller__wrap')) {
          this.selectedElement = evt.target;
          offset = getMousePosition(evt);
          offset.x -= parseInt(this.selectedElement.getAttributeNS(null, "x"));
        }
        if (evt.target.classList.contains('jon-control-slide')) {
          this.selectedElement = evt.target;
          offset = getMousePosition(evt);
          offset.x -= parseInt(this.selectedElement.getAttributeNS(null, "x"));
        }
      }
      function drag(evt) {
        if (this.selectedElement) {
          evt.preventDefault();
          let coord = getMousePosition(evt);
          if (this.selectedElement.classList.contains('jon-brush-traveller__wrap') && coord.x >= 80 && coord.x <= self.svgWidth - 35) {
            this.selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
            let controlSlideWidth = crlRightDom.getAttributeNS(null, "x") - crlLeftDom.getAttributeNS(null, "x") + 5;
            if (crlLeftDom.getAttributeNS(null, "x") < 85) {
              crlLeftDom.setAttributeNS(null, "x", 80)
            }
            if (crlRightDom.getAttributeNS(null, "x") > self.svgWidth - 40) {
              crlRightDom.setAttributeNS(null, "x", self.svgWidth - 35)
            }
            if (controlSlideWidth > self.svgWidth - 110) {
              controlSlideWidth = self.svgWidth - 110
            }
            document.querySelector('.jon-control-slide').setAttributeNS(null, "width", controlSlideWidth);
            document.querySelector('.jon-control-slide').setAttributeNS(null, "x", crlLeftDom.getAttributeNS(null, "x"))
          } if (this.selectedElement.classList.contains('jon-control-slide')) {
            evt.preventDefault();
            let coord = getMousePosition(evt);
            if (this.selectedElement.getAttributeNS(null, "x") >= 80 && parseInt(this.selectedElement.getAttributeNS(null, "x")) + parseInt(this.selectedElement.getAttributeNS(null, "width")) <= self.svgWidth - 30) {
              this.selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
              if (this.selectedElement.getAttributeNS(null, "x") < 85) {
                this.selectedElement.setAttributeNS(null, "x", 80)
              }
              if (parseInt(this.selectedElement.getAttributeNS(null, "x")) + parseInt(this.selectedElement.getAttributeNS(null, "width")) > self.svgWidth - 40) {
                this.selectedElement.setAttributeNS(null, "x", (self.svgWidth - 30) - this.selectedElement.getAttributeNS(null, "width"))
              }
              crlLeftDom.setAttributeNS(null, "x", this.selectedElement.getAttributeNS(null, "x"))
              crlRightDom.setAttributeNS(null, "x", parseInt(this.selectedElement.getAttributeNS(null, "x")) + parseInt(this.selectedElement.getAttributeNS(null, "width")) - 5)
            }

          }
        }
        lineG.innerHTML = ''
        Array.from(document.querySelectorAll(".jon-cartesian-axis")).forEach(element => {
          element.remove();
        });
        Array.from(document.querySelectorAll(".jon-cartesian-grid-vertical")).forEach(element => {
          element.remove();
        });
        self.coefScale = (self.svgWidth - 110) / document.querySelector('.jon-control-slide').getAttributeNS(null, "width")
        const graphLineDots = self.createGraph(lineG, `translate(-${(parseInt(document.querySelector('.jon-control-slide').getAttributeNS(null, "x")) - 80) * self.coefScale})`, self.coefScale)
        self.createPath({
          "stroke": "#00b300",
          "strokeWidth": 3,
          "fill": "none",
          "dotsCoordinates": graphLineDots,
          "transform": `translate(-${(parseInt(document.querySelector('.jon-control-slide').getAttributeNS(null, "x")) - 80) * self.coefScale})`,
          "element": lineG
        });
      }
      function endDrag(evt) {
        this.selectedElement = null;
      }
    }
    const graphLineDots = this.createGraph(lineG, "", self.coefScale);
    this.createPath({
      "stroke": "#00b300",
      "strokeWidth": 3,
      "fill": "none",
      "dotsCoordinates": graphLineDots,
      "element": lineG
    });
    makeDraggable(controlG)
  }



}




