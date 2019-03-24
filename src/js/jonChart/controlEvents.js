import Graph from "./graph";

export default class ControlEvents {
  constructor(obj) {
    this.graphId = obj.graphId
    this.monthNames = obj.monthNames;
    this.draggableElem = obj.draggableElem
    this.svgWidth = obj.svgWidth;
    this.svgHeight = obj.svgHeight;
    this.graphData = obj.graphData;
    this.crlLeftDom = document.querySelector(`#jonSurface${this.graphId} .jon-brush-traveller__wrap.left`)
    this.crlRightDom = document.querySelector(`#jonSurface${this.graphId} .jon-brush-traveller__wrap.right`)
    this.selectedElement = null
    this.offset = null
    this.makeDraggable()
  }
  getMousePosition(evt) {
    var CTM = this.draggableElem.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a
    };
  }
  makeDraggable() {
    this.draggableElem.addEventListener('mousedown', this.startDrag.bind(this));
    this.draggableElem.addEventListener('mouseup', this.endDrag.bind(this));
    this.draggableElem.addEventListener('mousemove', this.drag.bind(this));
    this.draggableElem.addEventListener('mouseleave', this.endDrag.bind(this));
    this.draggableElem.addEventListener('touchstart', this.startDrag.bind(this));
    this.draggableElem.addEventListener('touchmove', this.drag.bind(this));
    this.draggableElem.addEventListener('touchend', this.endDrag.bind(this));
    this.draggableElem.addEventListener('touchleave', this.endDrag.bind(this));
    this.draggableElem.addEventListener('touchcancel', this.endDrag.bind(this));
  }
  startDrag(evt) {
    this.dragAction = true
    if (evt.target.classList.contains('jon-brush-traveller__wrap')) {
      this.selectedElement = evt.target;
      this.offset = this.getMousePosition(evt);
      this.offset.x -= parseInt(this.selectedElement.getAttributeNS(null, "x"));
    }
    if (evt.target.classList.contains('jon-control-slide')) {
      this.selectedElement = evt.target;
      this.offset = this.getMousePosition(evt);
      this.offset.x -= parseInt(this.selectedElement.getAttributeNS(null, "x"));
    }
  }
  drag(evt) {
    if (this.dragAction ) {
      if (this.selectedElement) {
        evt.preventDefault();
        let coord = this.getMousePosition(evt);
        if (this.selectedElement.classList.contains('jon-brush-traveller__wrap') && coord.x >= 80 && coord.x <= this.svgWidth - 35) {
          this.selectedElement.setAttributeNS(null, "x", coord.x - this.offset.x);
          let controlSlideWidth = this.crlRightDom.getAttributeNS(null, "x") - this.crlLeftDom.getAttributeNS(null, "x") + 5;
          if (this.crlLeftDom.getAttributeNS(null, "x") < 85) {
            this.crlLeftDom.setAttributeNS(null, "x", 80)
          }
          if (this.crlRightDom.getAttributeNS(null, "x") > this.svgWidth - 40) {
            this.crlRightDom.setAttributeNS(null, "x", this.svgWidth - 35)
          }
          if (controlSlideWidth > this.svgWidth - 110) {
            controlSlideWidth = this.svgWidth - 110
          }
          document.querySelector(`#jonSurface${this.graphId} .jon-control-slide`).setAttributeNS(null, "width", controlSlideWidth);
          document.querySelector(`#jonSurface${this.graphId} .jon-control-slide`).setAttributeNS(null, "x", this.crlLeftDom.getAttributeNS(null, "x"))
        } if (this.selectedElement.classList.contains('jon-control-slide')) {
          evt.preventDefault();
          let coord = this.getMousePosition(evt);
          if (this.selectedElement.getAttributeNS(null, "x") >= 80 && parseInt(this.selectedElement.getAttributeNS(null, "x")) + parseInt(this.selectedElement.getAttributeNS(null, "width")) <= this.svgWidth - 30) {
            this.selectedElement.setAttributeNS(null, "x", coord.x - this.offset.x);
            if (this.selectedElement.getAttributeNS(null, "x") < 85) {
              this.selectedElement.setAttributeNS(null, "x", 80)
            }
            if (parseInt(this.selectedElement.getAttributeNS(null, "x")) + parseInt(this.selectedElement.getAttributeNS(null, "width")) > this.svgWidth - 40) {
              this.selectedElement.setAttributeNS(null, "x", (this.svgWidth - 30) - this.selectedElement.getAttributeNS(null, "width"))
            }
            this.crlLeftDom.setAttributeNS(null, "x", this.selectedElement.getAttributeNS(null, "x"))
            this.crlRightDom.setAttributeNS(null, "x", parseInt(this.selectedElement.getAttributeNS(null, "x")) + parseInt(this.selectedElement.getAttributeNS(null, "width")) - 5)
          }

        }
      };
      document.querySelectorAll(`#jonSurface${this.graphId} .jon-line`).forEach(element => {
        element.remove()
      });
      document.querySelectorAll(`#jonSurface${this.graphId} .jon-cartesian-axis-tick`).forEach(element => {
        element.remove();
      });
      const coefScale = (document.querySelector(`#jonSurface${this.graphId} .jon-control-slide`).getAttributeNS(null, "width") / (this.svgWidth - 110))
      this.crlLeftDom.dataset.id = Math.round((((parseInt(this.crlLeftDom.getAttributeNS(null, "x")) - 80) / (765 - 80)) * (this.graphData.columns[0].length - 1)) + 1)
      this.crlRightDom.dataset.id = Math.round((((parseInt(this.crlRightDom.getAttributeNS(null, "x")) - 80) / (765 - 80)) * (this.graphData.columns[0].length - 1)) + 1);
      localStorage.setItem("coefScale", coefScale);
      localStorage.setItem("startPointId", Math.abs(this.crlLeftDom.dataset.id));
      localStorage.setItem("endPointId", Math.abs(this.crlRightDom.dataset.id));
      return new Graph({
        monthNames: this.monthNames,
        svgWidth: this.svgWidth,
        svgHeight: this.svgHeight,
        graphData: this.graphData,
        coefScale: coefScale,
        startPointId: Math.abs(this.crlLeftDom.dataset.id),
        endPointId: Math.abs(this.crlRightDom.dataset.id),
        graphId: this.graphId
      });
    }


  }
  endDrag(evt) {
    this.dragAction = false
    this.selectedElement = null;
  }
}
