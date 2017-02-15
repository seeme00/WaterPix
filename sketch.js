var cells = [];
var cellSize = 25;
var nbCells = 0;
var activeCells = [];
var flowSpeed = 30;
var maxLiquid = 100;
var epsilon = 0.0001;
var totalAmount = 0;
var currentCursorCellId;


function mouseDragged(){
  mouseEvent();
}

function mousePressed(){
  mouseEvent();
}

function mouseEvent(){
  var x = floor(nbCells * (mouseX / width));
  var y = floor(nbCells * (mouseY / height));
  var cId = x + y * nbCells;

  if (cId != currentCursorCellId){
    currentCursorCellId = cId;
    if (mouseButton == LEFT){
      if(keyCode == CONTROL){
        addWater(cId);
      }else{
        addWall(cId);
      }
    }
  }

}

function setup() {
  createCanvas(500, 500);
  nbCells = floor(width / cellSize); // assume a square

  for(var i = 0; i < nbCells; i++){
    for(var j = 0; j < nbCells; j++){
        cells.push(new Cell(j, i, 0, false));
    }
  }

  //Set neighboors
  for(var i = 0; i < cells.length; i++){
      cells[i].neighboors = getNeighboors(i);
  }
}


  addWater = function(i, content){
    var c = cells[floor(i)];
    c.isWall = false;
    c.content = content || maxLiquid;
    activeCells.push(c);
  }

  addWall = function(i){
    var c = cells[i];
    c.isWall = !c.isWall;
    c.content = 0;
  }

//-------------------------------------------------------------
  getNeighboors = function(index){
    var top = index < nbCells;
    var bottom = index >= cells.length - nbCells;
    var left = index % nbCells  == 0;
    var right = (index + 1) % nbCells == 0;

    var indexes = new Array();

    if (!top && !left)    {indexes["NW"] = cells[index - nbCells - 1];}
    if (!top)             {indexes["N"]  = cells[index - nbCells];}
    if (!top && !right)   {indexes["NE"] = cells[index - nbCells + 1];}
    if (!left)            {indexes["W"]  = cells[index - 1];}
    if (!right)           {indexes["E"]  = cells[index + 1];}
    if (!bottom && !left) {indexes["SW"] = cells[index + nbCells - 1];}
    if (!bottom)          {indexes["S"]  = cells[index + nbCells];}
    if (!bottom && !right){indexes["SE"] = cells[index + nbCells + 1];}

    return indexes;
  }

function draw() {
  //clear();
  background(220);

  var intents = [];
  for(var i = 0; i < activeCells.length; i++){
    intents = intents.concat(activeCells[i].update());
  }

  var nact = [];
  for (var i = 0; i < intents.length; i++){
    var cint = intents[i];
    var am = min(cint.source.content, cint.amount);
    cint.source.content -= am;
    cint.destination.content += am;
    if (cint.source.isActive()){ nact.push(cint.source);}
    if (cint.destination.isActive()){ nact.push(cint.destination);}
  }
  nact = nact.filter(function(item, i, ar){return ar.indexOf(item) === i;});
  activeCells = nact;

  totalAmount = 0;
  for(var i = 0; i < cells.length; i++){
    totalAmount += cells[i].content;
    cells[i].draw();
  }
}
