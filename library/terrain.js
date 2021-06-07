var RADIUS_POINT = 2
var WIDTH_LINE = 2
var WIDTH_LINE_SELECTED = 5

var COLOR_SELECTED = "#FFD700"
var COLOR_DRAW = "#696969"

class Point {
  constructor(x, y) {
    this._x = x
    this._y = y
    this._r = RADIUS_POINT
    this._visible = false
    this._selected = false
  }
  
  set_visible(status = false) {
    this._visible = status
  }
  
  is_selected(mx, my) {
    let xp = mx - this._x
    let yp = my - this._y
    this._selected = xp * xp + yp * yp <= this._r
    return this._selected
  }
  
  draw(show_nodes) {
    if(this._visible || show_nodes) {
      rectMode(CENTER)
      ellipseMode(CENTER)
      ellipseMode(RADIUS)

      if (this._selected) {
        stroke(this._style.color_select)
        strokeWeight(this._style.line_width_selected)
      } else {
        stroke(this._style.color_line)
        strokeWeight(this._style.line_width)
      }
      fill(this._style.color_fill)

      circle(this._x, this._y, RADIUS_POINT * 2)
    }
  }

  set_style(style) {
    console.log("node set_style")
    this._style = {
      color_background: style.color_background,
      color_fill: style.color_fill,
      color_line: style.color_line,
      color_select: style.color_select,
      point_radius: style.point_radius,
      line_width: style.line_width,
      line_width_selected: style.line_width_selected
    }
  }
}

class CurvePath {
  constructor(ox, oy, style) {
    this._nodes = []
    this._show_nodes = true
    this._selected = false
    this._active = false
    this._lyt = 0
    this.set_style(style)
    this.add_node(ox, oy)
  }

  set_style(style) {
    console.log("path set_style")
    this._style = {
      color_background: style.color_background,
      color_fill: style.color_fill,
      color_line: style.color_line,
      color_select: style.color_select,
      point_radius: style.point_radius,
      line_width: style.line_width,
      line_width_selected: style.line_width_selected
    }
  }
  
  add_node(mx, my) {
    let npoint = new Point(mx, my)
    npoint._visible = true
    npoint.set_style(this._style)
    this._nodes.push(npoint)
  }
  
  is_selected(mx, my) {
    let s = false
    for(var ii = 0; ii < this._nodes.length; ii++) {
      s = this._nodes[ii].is_selected(mx, my) | s
    }
    this._selected = s | this._active
    if(this._selected) {
      this._nodes.map((obj) => obj._visible = status)
    }
    return this._selected
  }
  
  set_selected(status = true, active = false) {
    this._selected = status
    this._active = active
    this._nodes.map((obj) => obj._visible = status)
  }
  
  draw() {
    if (this._selected) {
      stroke(this._style.color_select)
      strokeWeight(this._style.line_width_selected)
    } else {
      stroke(this._style.color_line)
      strokeWeight(this._style.line_width)
    }
    noFill()
    if(this._nodes.length > 1) {
      beginShape()
      for(var ii = 0; ii < this._nodes.length; ii++) {
        if(this._lyt == 0 || this._lyt == 2) {
          curveVertex(
            //this._nodes[ii -1]._x, this._nodes[ii - 1]._y, 
            this._nodes[ii]._x,    this._nodes[ii]._y
          )
        } else {
          vertex(
            //this._nodes[ii -1]._x, this._nodes[ii - 1]._y, 
            this._nodes[ii]._x,    this._nodes[ii]._y
          )
        }
      }
      endShape()
    }
    this._nodes.forEach((node) => node.draw(this._lyt == 2 || this._lyt == 3))
  }
  
  rotate_style() {
    this._lyt = (this._lyt + 1) % 4
   }

  drag(mx, my) { }
}