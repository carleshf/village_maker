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

  set_selected(status = true, active = false) {
    this._selected = status
    this._active = active
  }

  // Virtual methods
  is_selected(mx, my) { }
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

  _draw() {
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

class PoolFountain extends Building {
  constructor(x, y, props = { w: 15, ns: 5, rd: 4 }) {
    super(x, y, 0.785)
    this._w = props.w
    this._h = props.w
    this._r = props.rd
    this._lyt = 1
  }

  is_selected(mx, my) {
    let prev = this._selected
    this._selected = dist(this._x, this._y, mx, my) <= this._w
    return prev != this._selected
  }

  _draw() {
    // Lower pools
    var ma = 2 * PI
    var sr = this._w / 2
    if (this._r > 0) {
      let lAngle = ma / this._r
      for (let a = 0; a < ma; a += lAngle) {
        let sx = cos(a) * this._w
        let sy = sin(a) * this._w

        circle(sx, sy, sr)
        circle(sx, sy, sr - sr * 0.35)
      }
    }

    // Main pool
    circle(0, 0, this._w)
    circle(0, 0, this._w - this._w * 0.35)

    // Lines to lower pools
    if (this._r > 0) {
      let lAngle = ma / this._r
      for (let a = 0; a < ma; a += lAngle) {
        let sx2 = 0 + cos(a) * this._w / 5 * 6
        let sy2 = 0 + sin(a) * this._w / 5 * 6

        let sx1 = 0 + cos(a) * this._w / 3
        let sy1 = 0 + sin(a) * this._w / 3

        line(sx1, sy1, sx2, sy2)
      }
    }

    if(this._lyt == 1) {
      noStroke()
      if (this._selected) {
        fill(this._style.color_select)
      } else {
        fill(this._style.color_line)
      }
      circle(0, 0, this._w / 6)
    } else if(this._lyt == 2) {
      // Lines in main pool
      let lAngle = ma / this._r
      for (let a = 0.758; a < ma; a += lAngle) {
        let sx2 = 0 + cos(a) * (this._w / 5 + this._w * 0.25)
        let sy2 = 0 + sin(a) * (this._w / 5 + this._w * 0.25)

        let sx1 = 0 + cos(a) * this._w / 5
        let sy1 = 0 + sin(a) * this._w / 5

        line(sx1, sy1, sx2, sy2)
      }
    }
  }

  rotate_style() {
    if(!this._selected) {
      return false
    } else {
      this._lyt = (this._lyt + 1) % 2
    }
  }

  export_json() {
    let json = {
      type: "PoolFountain",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    json.props.lyt = this._lyt
    return json
  }
}

class Well extends Building {
  constructor(x, y, props = { w: 5 }) {
    super(x, y, 0)
    this._w = props.w
  }

  is_selected(mx, my) {
    let prev = this._selected
    this._selected = dist(this._x, this._y, mx, my) <= this._w
    return prev != this._selected
  }

  _draw() {
    circle(0, 0, this._w)
    line(0, -this._w * 1.2, 0, this._w * 1.2)
  }

  export_json() {
    let json = {
      type: "Well",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    return json
  }
}

class Stall extends Building {
  constructor(x, y, props = { w: 8, h: 15, ns: 4, ls: 3 }) {
    super(x, y, 0)
    this._w = props.w
    this._h = props.h
    this._sleft = []
    this._props = props
    for (let ii = 0; ii < props.ns; ii++) {
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

  _draw() {
    // Roof
    rect(0, 0, this._w, this._h)
    let step = this._h / this._sleft.length
    for (let ii = 0; ii < this._sleft.length; ii += 1) {
      let inc = step * (ii + 1)
      line(this._w / 2 - this._sleft[ii], -this._h / 2 + inc,
        this._w / 2, -this._h / 2 + inc)
    }
  }

  export_json() {
    let json = {
      type: "Stall",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    return json
  }
}

class Tent extends Building {
  constructor(x, y, props = { w: 10, h: 15 }) {
    super(x, y, 0)
    this._w = props.w
    this._h = props.h
    this._props = props
  }

  is_selected(mx, my) {
    let prev = this._selected
    this._selected = mx >= (this._x - this._w / 2) &&
      mx <= (this._x + this._w / 2) &&
      my >= (this._y - this._h / 2) &&
      my <= (this._y + this._h / 2)

    return prev != this._selected
  }

  _draw() {
    let wh = this._w / 2
    let hh = this._h / 2

    beginShape()
    vertex(-wh, hh)
    vertex(  0, hh * 1.25)
    vertex( wh, hh)
    vertex( wh, -hh)
    vertex(  0, -hh * 1.25)
    vertex(-wh, -hh)
    endShape(CLOSE)

    line(0, hh * 1.25, 0, -hh * 1.25)
  }

  export_json() {
    let json = {
      type: "Tent",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    return json
  }
}

class LargeTent extends Building {
  constructor(x, y, props = { w: 15 }) {
    super(x, y, 0)
    this._w = props.w
    this._h = props.h
    this._props = props
  }

  is_selected(mx, my) {
    let prev = this._selected
    this._selected = mx >= (this._x - this._w / 2) &&
      mx <= (this._x + this._w / 2) &&
      my >= (this._y - this._h / 2) &&
      my <= (this._y + this._h / 2)

    return prev != this._selected
  }

  _draw() {
    let angle = TWO_PI / 8
    beginShape()
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = cos(a) * this._w
      let sy = sin(a) * this._w
      vertex(sx, sy)
    }
    endShape(CLOSE)


    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = cos(a) * this._w * 0.75
      let sy = sin(a) * this._w * 0.75
      circle(sx, sy, 1)
    }

    circle(0, 0, 1)
  }

  export_json() {
    let json = {
      type: "LargeTent",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    return json
  }
}

class BigHouseCentralYard extends Building {
  constructor(x, y, props = { w: 100, h: 120, iw: 40, ih: 50, ns: { upex: 6, upin: 4, lrex: 4, lrin: 3}, ls: 6, chm: 0, dor: 0, lyt: 0 }) {
    super(x, y, 0)
    this._w      = props.w
    this._h      = props.h
    this._props  = props
    this._sudex  = [props.ls / 2]
    this._sudin  = [props.ls / 2]
    this._slrex  = [props.ls / 2]
    this._slrin  = [props.ls / 2]
    for (let ii = 0; ii < props.ns.upex - 2; ii++) {
      this._sudex.push(props.ls)
    }
    for (let ii = 0; ii < props.ns.lrex - 2; ii++) {
      this._slrex.push(props.ls)
    }
    for (let ii = 0; ii < props.ns.upin - 2; ii++) {
      this._sudin.push(props.ls)
    }
    for (let ii = 0; ii < props.ns.lrin - 2; ii++) {
      this._slrin.push(props.ls)
    }
    this._sudex.push(props.ls / 2)
    this._slrex.push(props.ls / 2)
    this._sudin.push(props.ls / 2)
    this._slrin.push(props.ls / 2)
    this._door = props.dor
    this._chimeny = props.chm
    this._lyt = props.lyt
  }
  
  is_selected(mx, my) {
    let prev = this._selected
    this._selected = mx >= (this._x - this._w / 2) &&
      mx <= (this._x + this._w / 2) &&
      my >= (this._y - this._h / 2) &&
      my <= (this._y + this._h / 2)

    return prev != this._selected
  }

  _draw() {
    let wh = this._w / 2
    let hh = this._h / 2
    let iwh = this._props.iw / 2
    let ihh = this._props.ih / 2

    // Building
    rect(0, 0, this._w, this._h)
    rect(0, 0, this._w - (this._w - this._props.iw) / 2, this._h - (this._h - this._props.ih) / 2)
    rect(0, 0, this._props.iw, this._props.ih)

    // Roof
    line(-wh, -hh, -iwh, -ihh)
    line( wh, -hh,  iwh, -ihh)
    line( wh,  hh,  iwh,  ihh)
    line(-wh,  hh, -iwh,  ihh)
    
    // Outline up-down
    let step = this._h / (this._sudex.length + 1)
    for (let ii = 0; ii < this._sudex.length; ii += 1) {
      let inc = step * (ii + 1)
      line(-this._w / 2, -this._h / 2 + inc, -this._w / 2 + this._sudex[ii], -this._h / 2 + inc)
      line(this._w / 2 - this._sudex[ii], -this._h / 2 + inc, this._w / 2, -this._h / 2 + inc)
    }

    // Outline left-right
    step = this._h / (this._slrex.length + 2)
    for (let ii = 0; ii < this._slrex.length; ii += 1) {
      let inc = step * (ii + 1)
      line(-this._w / 2 + inc, -this._h / 2 + this._slrex[ii], -this._w / 2  + inc, -this._h / 2)
      line(-this._w / 2 + inc, this._h / 2, -this._w / 2  + inc, this._h / 2 - this._slrex[ii])
    }

    // Inline up-down
    step = this._props.ih / (this._sudin.length + 1)
    for (let ii = 0; ii < this._sudin.length; ii += 1) {
      let inc = step * (ii + 1)
      line(-this._props.iw / 2, -this._props.ih / 2 + inc, -this._props.iw / 2 - this._sudin[ii], -this._props.ih / 2 + inc)
      line(this._props.iw / 2 + this._sudin[ii], -this._props.ih / 2 + inc, this._props.iw / 2, -this._props.ih / 2 + inc)
    }

    // Inline left-right
    step = this._props.ih / (this._sudin.length + 2)
    for (let ii = 0; ii < this._sudin.length; ii += 1) {
      let inc = step * (ii + 1)
      line(-this._props.iw / 2 + inc, this._props.ih / 2 + this._sudin[ii], -this._props.iw / 2 + inc, this._props.ih / 2)
      line(-this._props.iw / 2 + inc, -this._props.ih / 2, -this._props.iw / 2 + inc, -this._props.ih / 2 - this._sudin[ii])
    }

    
    // Exterior Door
    if (this._door == 1) {
      rect(this._w / 4 + 3, this._h / 2 + 2, 20, 4)
    } else if(this._door == 2) {
      rect(-this._w / 4 - 3, this._h / 2 + 2, 20, 4)
    } else {
      rect(0, this._h / 2 + 2, 15, 4)
    }

    // Chimeny
    let cw = this._w / 6
    if (this._chimeny == 0) {
      rect(-this._w / 2 + cw, this._h / 2 - cw, cw, cw)
      rect(-this._w / 2 + cw, this._h / 2 - cw, cw * 0.66, cw * 0.66)
    } else if (this._chimeny == 1) {
      rect(this._w / 2 - cw, -this._h / 2 + cw, cw, cw)
      rect(this._w / 2 - cw, -this._h / 2 + cw, cw * 0.66, cw * 0.66)
    } else if(this._chimeny == 2) {
      rect(-this._w / 2 + cw, -this._h / 2 + cw, cw, cw)
      rect(-this._w / 2 + cw, -this._h / 2 + cw, cw * 0.66, cw * 0.66)
    } else {
      rect(this._w / 2 - cw, this._h / 2 - cw, cw, cw)
      rect(this._w / 2 - cw, this._h / 2 - cw, cw * 0.66, cw * 0.66)
    }
  }
  
  rotate_style() {
    if(!this._selected) {
      return false
    } else {
      this._lyt = (this._lyt + 1) % 12
      switch(this._lyt) {
        case 0:
          this._door = 0
          this._chimeny = 0
          break
        case 1:
          this._door = 0
          this._chimeny = 1
          break
        case 2:
          this._door = 0
          this._chimeny = 2
          break
        case 3:
          this._door = 0
          this._chimeny = 3
          break
        case 4:
          this._door = 1
          this._chimeny = 0
          break
        case 5:
          this._door = 1
          this._chimeny = 1
          break
        case 6:
          this._door = 1
          this._chimeny = 2
          break
        case 7:
          this._door = 1
          this._chimeny = 3
          break
        case 8:
          this._door = 2
          this._chimeny = 0
          break
        case 9:
          this._door = 2
          this._chimeny = 1
          break
        case 10:
          this._door = 2
          this._chimeny = 2
          break
        case 11:
          this._door = 2
          this._chimeny = 3
          break
      }
    }
  }

  export_json() {
    let json = {
      type: "BigHouseCentralYard",
      props: this._props,
      style: this._style
    }
    json.props.x = this._x
    json.props.y = this._y
    json.props.lyt = this._lyt
    json.props.dor = this._door
    json.props.chm = this._chimeny
    return json
  }
}















class Square {
  constructor(x, y, fColor, sColor, angle = 0, sz = [50, 80], cr = [4, 6]) {
    this.x = x
    this.y = y
    this.w = int(random(sz[0], sz[1]))
    this.h = this.w
    this.c = int(random(cr[0], cr[1]))
    this.fillColor = fColor
    this.lineColor = sColor
    this.angle = angle
  }

  isSelected(mX, mY) {
    this.selected = dist(this.x, this.y, mX, mY) <= this.w
    return (this.selected)
  }

  move(mX, mY) {
    if (this.selected) {
      this.x = mX
      this.y = mY
      return true
    }
    return false
  }

  rotate(deg) {
    this.angle = (this.angle + deg) % 360
  }

  draw() {
    if (this.selected) {
      stroke(255, 204, 100)
    } else {
      stroke(this.lineColor)
    }
    fill(this.fillColor)

    push()
    translate(this.x, this.y)
    rotate(this.angle + 45 % 360)

    let lAngle = 360 / this.c
    for (let a = 0; a < 360; a += lAngle) {
      let sx = 0 + cos(a) * this.w
      let sy = 0 + sin(a) * this.w

      strokeWeight(2)
      circle(sx, sy, 20)
      strokeWeight(9)
      point(sx, sy)
    }

    strokeWeight(2)
    circle(0 - 10, 0, 20)
    circle(0, 0 - 10, 20)
    circle(0 + 10, 0, 20)
    circle(0, 0 + 10, 20)
    circle(0, 0, 20)

    pop()
  }
}