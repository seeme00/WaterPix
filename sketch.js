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
        this.addWater(cId);
      }else{
        this.addWall(cId);
      }
    }
  }

}

//mouseX mouseYpressed, released, mouseButton LEFT, RIGHT, CENTER

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


  this.addWater = function(i, content){
    var c = cells[floor(i)];
    c.isWall = false;
    c.content = content || maxLiquid;
    activeCells.push(c);
  }

  this.addWall = function(i){
    var c = cells[i];
    c.isWall = !c.isWall;
    c.content = 0;
  }

//-------------------------------------------------------------
  this.getNeighboors = function(index){
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
  clear();

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
    /*if (cells[i].content > maxLiquid){
      fill(color(255, 0, 0));
      rect(cells[i].position.x * cellSize, cells[i].position.y * cellSize, cellSize, cellSize);
    }*/
  }

  //console.log(totalAmount);
}
