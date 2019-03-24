import { createGroup, createLine, createText, createRect } from "./tools";


export const createAxis = function (svgWidth, svgHeight, i) {
  // Create Axis Vertical

  const jonGridV = createGroup({
    where: document.querySelector(`#jonSurface${i}`),
    className: "jon-cartesian-axis jon-yAxis yAxis"
  });

  createLine({
    "stroke": "#0000",
    "fill": "none",
    "x": 20,
    "y": 5,
    "width": 60,
    "height": svgHeight - 78,
    "x1": 80,
    "y1": 5,
    "x2": 80,
    "y2": svgHeight - 73,
    "element": jonGridV
  })

  // Create Axis Horizontal

  const jonGridH = createGroup({
    where: document.querySelector(`#jonSurface${i}`),
    className: "jon-cartesian-axis jon-xAxis xAxis"
  });

  createLine({
    "stroke": "#0000",
    "fill": "none",
    "x": 80,
    "y": svgHeight - 73,
    "width": svgWidth - 100,
    "height": 30,
    "x1": 80,
    "y1": svgHeight - 73,
    "x2": svgWidth - 30,
    "y2": svgHeight - 73,
    "element": jonGridH
  });

}

export const axisSign = function (axisSignArr, maximumY, svgWidth, svgHeight, parentNodeX, parentNodeY, graphId) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const signXLabels = []
  for (let i = axisSignArr.length - 1; i > 0; i--) {
    const element = axisSignArr[i];
    signXLabels.push(element)
    i = i - Math.ceil(element.coefScale * 8);
  }
  signXLabels.forEach(obj => {
    const date = new Date(obj.unix_timestamp * 1000);
    const text = createText({
      "fill": "#666",
      "x": obj.cx,
      "y": svgHeight - 65,
      "width": svgWidth - 100,
      "height": 30,
      "className": "jon-text",
      "textAnchor": "middle",
      "dy": "1em",
      "textData": `${monthNames[date.getMonth()]} ${date.getDate()}`,
      "transform": obj.transform
    });
    const axisTick = createGroup({
      "where": parentNodeX,
      "className": "jon-cartesian-axis-tick"
    });

    if (text) {
      axisTick.appendChild(text);
    }
  });
  let count = 5;
  const y = ((svgHeight - 78) / 4);
  let yName = 0;
  if (document.querySelector(`#jonSurface${graphId} .jon-cartesian-grid-horizontal`)) {
    document.querySelector(`#jonSurface${graphId} .jon-cartesian-grid-horizontal`).remove();
  }
  const gridHor = createGroup({
    where: document.querySelector(`#jonSurface${graphId} .jon-cartesian-grid`),
    className: "jon-cartesian-grid-horizontal"
  });
  
  for (let j = 0; j < 5; j++) {

    // Create horizontal X line (grid)

    createLine({
      "strokeDasharray": "none",
      "stroke": "#e4e4e4",
      "fill": "none",
      "x": 80,
      "y": 5,
      "width": svgWidth - 100,
      "height": svgHeight - 78,
      "x1": 80,
      "y1": count,
      "x2": svgWidth - 30,
      "y2": count,
      "element": gridHor
    });

    // Create Y labels

    const text = createText({
      "fill": "#666",
      "x": 80,
      "y": count,
      "width": 60,
      "height": svgHeight - 78,
      "className": "jon-text",
      "textAnchor": "start",
      "dy": "0.355em",
      "textData": (maximumY - yName)
    });
    yName += (maximumY / 4)
    count += y;
    const axisTick = createGroup({
      "where": parentNodeY,
      "className": "jon-cartesian-axis-tick"
    });

    if (text) {
      axisTick.appendChild(text);
    }
  }
  const gridBG = createRect({
    stroke: "none",
    fill: "#fff",
    x: 80,
    y: 5,
    width: gridHor.getBBox().width,
    height: gridHor.getBBox().height,
    className: "jon-cartesian-grid-bg"
  });
  gridHor.insertBefore(gridBG, gridHor.childNodes[0]);
};