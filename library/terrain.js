var RADIUS_POINT = 2
var WIDTH_LINE = 2
var WIDTH_LINE_SELECTED = 5

var COLOR_SELECTED = "#FFD700"
var COLOR_DRAW = "#696969"

class Point {
  constructor(x, y) {
    this._x = x
    this._y = y
    this._visible = false
    this._selected = false
  }
  
  setVisible(status = false) {
    this._visible = status
  }
  
  isSelected(mx, my) {
    let xp = mx - this._x
    let yp = my - this._y
    this._selected = xp * xp + yp * yp <= RADIUS_POINT
    return this._selected
  }
  
  draw() {
    if(this._visible) {
      ellipseMode(CENTER)
      ellipseMode(RADIUS)
      strokeWeight(WIDTH_LINE)
      if(this._selected) {
        fill(COLOR_SELECTED)
      } else {
        fill(COLOR_DRAW)
      }
      circle(this._x, this._y, RADIUS_POINT * 2)
    }
  }
}

class Path {
  constructor(ox, oy) {
    this._nodes = [new Point(ox, oy)]
    this._show_nodes = true
    this._selected = false
    this._active = false
  }
  
  addNode(mx, my) {
    let npoint = new Point(mx, my)
    npoint._visible = true
    this._nodes.push(npoint)
  }
  
  isSelected(mx, my) {
    let s = false
    for(var ii = 0; ii < this._nodes.length; ii++) {
      s = this._nodes[ii].isSelected(mx, my) | s
    }
    this._selected = s | this._active
    if(this._selected) {
      this._nodes.map((obj) => obj._visible = status)
    }
    return this._selected
  }
  
  setSelected(status = true, active = false) {
    this._selected = status
    this._active = active
    this._nodes.map((obj) => obj._visible = status)
  }
  
  draw() {
    if(this._selected) {
      stroke(COLOR_SELECTED)
      strokeWeight(WIDTH_LINE_SELECTED)
    } else {
      stroke(COLOR_DRAW)
      strokeWeight(WIDTH_LINE)
    }
    noFill()
    if(this._nodes.length > 1) {
      beginShape()
      for(var ii = 0; ii < this._nodes.length; ii++) {
        curveVertex(
          //this._nodes[ii -1]._x, this._nodes[ii - 1]._y, 
          this._nodes[ii]._x,    this._nodes[ii]._y
        )
      }
      endShape()
    }
    this._nodes.forEach((node) => node.draw())
  }
  
  rStyle() { }
}