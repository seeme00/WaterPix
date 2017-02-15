var minBlue;
var maxBlue;


function Cell(x, y, v, wall){
  this.position = createVector(x, y);
  this.content = v;
  this.isWall = wall;
  this.neighboors = undefined;

  maxBlue = color(0, 10, 80);
  minBlue = color(0, 10, 150);

  this.getFlow = function(direction, potential){
    var n = this.neighboors[direction];
    var canGo = n && !n.isWall && n.content < maxLiquid;
    if (direction != "S"){
      canGo = canGo && n.content < this.content;
    }

    if (!canGo){
      return 0;
    }

    return min(potential, maxLiquid - n.content);
  }

  this.update = function(){
    var intents = [];

    var potential = flowSpeed;

    var downPour = this.getFlow("S", potential);
    if (downPour > 0){
      if (this.neighboors["S"]) {intents.push(new Intent(this, this.neighboors["S"], downPour));}
    }else{
      var eastPour = this.getFlow("E", potential);
      var westPour = this.getFlow("W", potential);

      if (eastPour > 0 && westPour > 0){eastPour = ceil(potential / 2.0); westPour = ceil(potential / 2.0);}
      eastPour = max(0, eastPour); westPour = max(0, westPour);
      if (this.neighboors["E"]) {intents.push(new Intent(this, this.neighboors["E"], eastPour));}
      if (this.neighboors["W"]) {intents.push(new Intent(this, this.neighboors["W"], westPour));}
    }

    if (this.content > maxLiquid){
      var upPour = this.getFlow("N", min(flowSpeed, this.content - maxLiquid));
      upPour = max(0, upPour);
      if (this.neighboors["N"] && upPour > epsilon) {intents.push(new Intent(this, this.neighboors["N"], upPour));}
    }

    return intents;
  }

  this.isActive = function(){
    return this.content > 0;
  }

  this.draw = function(){
    var cellColor = color(0, 0, 0);
    if (!this.isWall){
      if (this.content > 0){
        cellColor = lerpColor(minBlue, maxBlue, this.content/100.0);
      }else{
        cellColor = color(255, 255, 255);
      }
    }

    var hei = this.content / maxLiquid;
    var off = 0.0;
    if (this.isWall || (this.neighboors["N"] && !this.neighboors["N"].isWall && this.neighboors["N"].content > 0)){
      hei = 1.0;
      off = 0.0;
    }else{
      off = 1.0 - hei;
    }

    fill(cellColor);
    stroke(255);
    rect(this.position.x * cellSize, this.position.y * cellSize + (cellSize * off), cellSize, cellSize * hei);

    /*fill(0);
    textSize(18);
    text(this.content, 0.3*cellSize+this.position.x * cellSize, 0.6*cellSize+this.position.y * cellSize);*/

  }
}
