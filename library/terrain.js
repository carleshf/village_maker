var RADIUS_POINT = 2
var WIDTH_LINE = 2
var WIDTH_LINE_SELECTED = 5

var COLOR_SELECTED = "#FFD700"
var COLOR_DRAW = "#696969"


function _set_style(style) {
  switch(style) {
    case 0:
      drawingContext.setLineDash([1])
      break
    case 1:
      drawingContext.setLineDash([2, 5])
      break
    case 2:
      drawingContext.setLineDash([10, 10])
      break
    case 3:
      drawingContext.setLineDash([10, 15, 2])
      break
    case 4:
      drawingContext.setLineDash([10, 5, 1])
      break
    case 5:
      drawingContext.setLineDash([15, 2, 10])
      break
  }
}


class Point {
  constructor(x, y, type = 'courve') {
    this._x = x
    this._y = y
    this._r = RADIUS_POINT
    this._visible = false
    this._selected = false
    this._type = type
  }
  
  set_visible(status = false) {
    this._visible = status
  }
  
  is_selected(mx, my) {
    let xp = mx - this._x
    let yp = my - this._y
    this._selected = xp * xp + yp * yp <= this._r + WIDTH_LINE_SELECTED
    return this._selected
  }
  
  draw(show_nodes) {
    if(this._visible) {
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

      if(this._type == 'courve') {
        circle(this._x, this._y, RADIUS_POINT * 2)
      } else {
        rect(this._x, this._y, RADIUS_POINT * 4, RADIUS_POINT * 4)
      }
    }
  }

  set_style(style) {
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

  drag(mx, my) { 
    if(this._selected) {
      this._x = mx
      this._y = my
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
    if(this._nodes.length > 1) {
      this._nodes[this._nodes.length - 1]._type = 'courve'
    }
    let npoint = new Point(mx, my, 'angle')
    npoint._visible = true
    npoint.set_style(this._style)
    this._nodes.push(npoint)
  }
  
  is_selected(mx, my) {
    let s = false
    for(var ii = 0; ii < this._nodes.length; ii++) {
      s = this._nodes[ ii ].is_selected(mx, my) | s
    }
    this._selected = s | this._active
    if(this._selected) {
      this._nodes.map((obj) => obj.set_visible(true))
    } else {
      this._nodes.map((obj) => obj.set_visible(false))
    }
    return this._selected
  }
  
  set_selected(status = true, active = false) {
    this._selected = status
    this._active = active
    this._nodes.map((obj) => obj.set_visible(status))
  }
  
  draw() {
    if (this._selected) {
      stroke(this._style.color_select)
      strokeWeight(this._style.line_width_selected)
    } else {
      stroke(this._style.color_line)
      strokeWeight(this._style.line_width)
    }

    _set_style(this._lyt)

    noFill()
    if(this._nodes.length > 1) {
      beginShape()
      for(var ii = 0; ii < this._nodes.length; ii++) {
        if(this._nodes[ ii ]._type == 'courve') {
          curveVertex(this._nodes[ ii ]._x,    this._nodes[ ii ]._y)
        } else {
          vertex(this._nodes[ ii ]._x,    this._nodes[ ii ]._y)
        }
      }
      endShape()
    }

    drawingContext.setLineDash([1])
    this._nodes.forEach( (node) => node.draw(true) )
  }

  drag(mx, my) { 
    if(this._selected) {
      this._nodes.forEach( (node) => node.drag(mx, my) )
    }
  }
  
  rotate_style() {
    if(this._selected) {
      this._lyt = (this._lyt + 1) % 6
    }
  }
}

class AnglePath {
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
    let npoint = new Point(mx, my, 'angle')
    npoint._visible = true
    npoint.set_style(this._style)
    this._nodes.push(npoint) 
  }
  
  is_selected(mx, my) {
    let s = false
    for(var ii = 0; ii < this._nodes.length; ii++) {
      s = this._nodes[ ii ].is_selected(mx, my) | s
    }
    this._selected = s | this._active
    if(this._selected) {
      this._nodes.map((obj) => obj.set_visible(true))
    } else {
      this._nodes.map((obj) => obj.set_visible(false))
    }
    return this._selected
  }
  
  set_selected(status = true, active = false) {
    this._selected = status
    this._active = active
    this._nodes.map((obj) => obj.set_visible(status))
  }
  
  draw() {
    if (this._selected) {
      stroke(this._style.color_select)
      strokeWeight(this._style.line_width_selected)
    } else {
      stroke(this._style.color_line)
      strokeWeight(this._style.line_width)
    }

    _set_style(this._lyt)

    noFill()
    if(this._nodes.length > 1) {
      beginShape()
      for(var ii = 0; ii < this._nodes.length; ii++) {
        vertex(this._nodes[ ii ]._x,    this._nodes[ ii ]._y)
      }
      endShape()
    }

    drawingContext.setLineDash([1])
    this._nodes.forEach( (node) => node.draw(true) )
  }

  drag(mx, my) { 
    if(this._selected) {
      this._nodes.forEach( (node) => node.drag(mx, my) )
    }
  }
  
  rotate_style() {
    if(this._selected) {
      this._lyt = (this._lyt + 1) % 6
    }
  }
}


class AngleClosedPath {
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
    let npoint = new Point(mx, my, 'angle')
    npoint._visible = true
    npoint.set_style(this._style)

    if(this._nodes.length > 0) {
      this._nodes.pop()
    }

    this._nodes.push(npoint) 
    let first = new Point(this._nodes[ 0 ]._x, this._nodes[ 0 ]._y, 'angle')
    first.set_style(this._style)
    this._nodes.push(first)
  }
  
  is_selected(mx, my) {
    let s = false
    for(var ii = 0; ii < this._nodes.length; ii++) {
      s = this._nodes[ ii ].is_selected(mx, my) | s
    }
    this._selected = s | this._active
    if(this._selected) {
      this._nodes.map((obj) => obj.set_visible(true))
    } else {
      this._nodes.map((obj) => obj.set_visible(false))
    }
    return this._selected
  }
  
  set_selected(status = true, active = false) {
    this._selected = status
    this._active = active
    this._nodes.map((obj) => obj.set_visible(status))
  }
  
  draw() {
    if (this._selected) {
      stroke(this._style.color_select)
      strokeWeight(this._style.line_width_selected)
    } else {
      stroke(this._style.color_line)
      strokeWeight(this._style.line_width)
    }

    _set_style(this._lyt)

    noFill()
    if(this._nodes.length > 1) {
      beginShape()
      for(var ii = 0; ii < this._nodes.length; ii++) {
        vertex(this._nodes[ ii ]._x,    this._nodes[ ii ]._y)
      }
      endShape()
    }

    drawingContext.setLineDash([1])
    this._nodes.forEach( (node) => node.draw(true) )
  }

  drag(mx, my) { 
    if(this._selected) {
      this._nodes.forEach( (node) => node.drag(mx, my) )
    }
  }
  
  rotate_style() {
    if(this._selected) {
      this._lyt = (this._lyt + 1) % 6
    }
  }
}