function Player() {
  this.host = this.ready = false;
  this.currentX = this.currentY = 0;
  this.time = this.stepX = this.stepY = this.goalX = this.goalY = 0;
}

Player.prototype.setHost = function() {this.host = !this.host;};

Player.prototype.setReady = function() {this.ready = !this.ready;};

Player.prototype.setNewTime = function(newTime) {this.time += newTime;};

Player.prototype.setPos = function(newValue) {
  this.currentX = newValue.left;
  this.currentY = newValue.top;
};

Player.prototype.setStep = function(sx, sy)
{
  this.stepX = sx;
  this.stepY = sy;
};

Player.prototype.setGoal = function(sx, sy)
{
  this.goalX = sx;
  this.goalY = sy;
};

Player.prototype.getCurPos = function(){ return { left: this.currentX, top: this.currentY};};

Player.prototype.applyStep = function () {
  let x = Math.abs(this.goalX-this.currentX); // +/-4
  let y = Math.abs(this.goalY-this.currentY); // 4
  //console.log(x, y, this.stepX, this.stepY);
  if(x < Math.abs(this.stepX) && y < Math.abs(this.stepY)){
    this.stepX = this.stepY = 0;
    this.currentX = this.goalX;
    this.currentY = this.goalY;
    return;
  }
  this.currentX += this.stepX;
  this.currentY += this.stepY;
};

Player.prototype.move = function(goalPos) {
  let currentPos = this.getCurPos();
  let cX = parseInt(currentPos.left),
      cY = parseInt(currentPos.top),
      gX = goalPos.left,
      gY = goalPos.top;
  this.setGoal(gX, gY);
  let range = Math.sqrt((gX-cX)**2+(gY-cY)**2);
  range = range / 4; //делим на скорость
  let stepX = (gX-cX)/range;
  let stepY = (gY-cY)/range;
  this.setStep(stepX, stepY);
};

module.exports = Player;
