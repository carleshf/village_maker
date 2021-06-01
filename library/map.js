
class Map {
  constructor(x, y, w, h) {
    this._x = x
    this._y = y
    this._w = w
    this._h = h
    this._name = "unknown"
    this._terrain = []
    this._buildings = []
    this._decor = []
  }
  
  import_json(data) {
    this._name = data.title
    this._terrain = data.objects.terrain.map( (obj) => terrain_import_json(obj) )
    this._buildings = data.objects.buildings.map( (obj) => buildings_import_json(obj) )
    this._decor = data.objects.decoration.map( (obj) => decoration_import_json(obj) )
  }
  
  export_json(board_w, board_h, board_scale) {
    var filename = this._name.replaceAll(" ", "_") + ".json"
    const json = {
      board: { 
          w: board_w, 
          h: board_w,
          scale: board_scale
      },
      map: {
        title: this._name,
        objects: {
          terrain: this._terrain.map( (obj) => obj.export_json() ),
          buildings: this._buildings.map( (obj) => obj.export_json() ),
          decoration: this._decor.map( (obj) => obj.export_json() )
        }
      }
    }
    save(json, filename)
  }
  
  draw(scale) {
    this._terrain.forEach( (obj) => obj.draw(scale) )
    this._buildings.forEach( (obj) => obj.draw(scale) )
    this._decor.forEach( (obj) => obj.draw(scale) )
  }

  unselect() {
    this._terrain.forEach( (obj) => obj.set_selected(false, false) )
    this._buildings.forEach( (obj) => obj.set_selected(false, false) )
    this._decor.forEach( (obj) => obj.set_selected(false, false) )
  }

  rotate_style() {
    this._terrain.map( (obj) => obj.rotate_style() )
    this._buildings.map( (obj) => obj.rotate_style() )
    this._decor.map( (obj) => obj.rotate_style() )
  }

  rotate(ang) {
    this._terrain.map( (obj) => obj.rotate(ang) )
    this._buildings.map( (obj) => obj.rotate(ang) )
    this._decor.map( (obj) => obj.rotate(ang) )
  }

  drag(mx, my) {
    this._terrain.map( (obj) => obj.drag(mx, my) )
    this._buildings.map( (obj) => obj.drag(mx, my) )
    this._decor.map( (obj) => obj.drag(mx, my) )
  }

  delete() {
    // TODO
  }

  mouse_clicked(mx, my) {
      this._terrain.forEach( (obj) => obj.is_selected(mx, my) )
      this._buildings.forEach( (obj) => obj.is_selected(mx, my) )
      this._decor.forEach( (obj) => obj.is_selected(mx, my) )
  }

  add_to_terrain(obj) { 
    this._terrain.push(obj)
  }

  add_to_buildings(obj) {
    this._buildings.push(obj)
  }

  add_to_decor(obj) {
    this._decor.push(obj)
  }
}
