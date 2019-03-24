//
// Tools (create DOM elements)
//

const setAttribute = (elem, attr, value) => {
  return elem.setAttributeNS(null, attr, value);
}

export const createSVG = function (svgWidth, svgHeight, i) {
  const mainSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  setAttribute(mainSVG, "class", `jon-surface-${i}`);
  setAttribute(mainSVG, "id", `jonSurface${i}`);
  setAttribute(mainSVG, "width", svgWidth);
  setAttribute(mainSVG, "height", svgHeight);
  setAttribute(mainSVG, "viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  setAttribute(mainSVG, "version", '1.1');

  const svgWrap = document.createElement('div')
  svgWrap.setAttribute("class", `jon-surface-wrap${i} jon-surface-wrap`);
  
  document.body.appendChild(svgWrap);
  svgWrap.appendChild(mainSVG);
  return mainSVG;
}
export const createGroup = function(obj){
  const elem = document.createElementNS("http://www.w3.org/2000/svg", "g");
  setAttribute(elem, "class", obj.className);
  if (obj.style) setAttribute(elem, "style", obj.style);
  obj.where.appendChild(elem);
  return elem;
}
export const createLine = function (obj) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  if (obj.strokeDasharray) setAttribute(line, "stroke-dasharray", obj.strokeDasharray);
  setAttribute(line, "stroke", obj.stroke);
  setAttribute(line, "fill", obj.fill);
  setAttribute(line, "x", obj.x);
  setAttribute(line, "y", obj.y);
  setAttribute(line, "width", obj.width);
  setAttribute(line, "height", obj.height);
  setAttribute(line, "x1", obj.x1);
  setAttribute(line, "y1", obj.y1);
  setAttribute(line, "x2", obj.x2);
  setAttribute(line, "y2", obj.y2);
  if (obj.className) setAttribute(line, "class", obj.className);
  if (obj.transform) setAttribute(line, "transform", obj.transform);
  if (obj.element) obj.element.appendChild(line);
  return line
}
export const createText = function (obj) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  setAttribute(text, "stroke", "none");
  setAttribute(text, "fill", obj.fill);
  setAttribute(text, "x", obj.x);
  setAttribute(text, "y", obj.y);
  setAttribute(text, "width", obj.width);
  setAttribute(text, "height", obj.height);
  setAttribute(text, "class", obj.className);
  setAttribute(text, "text-anchor", obj.textAnchor);
  if (obj.transform) setAttribute(text, "transform", obj.transform);

  if(!obj.offSpan) {
    const tSpan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    setAttribute(tSpan, "x", obj.x);
    setAttribute(tSpan, "dy", obj.dy);
    if (obj.tSpanStyle) setAttribute(tSpan, "style", obj.tSpanStyle);
    tSpan.innerHTML += obj.textData;
    text.appendChild(tSpan);
  }

  if (obj.element) obj.element.appendChild(text);
  return text;
}
export const createInfoDot = function (obj) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  setAttribute(circle, "stroke", obj.stroke);
  setAttribute(circle, "r", obj.r);
  setAttribute(circle, "stroke-width", obj.strokeWidth);
  setAttribute(circle, "fill", obj.fill);
  setAttribute(circle, "width", obj.width);
  setAttribute(circle, "height", obj.height);
  setAttribute(circle, "class", obj.className);
  setAttribute(circle, "cx", obj.cx);
  setAttribute(circle, "cy", obj.cy);
  if (obj.style) setAttribute(circle, "style", obj.style);
  if (obj.transform) setAttribute(circle, "transform", obj.transform);
  obj.element.appendChild(circle);
  return circle
}
export const createPath = function (obj) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  if (obj.className) setAttribute(path, "class", obj.className);
  setAttribute(path, "stroke", obj.stroke);
  setAttribute(path, "stroke-width", obj.strokeWidth);
  setAttribute(path, "fill", obj.fill);
  setAttribute(path, "d", `M ${obj.dotsInfo.coordSVG[0]} L ${[...obj.dotsInfo.coordSVG]}`);
  if (obj.transform) setAttribute(path, "transform", obj.transform);
  if (obj.element) obj.element.insertBefore(path, obj.dotsInfo.elem);
  if (obj.inBeforeParent && obj.inBeforeFirst) obj.inBeforeParent.insertBefore(path, obj.inBeforeFirst);
  return path
}
export const createRect = function (obj) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  setAttribute(rect, "stroke", obj.stroke);
  setAttribute(rect, "fill", obj.fill);
  if (obj.fillOpacity) setAttribute(rect, "fill-opacity", obj.fillOpacity);
  setAttribute(rect, "x", obj.x);
  setAttribute(rect, "y", obj.y);
  if (obj.rx) setAttribute(rect, "rx", obj.rx);
  if (obj.ry) setAttribute(rect, "ry", obj.ry);
  setAttribute(rect, "width", obj.width);
  setAttribute(rect, "height", obj.height);
  if (obj.className) setAttribute(rect, "class", obj.className);
  if (obj.style) setAttribute(rect, "style", obj.style);
  if (obj.element) obj.element.appendChild(rect);
  return rect
}


export const createDate = function(timestamp) {
  const unix_timestamp = timestamp;
  return new Date(unix_timestamp * 1000);
};