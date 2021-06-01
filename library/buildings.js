class Building {
  constructor(x, y, ang) {
    this._x = x
    this._y = y
    this._angle = ang
    this._selected = false
    this._active = false
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

  draw(scale_factor) { 
    rectMode(CENTER)
    ellipseMode(RADIUS)

    if (this._selected) {
      stroke(this._style.color_select)
      strokeWeight(this._style.line_width_selected)
    } else {
      stroke(this._style.color_line)
      strokeWeight(this._style.line_width)
    }
    fill(this._style.color_fill)

    push()
    translate(this._x, this._y)
    rotate(this._angle)
    scale(scale_factor)
    
    this._draw()
    
    pop()
  }

  rotate(ang) { 
    if(this._selected) {
      this._angle += ang
    }
  }

  drag(mx, my) { 
    if(this._selected) {
      this._x = mx
      this._y = my
    }
  }

  // Virtual methods
  is_selected(mx, my) { }
  set_selected(status = true, active = false) { }
  rotate_style() { }
}


class TownHouse extends Building {
  constructor(x, y, props = { w: 30, h: 50, ns: 5, ls: 7 }) {
    super(x, y, 0)
    this._w = props.w
    this._h = props.h
    this._sright = []
    this._sleft = []
    this._props = props
    for (let ii = 0; ii < props.ns; ii++) {
      this._sright.push(props.ls)
      this._sleft.push(props.ls)
    }
  }

  is_selected(mx, my) {
    let prev = this._selected
    this._selected = mx >= (this._x - this._w / 2) &&
      mx <= (this._x + this._w / 2) &&
      my >= (this._y - this._h / 2) &&
      my <= (this._y + this._h / 2)

    return prev != this._selected
  }
  
  set_selected(status = true, active = false) {
    this._selected = status
    this._active = active
  }

  _draw() {
    console.log(this._x, this._y)
    // Building
    rect(0, 0, this._w, this._h)
    line(0, -this._h / 2, 0, this._h / 2)
    // Door
    rect(0, this._h / 2 + 2, 15, 3)
    // Roof
    let step = this._h / this._sleft.length
    for (let ii = 0; ii < this._sleft.length; ii += 1) {
      let inc = step * (ii + 1)
      line(-this._w / 2, -this._h / 2 + inc,
        -this._w / 2 + this._sright[ii], -this._h / 2 + inc)
      line(this._w / 2 - this._sleft[ii], -this._h / 2 + inc,
        this._w / 2, -this._h / 2 + inc)
    }
  }

  export_json() {
    let json = {
      type: "TownHouse",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    return json
  }
}

class LargeTownHouse extends Building {
  constructor(x, y, props = { w: 70, h: 90, ns: 10, ls: 6, chm: 1, dor: 2, lyt: 0 }) {
    super(x, y, 0)
    this._w = props.w
    this._h = props.h
    this._sright = []
    this._sleft = []
    for (let ii = 0; ii < props.ns; ii++) {
      this._sright.push(props.ls)
      this._sleft.push(props.ls)
    }
    this._lyt = props.lyt
    this._chimeny = props.chm
    this._door = props.dor
  }
  
  is_selected(mx, my) {
    let prev = this._selected
    this._selected = mx >= (this._x - this._w / 2) &&
      mx <= (this._x + this._w / 2) &&
      my >= (this._y - this._h / 2) &&
      my <= (this._y + this._h / 2)

    return prev != this._selected
  }
  
  set_selected(status = true, active = false) {
    this._selected = status
    this._active = active
  }

  _draw() {
    // Building
    rect(0, 0, this._w, this._h)
    line(0, -this._h / 2, 0, this._h / 2)
    // Roof
    let step = this._h / this._sleft.length
    for (let ii = 0; ii < this._sleft.length; ii += 1) {
      let inc = step * (ii + 1)
      line(-this._w / 2, -this._h / 2 + inc,
        -this._w / 2 + this._sright[ii], -this._h / 2 + inc)
      line(this._w / 2 - this._sleft[ii], -this._h / 2 + inc,
        this._w / 2, -this._h / 2 + inc)
    }
    // Door
    if (this._door == 1) {
      rect(this._w / 4 + 3, this._h / 2 + 2, 20, 4)
    } else if(this._door == 2) {
      rect(-this._w / 4 - 3, this._h / 2 + 2, 20, 4)
    } else {
      rect(0, this._h / 2 + 2, 15, 4)
    }
    // Chimeny
    let cw = this._w / 4
    if (this._chimeny == 0) {
      rect(0, -this._h / 2 + cw / 2, cw, cw)
      line(-cw / 2, -this._h / 2, cw / 2, -this._h / 2 + cw)
      line(-cw / 2, -this._h / 2 + cw, cw / 2, -this._h / 2)
    } else if (this._chimeny == 1) {
      rect(0, 0, cw, cw)
      line(-cw / 2, cw / 2, cw / 2, -cw / 2)
      line(-cw / 2, -cw / 2, cw / 2, cw / 2)
    } else {
      rect(0, this._h / 2 - cw / 2, cw, cw)
      line(-cw / 2, this._h / 2, cw / 2, this._h / 2 - cw)
      line(-cw / 2, this._h / 2 - cw, cw / 2, this._h / 2)
    }
  }
  
  rotate_style() {
    console.log("rotate_style2", this._selected, this._lyt)
    if(!this._selected) {
      return false
    } else {
      this._lyt = (this._lyt + 1) % 9
      switch(this._lyt) {
        case 0:
          this._chimeny = 1
          this._door = 0
          break
        case 1:
          this._chimeny = 1
          this._door = 1
          break
        case 2:
          this._chimeny = 1
          this._door = 2
          break
        case 3:
          this._chimeny = 2
          this._door = 0
          break
        case 4:
          this._chimeny = 2
          this._door = 1
          break
        case 5:
          this._chimeny = 2
          this._door = 2
          break
        case 6:
          this._chimeny = 0
          this._door = 0
          break
        case 7:
          this._chimeny = 0
          this._door = 1
          break
        case 8:
          this._chimeny = 0
          this._door = 2
          break
        default:
          break
      }
      return true
    }
  }

  export_json() {
    let json = {
      type: "LargeTownHouse",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    json.props.lyt = this._lyt
    json.props.chm = this._chimeny
    json.props.dor = this._door
    return json
  }
}