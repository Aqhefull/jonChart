
import JonChart from './jonChart/common'

document.addEventListener("DOMContentLoaded", () => {
  var request = new Request("./chart_data.json");
  return fetch(request)
    .then(response => response.json())
    .then(data => {
      new JonChart(data);
    })
})