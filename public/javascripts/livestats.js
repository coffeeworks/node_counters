var socket = io.connect('/');
socket.on('update', function (data) {
  updateStats(data);
});


/* ---------- Treemap ---------- */

var tm;

function init(){
  //init data
  var json = {
    "id": "root",
    "name": "Live Stats",
    "data": {},
    "children": [ {
      "id": "Blank",
      "name": "Blank",
      "data": {
        "$area": 100.00,
        "$color": "#000000"
      }
    }]
  };

  //end
  //init TreeMap
  tm = new $jit.TM.Squarified({
    //where to inject the visualization
    injectInto: 'infovis',
    //parent box title heights
    titleHeight: 0,
    //enable animations
    animate: true,
    //box offsets
    offset: 1,

    onCreateLabel: function(domElement, node){
        domElement.innerHTML = node.name;
    }
  });
  tm.loadJSON(json);
  tm.refresh();
  tm.reposition = function() { tm.compute('end'); };
}

function dataToTree(data){
  //data = {'red': '32.01'};
  var children = [];
  for(var id in data) {
    if(data.hasOwnProperty(id)){
      children.push({
        "id": id,
        "name": id,
        "data": {
          "$area": data[id].count,
          "$color": data[id].color
        }
      });
    }
  }

  var tree = {
    "id": "root",
    "name": "Stats",
    "data": {},
    "children": children
  };
  return tree;
}

function updateStats(data){
  tm.op.morph(dataToTree(data), {
    type: 'fade'
  }, {
    //animate color, with and height node properties
    //http://thejit.org/static/v20/Docs/files/Graph/Graph-Op-js.html#Graph.Op.morph
    'node-property': ['color', 'width', 'height']
  });
}

