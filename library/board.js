let _actionFont
function preload_map() {
  _actionFont = loadFont('assets/VT323-Regular.ttf')
}

const BOARD_BACKGROUND = "#FAFAFA"
const BOARD_DRAWING = "#FFFFFF"
const BOARD_BORDER = "#AFAFAF"
const DRAW_SELECTED = "#FFD700"
const DRAW_LINE = "#696969"
const DRAW_FILL = "#FFFFFF"
const DRAW_RADIUS_POINT = 2
const DRAW_WIDTH_LINE = 2
const DRAW_WIDTH_LINE_SELECTED = 5
const BOARD_SCALE = 1

const MAR_W = [20, 20]
const MAR_H = [40, 40]

class Board {
  constructor(w, h) {
    this._x = 0
    this._y = 0
    this._w = w
    this._h = h
    this._scale = BOARD_SCALE
    let map_w = this._w - MAR_W[ 0 ] - MAR_W[ 1 ]
    let map_h = this._h - MAR_H[ 0 ] - MAR_H[ 1 ]
    this._map = new Map(MAR_W[ 0 ], MAR_H[ 0 ], map_w, map_h)
    this._style = { 
      board: {
        background: BOARD_BACKGROUND, 
        border: BOARD_BORDER
      },
      draw: {
        color_background: BOARD_DRAWING,
        color_fill: DRAW_FILL,
        color_line: DRAW_LINE,
        color_select: DRAW_SELECTED,
        point_radius: DRAW_RADIUS_POINT,
        line_width: DRAW_WIDTH_LINE,
        line_width_selected: DRAW_WIDTH_LINE_SELECTED
      }
    }
    this._actions = new Actions(this)
    this._action_fs = 17       // font size
    this._action_cur = 0       // current action
    this._action_currblk = 0   // current block
    this._action_running = false
    this._action_on = false
    this._action_rename = false
    this._show_action_bar = false
    this._show_board = true
  }
  
  _draw_actions() {
    noStroke()
    fill(this._style.board.border)
    textFont(_actionFont)
    textSize(this._action_fs)
    text("Map name: "  + this._map._name, MAR_W[ 0 ], MAR_H[ 0 ] - this._action_fs / 2)
    text(
      "(" + this._actions.text_block(this._action_currblk) + ") " + 
        this._actions.text_action(this._action_currblk, this._action_cur), 
      this._x + MAR_W[ 0 ], this._y + this._map._h + MAR_H[ 1 ] + this._action_fs
    )
  }
  
  _draw_action_status() {
    if(this._actions.requires_activation(this._action_currblk, this._action_cur)) {
      noStroke()
      fill(this._style.board.border)
      textFont(_actionFont)
      textSize(this._action_fs)
      if(this._action_on) {
        text("(Action Status) Activate", this._x + this._w - 185 - MAR_W[ 1 ], this._y + this._map._h + MAR_H[ 1 ] + this._action_fs)
      } else {
        text("(Action Status) Deactivate", this._x + this._w - 185 - MAR_W[ 1 ], this._y + this._map._h + MAR_H[ 1 ] + this._action_fs)
      }
    }
  }

  _change_size(inc_w, inc_h) {
    this._w += inc_w
    this._h += inc_h
    this._map._w += inc_w
    this._map._h += inc_h
    resizeCanvas(this._w, this._h, true)
  }

  _change_scale(nsc) {
    this._scale += nsc
  }
  
  draw() {
    // DRAW LAYOUT
    rectMode(CORNER)
    noStroke()
    fill(this._style.board.background)
    rect(this._x, this._y, this._w, this._h)
    if(this._show_board) {
      // DRAW BORDER FOR MAP SECTION
      strokeWeight(4)
      stroke(this._style.board.border)
      fill(this._style.draw.color_background)
      rect(this._map._x, this._map._y, this._map._w, this._map._h)
    }
    
    // DRAW ELEMENTS IN THE MAP
    this._map.draw(this._scale)
    
    // DRAW ACCTIONS BAR
    this._draw_actions()
    this._draw_action_status()
  }

  mouse_clicked(mx, my) {
    if(!this._action_on) { // if no action active => select possible object
      this._map.mouse_clicked(mx, my)
    } else if(this._actions.requires_activation(this._action_currblk, this._action_cur) && this._action_on) {
      this._actions.run(this._action_currblk, this._action_cur, mx, my)
    }
  }

  
  key_pressed(key, keyValue, mx, my) {
    if (key == 17) {
      this._control_active = true
    } else if (key == 27) { // (ESC) Close action if started
      this._action_on = false
      this._action_rename = false
    } else {
      if(this._action_rename) {
        if(key == 8) {
          this._map._name = this._map._name.slice(0, -1);
        } else if(32 <= key && key <= 126) {
          this._map._name += keyValue
        }
      } else {
        key = keyValue.toLowerCase()
        console.log(key)
        switch(key) {
          case "s":
            if(this._control_active) {
              this.export_json()
            } else {
              console.log("rotate_style")
              this._map.rotate_style()
            }
            break
          case "i":
            if(this._control_active) {
              this.export_png()
            } else {
              // TODO:?
            }
            break
          case "r":
            if(this._control_active) {
              this._action_rename = true
            } else {
              this._map.rotate(0.017)
            }
            break
          case "enter":     // Initiate action
            if(this._actions.requires_activation(this._action_currblk, this._action_cur)) {
              this._action_on = true  
            } else {
              this._actions.run(this._action_currblk, this._action_cur, mx, my)
            }
            break
          case ".":    // Move to next action
            this._map.unselect()
            this._action_cur += 1
            if(this._action_cur >= this._actions.len_action(this._action_currblk)) {
              this._action_cur = 0
            }
            break
          case ",":    // Move to previous action
            this._map.unselect()
            this._action_cur -= 1
            if(this._action_cur < 0) {
              this._action_cur = this._actions.len_action(this._action_currblk) - 1
            }
            break
          case "m":    // Move to next action block
            this._map.unselect()
            this._action_currblk += 1
            this._action_cur = 0
            if(this._action_currblk >= this._actions.len_block()) {
              this._action_currblk = 0
            }
            break
          case "n":    // Move to previous action block
            this._map.unselect()
            this._action_currblk -= 1
            this._action_cur = 0
            if(this._action_currblk < 0) {
              this._action_currblk = this._actions.len_block() - 1
            }
            break
          case "backspace":    // detele selected
            this._map.delete()
            break
          default:
            break
        }
      }
    }
  }
  
  key_released(key, keyValue, mx, my) {
    if(key == 17) {
      this._control_active = false
    }
  }
  
  drag(mx, my) { 
    this._map.drag(mx, my)
  }
  
  export_json() {
    if(this._map != null) {
      this._map.export_json(this._w, this._h, this._scale)
    }
  }
  
  import_json(file) {
    this._w = file.data.board.w
    this._h = file.data.board.h
    this._map.import_json(file.data.map)
  }
  
  export_png() {
  	// this._map.export_png()
  }
}