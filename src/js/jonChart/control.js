import {
  createGroup,
  createRect
} from "./tools"
import ControlEvents from './controlEvents'
import Graph from "./graph";

export const createControl = function (monthNames, svgWidth, svgHeight, graphData, graphId) {
  const controlG = createGroup({
    where: document.querySelector(`#jonSurface${graphId}`),
    className: "jon-control"
  });
  const miniGraph = createRect({
    "stroke": "#baceff",
    "fill": "#0000",
    "x": 80,
    "y": svgHeight - 40,
    "width": svgWidth - 110,
    "height": 40,
    "element": controlG,
    "className": "jon-mini-graph",
  })
  createRect({
    "stroke": "none",
    "fill": "#baceff",
    "fillOpacity": "0.2",
    "x": 80,
    "y": svgHeight - 40,
    "width": svgWidth - 110,
    "height": 40,
    "className": "jon-control-slide",
    "style": 'cursor: move;',
    "element": controlG
  })

  const controlLeftG = createGroup({
    where: controlG,
    className: "jon-brush-traveller",
    style: "cursor: col-resize;"
  });

  createRect({
    "stroke": "none",
    "fill": "#baceff",
    "x": 80,
    "y": svgHeight - 40,
    "width": 5,
    "height": 40,
    "className": "jon-brush-traveller__wrap left",
    "element": controlLeftG
  })

  const controlRightG = createGroup({
    where: controlG,
    className: "jon-brush-traveller",
    style: "cursor: col-resize;"
  });

  createRect({
    "stroke": "none",
    "fill": "#baceff",
    "x": svgWidth - 35,
    "y": svgHeight - 40,
    "width": 5,
    "height": 40,
    "className": "jon-brush-traveller__wrap right",
    "element": controlRightG
  })

  new ControlEvents({
    monthNames,
    draggableElem: controlG,
    svgWidth,
    svgHeight,
    graphData,
    graphId
  });
}
export const createGraphSettings = function (graphNames, graph, graphId, colors) {
  for (const key in graphNames) {
    const graphName = graphNames[key];

    const lineCheckboxWrapOuter = document.createElement("div");
    lineCheckboxWrapOuter.setAttribute("class", "option-outer");

    const lineCheckboxWrap = document.createElement('label')
    lineCheckboxWrap.setAttribute("class", "check option");

    const lineCheckbox = document.createElement('input')
    lineCheckbox.setAttribute("type", "checkbox");
    lineCheckbox.setAttribute("class", "check__input");
    lineCheckbox.setAttribute("checked", "");
    lineCheckboxWrap.appendChild(lineCheckbox);

    const lineCheckboxSpan = document.createElement("span");
    lineCheckboxSpan.setAttribute("class", "check__box");
    lineCheckboxSpan.style.boxShadow = `0 0 0 0.5em ${colors[key]}`;
    if (lineCheckbox.hasAttribute("checked")) {
      lineCheckboxSpan.style.backgroundColor = colors[key];
    }
    lineCheckboxWrap.appendChild(lineCheckboxSpan);
    
    lineCheckboxWrap.innerHTML += graphName;

    let lineCheckboxGroup;

    if (!document.querySelector(`.jon-surface-wrap${graphId} .jon-line-settings-group`)) {
      lineCheckboxGroup = document.createElement("div");
      lineCheckboxGroup.setAttribute("class", `jon-line-settings-group`);
      document.querySelector(`.jon-surface-wrap${graphId}`).appendChild(lineCheckboxGroup);
    } else {
      lineCheckboxGroup = document.querySelector(`.jon-surface-wrap${graphId} .jon-line-settings-group`);
    }

    lineCheckboxWrapOuter.appendChild(lineCheckboxWrap);
    lineCheckboxGroup.appendChild(lineCheckboxWrapOuter);

    localStorage.setItem(`${key}_${graphId}`, "true");

    lineCheckboxWrap.addEventListener("click", e => {
        e.preventDefault()
        console.log(e.target)
        if (e.target.classList.contains('check__box')){
          document.querySelectorAll(`#jonSurface${graphId} .jon-line`).forEach(element => {
            element.remove()
          });
          document.querySelectorAll(`#jonSurface${graphId} .jon-cartesian-axis-tick`).forEach(element => {
            element.remove();
          });
          if (!e.target.parentNode.firstChild.checked) {
            localStorage.setItem(`${key}_${graphId}`, "true");
            e.target.parentNode.firstChild.setAttribute("checked", "true");
            e.target.style.backgroundColor = colors[key];
          } else {
            localStorage.setItem(`${key}_${graphId}`, "false");
            e.target.parentNode.firstChild.removeAttribute("checked");
            e.target.style.backgroundColor = "";
          }
          graph.coefScale = Number(localStorage.getItem("coefScale"))
          graph.startPointId = Number(localStorage.getItem("startPointId"))
          graph.endPointId = Number(localStorage.getItem("endPointId"))
          graph.graphId = graphId;
          new Graph(graph);
        }
      
    });
  }

}
