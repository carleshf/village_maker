class Actions {
  constructor(board) {
    this._map = [
      { _text: "Map", _actions: [
        { _text: "Increase 10px in w", _run: function(mx, my) { board._change_size(10, 0) }, _activ: false },
        { _text: "Decrease 10px in w", _run: function(mx, my) { board._change_size(-10, 0) }, _activ: false },
        { _text: "Increase 10px in h", _run: function(mx, my) { board._change_size(0, 10) }, _activ: false },
        { _text: "Decrease 10px in h", _run: function(mx, my) { board._change_size(0, -10) }, _activ: false },
        { _text: "Increase 100px", _run: function(mx, my) { board._change_size(100, 100) }, _activ: false },
        { _text: "Decrease 100px", _run: function(mx, my) { board._change_size(-100, -100) }, _activ: false },
        { _text: "Increase scale by 0.25", _run: function(mx, my) { board._change_scale(0.25) }, _activ: false },
        { _text: "Decrease scale by 0.25", _run: function(mx, my) { board._change_scale(-0.25) }, _activ: false }
      ]},
      { _text: "Terrain", _actions: [
        { _text: "Create path", _run: function(mx, my) { boardAddPathOrNode(board, mx, my) }, _activ: true },
        { _text: "Increase elevation", _run: function(mx, my) { }, _activ: true },
        { _text: "Decrease elevation", _run: function(mx, my) { }, _activ: true },
      ]},
      { _text: "Buildings", _actions: [
        { _text: "Add small rct. house", _run: function(mx, my) { map_add_house(board, mx, my, 0) }, _activ: true },
        { _text: "Add small sqr. house", _run: function(mx, my) { map_add_house(board, mx, my, 1) }, _activ: true },
        { _text: "Add large rect. house", _run: function(mx, my) {  map_add_house(board, mx, my, 2) }, _activ: true },
        { _text: "Add large sqrt. house", _run: function(mx, my) {  map_add_house(board, mx, my, 3) }, _activ: true }
      ]}
    ] 
  }
  
  run(bindex = 0, aindex = 0, mx, my) {
    this._map[bindex]._actions[aindex]._run(mx, my)
  }
  
  len_block() {
    return this._map.length
  }
  
  len_action(bindex = 0) {
    return this._map[bindex]._actions.length
  }
  
  text_block(bindex = 0) {
    return this._map[bindex]._text
  }
  
  text_action(bindex = 0, aindex = 0) {
    return this._map[bindex]._actions[aindex]._text
  }
  
  requires_activation(bindex = 0, aindex = 0){
    return this._map[bindex]._actions[aindex]._activ
  }
}


function map_add_house(board, mx, my, sz = 0) {
  board._map._terrain.forEach( (obj) => obj.set_selected(false) )
  board._map._buildings.forEach( (obj) => obj.set_selected(false) )
  board._map._decor.forEach( (obj) => obj.set_selected(false) )
  
  var nhouse;
  if(sz == 0) {
    nhouse = new TownHouse(mx, my, props = { w: 30, h: 40, ns: 5, ls: 7 })
  } else if(sz == 1) {
    nhouse = new TownHouse(mx, my, props = { w: 30, h: 30, ns: 4, ls: 5 })
  } else if(sz == 2) {
    nhouse = new LargeTownHouse (mx, my, props = { w: 70, h: 90, ns: 10, ls: 15, chm: 1, dor: 2, lyt: 0 })
  } else if(sz == 3) {
    nhouse = new LargeTownHouse (mx, my, props = { w: 70, h: 70, ns: 8, ls: 12, chm: 1, dor: 2, lyt: 0 })
  }
  
  nhouse.set_style(board._style.draw)
  nhouse.set_selected(true, true)

  board._map.add_to_buildings(nhouse)
}

function boardAddPathOrNode(board, mx, my) {
  board._building.forEach((obj) => obj.set_selected(false))
  board._decor.forEach((obj) => obj.set_selected(false))
  
  var sel = board._terrain.filter((obj) => obj.is_selected(mx, my))
  if(sel.length == 1) {
    sel[0].addNode(mx, my)
  } else {
    board._terrain.map((obj) => obj.set_selected(false, false))
    var npath = new Path(mx, my)
    npath.set_selected(true, true)
    board._terrain.push(npath)
  }
}